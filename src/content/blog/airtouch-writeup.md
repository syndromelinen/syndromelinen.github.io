---
title: "airtouch — WPA2-enterprise evil twin walkthrough"
description: "how i rooted airtouch. evil twin setup, EAP credential capture, and pivoting in."
date: "2026-05-18"
tag: "writeup"
---

airtouch was one of those boxes that sits in your head for a while. the attack surface was wireless — a WPA2-Enterprise network — which meant i had to think differently than the usual web/network stuff.

this took three sessions to fully crack.

## recon

initial recon showed a wifi network broadcasting with EAP authentication. no WPS, no WEP — proper enterprise setup. the only way in: become the network.

## building the evil twin

the idea is simple in theory. create a fake AP that looks identical to the target, force clients to connect to yours instead, capture their EAP credentials as they try to auth.

in practice: getting the timing right and making sure your fake AP broadcasts at higher power than the legitimate one is finicky.

```bash
# create rogue AP interface
airbase-ng -a <target_bssid> --essid "TargetNetwork" -c <channel> wlan0mon

# capture EAP handshakes
hostapd-wpe hostapd-wpe.conf
```

## credential capture

once a client connected to the evil twin and attempted to auth, hostapd-wpe logged the NetNTLMv2 hash from the EAP exchange. from there — hashcat.

```bash
hashcat -m 5500 captured.hash /usr/share/wordlists/rockyou.txt
```

cracked in under 2 minutes. the creds were reused on the internal network.

## pivot

with valid domain credentials, pivoted into the internal network. from there it was a more familiar territory — SMB enumeration, privilege escalation.

## what i learned

WPA2-Enterprise is not magic. the EAP exchange leaks credential material if you can position yourself as a rogue AP. the "enterprise" part protects against passive eavesdropping, not active MITM.

defense-wise: certificate validation on the client side kills this attack. most orgs don't configure it properly.
