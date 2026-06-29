---
title: "week 01 — starting the grind properly"
description: "first week log. nmap, enumeration basics, and why i'm doing this the slow way."
date: "2026-06-01"
tag: "cybersec"
---

started the CPTS path for real this week. not skipping, not jumping around — going start to finish.

the nmap module is deceptively deep. i thought i knew nmap. i didn't.

## what i actually learned

`-sV` for version detection is obvious. but the timing flags — `-T1` through `-T5` — those matter way more than i realised when you're trying to stay quiet. and `--script` chains are something i've been lazy about.

built my first proper cheatsheet entry from memory. the rule: no copying from the module. read it, close it, write what i remember. if i can't write it, i didn't learn it.

## the setup

obsidian vault: two files per topic.
- `nmap-theory.md` — what it is, how it works, edge cases
- `nmap-cheatsheet.md` — commands i'd actually run in the field

no screenshots of module content. no paste jobs. just my own words.

## what tripped me up

`-sU` (UDP scan) is brutally slow. not just "a bit slow" — we're talking 20+ minutes for a full range. had to learn to be surgical about which UDP ports i actually care about.

also: `--open` flag. filters to only open ports in output. obvious in hindsight but i was drowning in filtered/closed noise before that.

---

week 1 down. the path is long. that's the point.
