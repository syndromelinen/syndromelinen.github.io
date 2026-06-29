---
title: "nmap & enumeration"
meta: "theory + cheatsheet · CPTS path · built from memory"
tag: "cybersec"
updated: "2026-06-10"
---

## what nmap actually is

nmap (network mapper) sends crafted packets to target hosts and analyses responses to determine what's running, what's open, and what OS is probably underneath. it operates at the packet level — you're not "connecting" in the traditional sense.

## scan types

| flag | type | notes |
|------|------|-------|
| `-sS` | SYN/stealth | default for root. sends SYN, doesn't complete handshake |
| `-sT` | TCP connect | no root needed. noisier. full handshake |
| `-sU` | UDP | painfully slow. be surgical |
| `-sV` | version detection | service fingerprinting |
| `-sC` | default scripts | runs NSE scripts in the default category |
| `-A` | aggressive | OS detect + version + scripts + traceroute |
| `-O` | OS detect | needs root. not always accurate |

## timing templates

`-T0` through `-T5`. T1 is slow/quiet. T5 is loud/fast. default is T3.

for anything real: `-T4` is a decent balance. `-T1` or `-T2` if you need to stay quiet.

## port selection

```bash
# top 1000 (default)
nmap <target>

# all ports
nmap -p- <target>

# specific ports
nmap -p 22,80,443,8080 <target>

# top 100
nmap --top-ports 100 <target>
```

## output formats

```bash
-oN output.txt    # normal text
-oX output.xml    # XML (for importing)
-oG output.gnmap  # grepable
-oA output        # all three
```

## useful combinations i actually run

```bash
# initial sweep — fast, quiet
nmap -sV -sC -p- --open -T4 -oA initial <target>

# UDP top ports
nmap -sU --top-ports 20 -T4 <target>

# vuln scripts
nmap --script vuln -p <open_ports> <target>
```

## what trips people up

- UDP scans look like everything is `open|filtered` unless there's a response — that's normal
- `-sV` can trigger IDS. version detection sends extra probes
- `--open` flag: filters output to only show open ports. use it
- firewall rules can make ports look closed when they're filtered — check the state carefully
- some services respond differently to `-sC` scripts than they do to manual probing
