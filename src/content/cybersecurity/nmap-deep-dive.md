---
title: "Nmap deep dive: what I learned going methodical"
description: "The flags that tripped me up, UDP scanning, and why --open is underrated."
date: "2026-06-01"
tags: ["nmap", "enumeration", "CPTS", "recon"]
---

I thought I knew nmap. I didn't.

Going through the CPTS Nmap module properly, reading, closing, writing from memory, surfaced a lot of gaps.

## scan types that actually matter

| flag | what it does |
|------|-------------|
| `-sS` | SYN scan, default for root, doesn't complete handshake |
| `-sU` | UDP scan, brutally slow, be surgical |
| `-sV` | version detection, sends extra probes (can trigger IDS) |
| `-sC` | default NSE scripts |
| `-A` | aggressive: OS + version + scripts + traceroute |

## timing

`-T1` through `-T5`. T4 for most situations. T1/T2 when staying quiet matters.

## what tripped me up

**UDP scans**: everything shows as `open|filtered` unless there's a response. that's normal. factor in 20+ minutes for full range.

**`--open` flag**: filters to only open ports in output. i was drowning in filtered/closed noise before this.

**`-sV` is noisy**: version detection sends extra probes. on live assessments, be deliberate about when you use it.

## the commands i actually run

```bash
# initial sweep
nmap -sV -sC -p- --open -T4 -oA initial <target>

# UDP top ports
nmap -sU --top-ports 20 -T4 <target>

# vuln scripts
nmap --script vuln -p <open_ports> <target>
```

building this cheatsheet from memory was the whole point. if i can write it, i learned it.
