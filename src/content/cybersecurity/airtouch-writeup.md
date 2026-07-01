---
title: "AirTouch — WPA2-Enterprise evil twin walkthrough"
description: "How I rooted AirTouch. Evil twin setup, EAP credential capture, and pivoting in."
date: "2026-05-18"
tags: ["HTB", "wireless", "WPA2", "evil-twin"]
---

AirTouch was one of those boxes that sits in your head for a while. the attack surface was wireless — a WPA2-Enterprise network — which meant thinking differently than the usual web or network stuff.

this took three sessions.

## recon

initial recon showed a WiFi network broadcasting with EAP authentication. no WPS, no WEP — proper enterprise setup. the only way in: become the network.

## building the evil twin

the idea is simple in theory. create a fake AP that looks identical to the target, force clients to connect to yours instead, capture their EAP credentials as they try to auth.

```bash
# create rogue AP
airbase-ng -a <target_bssid> --essid "TargetNetwork" -c <channel> wlan0mon

# capture EAP handshakes
hostapd-wpe hostapd-wpe.conf
```

## credential capture

once a client connected and attempted to auth, hostapd-wpe logged the NetNTLMv2 hash from the EAP exchange. from there — hashcat.

```bash
hashcat -m 5500 captured.hash /usr/share/wordlists/rockyou.txt
```

cracked in under 2 minutes. creds were reused on the internal network.

## what i learned

WPA2-Enterprise is not magic. the EAP exchange leaks credential material if you can position yourself as a rogue AP. certificate validation on the client side kills this attack. most orgs don't configure it properly.
