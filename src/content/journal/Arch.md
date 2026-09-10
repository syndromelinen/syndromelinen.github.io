---

title: "I Use Arch BTW"
description: "Left Windows behind, fell into the Arch rabbit hole, customized everything in sight, and somehow ended up learning Linux along the way."
date: "2026-09-10"
tags:

* Journal
* Linux
* Arch
* HTB
* Personal

---

# I Use Arch BTW

Ykw, I'm so done with Windows. Genuinely. I don't even know how to explain the feeling anymore, but after using it for years, Windows started feeling like it was actively making simple things complicated. Why is this buried six clicks deep in settings? Why did an update decide that *right now* was the perfect time to restart my machine? Why does everything feel like I'm negotiating with the operating system instead of actually using it? I'd already been messing around with Linux before this, had Ubuntu dual booted at one point, and even had Kali running inside a VM on Windows for my PortSwigger and HTB grind, but that always felt like I was visiting Linux rather than actually living in it.

Then one day I got that stupid little itch in my brain. I just wanted to install Arch and actually figure out what the hell was going on underneath everything. Not Ubuntu, not Mint, not something that holds my hand through every single step. I wanted to sit there, make decisions myself, probably break something, spend an unreasonable amount of time searching for the fix, and then feel unnecessarily proud when it finally worked. Basically, I wanted the full Linux experience without pretending I already knew what I was doing.

My first instinct was to dual boot straight onto bare metal, but I pumped the brakes pretty quickly because I'd literally never dual booted anything before. Also, the computer I was using wasn't exactly mine to gamble with. It's a shared family PC, so accidentally nuking Windows because I wanted to become a Linux nerd would've been a pretty awkward family meeting. I figured maybe I should practice before I start deleting partitions like I know what I'm doing.

So I built a VM first. I threw EndeavourOS into VirtualBox, gave it 6GB of RAM, 4 cores and an 80GB virtual disk, enabled EFI and basically created myself a little Linux laboratory. I wanted the VM to be close enough to a real UEFI setup that I could learn the process before touching an actual drive. I ended up choosing EndeavourOS instead of going completely vanilla Arch because it still gives me the Arch experience underneath while Calamares takes away some of the initial installation pain. I looked at CachyOS too, but EndeavourOS felt closer to what I actually wanted to learn.

Then came KDE Plasma. I almost went with GNOME because, you know, *minimalism, discipline, productivity, serious Linux user™*. But then I thought about what I actually do on my machine. Burp Suite open, browser open, terminals everywhere, maybe Metasploit somewhere, notes on another screen, and probably twenty other things I forgot I had running. KDE just made more sense for that workflow. I wanted windows I could move around, snap, resize and abuse however I wanted. GNOME's minimalist philosophy is cool, but I'm not trying to meditate in my desktop environment. I need six windows open at once.

The installation itself wasn't even that dramatic, which almost made me suspicious. I booted the ISO, went through Calamares, picked the fresh virtual disk, selected KDE, configured swap with hibernation support and went with systemd-boot. Everything installed perfectly and I thought, "Damn, I actually did it." Then the VM rebooted and went straight back into the installer, which was a fantastic way to immediately humble myself.

I stared at the screen for a good minute wondering what kind of ancient Linux curse I'd activated. Turns out the ISO was still mounted as a virtual optical drive, so VirtualBox was happily booting from the installer again. Removed the ISO from the virtual storage, rebooted, and there it was. My KDE desktop, my first actual Arch-based environment, and the beginning of what would eventually become a completely unnecessary amount of customization.

Because apparently having a working operating system wasn't enough. I had to make it *mine*.

I started messing with everything I could find. Bash had to go, so I moved over to Zsh and immediately started throwing more stuff on top of it. Then I installed Starship and suddenly my terminal had an actual personality. Git branches showing up automatically, Python environments appearing when I'm inside one, useful context displayed without me having to manually check everything... none of this was strictly necessary, obviously, but once you start customizing stuff like this, "necessary" stops being part of the conversation.

The funniest part is that half of these customizations started with "this looks cool" and eventually became things I actually use every day. That's probably how the whole setup spiralled in the first place. I'd find one little thing, install it because it looked nice, realize it was actually useful, and then immediately start wondering what else I could change. At some point I wasn't setting up Linux anymore, I was decorating my digital bedroom.

I added Zsh autosuggestions because apparently typing commands myself wasn't enough anymore. Now the terminal starts guessing what I'm about to type based on my history, which is both incredibly useful and slightly concerning because it exposes how repetitive I am. Syntax highlighting came next, so commands get highlighted as I type them and obvious mistakes stand out before I hit Enter. Basically, my terminal became a tiny second brain that occasionally looks at what I'm typing and goes, "Bro... are you sure?"

Then I found eza and `ls` was officially retired. I know it's literally just a modern replacement for listing files, but once you've got cleaner output, colors and icons, going back to plain `ls` suddenly feels like you've travelled backwards in time. Is it life changing? No. Did I install it anyway because my terminal looked cooler? Absolutely. This is how it starts, by the way. One innocent little replacement for `ls`, and suddenly you're three hours deep into someone's dotfiles repository.

Then came tmux. This was probably the point where I stopped pretending I was just "setting up Linux" and accepted that I was customizing this thing because I enjoyed it. Multiple panes, persistent sessions, terminals inside terminals... suddenly I had my screen split into several sections just because I could. Then I added the Dracula theme through TPM because apparently functionality alone wasn't enough anymore.

Now the terminal looks like something straight out of a hacker movie. What am I actually doing in there? Probably `sudo pacman -Syu`, opening a man page, or staring at a terminal because I forgot what command I was supposed to run. But visually? Yeah, bro, we're cooking.

TPM itself gave me a little character development too. I kept pressing the plugin install keybind and wondering why absolutely nothing was happening. Turns out I had forgotten to actually clone TPM in the first place, so I was basically asking a plugin manager that didn't exist to install plugins that also didn't exist. Peak Linux moment. Once I finally figured that out, tmux started behaving and suddenly the terminal looked exactly how I wanted it to.

Then I started building the actual pentesting environment. BlackArch isn't some completely separate operating system that you need to download and install alongside Arch. It's essentially a repository you can add to an Arch-based system, which is exactly what I wanted. I added it and started pulling in the tools I actually needed.

```bash
curl -O https://blackarch.org/strap.sh
chmod +x strap.sh
sudo ./strap.sh
```

Then I installed the curated bundle:

```bash
sudo pacman -S --needed blackarch-officials
```

And suddenly I had access to a ridiculous collection of security tools. Nmap, SQLmap, John, Hashcat, Wireshark, Ghidra, Metasploit and a whole bunch of other stuff were available without me having to manually hunt down every package. It felt like I'd just unlocked an unnecessarily large inventory in a game and immediately started wondering what half of the tools even did.

At some point I went completely overboard and installed the entire BlackArch meta package too. Was that necessary? Absolutely not. Did I have the disk space? Yep. Did I install it anyway? You already know the answer. There is something deeply satisfying about having thousands of tools available even when you know you're probably going to use about fifteen of them.

The mirror situation was another adventure entirely. Mirrors kept timing out, downloads were randomly crawling, and reflector was doing its best impression of a tool that had personally decided it didn't like me. I eventually found EndeavourOS's `eos-rankmirrors`, which worked much better for my setup and ranked the mirrors automatically. One command later and suddenly downloads that had been crawling were flying.

Linux teaches you a weird kind of patience. You spend twenty minutes thinking something is broken, search around, discover that you forgot one tiny thing, fix it, and suddenly feel like you've just solved a major infrastructure incident. Then you realize the actual problem was a typo. Character development.

Burp Suite was another little rabbit hole. Since it wasn't sitting in the official repositories I wanted, I used the AUR through `yay`.

```bash
yay -S burpsuite
```

Then came the usual setup. Firefox was configured to use Burp through `127.0.0.1:8080`, I grabbed the Burp CA certificate through the special Burp address, imported it into Firefox and finally had HTTPS interception working properly for my PortSwigger labs. That part was especially satisfying because it wasn't just installing another application. The browser, proxy, certificate and lab environment were all finally working together exactly how I wanted them to.

Then 80GB stopped being enough. Of course it did. I'd installed security tools, wordlists, packages, random experiments and God knows what else, and suddenly the virtual disk was getting cramped. So I decided to learn another fun Linux lesson: resizing partitions.

I resized the VDI from the Windows side using `VBoxManage`, then booted into the VM and had to deal with the actual Linux partition layout. The annoying part was that the swap partition was sitting right in the middle, blocking the root partition from expanding into the new free space. So I had to remove the swap partition, extend the root partition, recreate swap, resize the ext4 filesystem with `resize2fs`, and then update `fstab` with the new swap UUID.

At 2 AM, this felt like the most important systems administration task in human history. Looking back, it was just me making my virtual disk bigger because I installed too much stuff. But that's Linux. You break something, you research it, you fix it, and somewhere along the way you accidentally learn how the thing actually works.

Eventually though, the VM started feeling like a VM. The machine was running inside Windows, sharing resources with Windows, and slowly getting heavier as I added more things. There was always that extra layer between me and the hardware. It worked, but I kept thinking about what it would feel like if Linux just had the whole machine instead of being another window sitting inside Windows.

So eventually I stopped thinking about it and actually did it.

Bare metal.

I had a 249GB SSD that was mostly unused, so I moved everything important off it onto an external drive, wiped it, plugged in the EndeavourOS USB and went through the installation again. Except this time I wasn't nervous. I'd already broken things in the VM, fixed the boot problem, dealt with partitions, resized the disk and spent enough time staring at Linux errors to stop being intimidated by them.

So when I got to the installer on real hardware, everything felt familiar. KDE again, systemd-boot again, dedicated drive, install, done. And holy shit, the difference was immediately noticeable. The VM was fine, but this felt completely different. No virtualization layer, no fighting Windows for resources, no extra filesystem overhead, just Linux sitting directly on the hardware. Even with the same SSD underneath it all, everything felt noticeably more responsive.

And once the system was finally mine, I started customizing it even harder, because apparently I had learned nothing.

The shell got polished, the terminal got polished, tmux got polished, Firefox got separated into profiles, my notes got organized and my Git setup got configured. Every little part slowly became part of the same workflow. It stopped feeling like a random collection of software and started feeling like an environment I'd intentionally built around the way I actually work.

I created separate Firefox profiles so my pentesting environment stayed separate from my personal browsing. One profile is dedicated to security work and has Burp configured, while the others are for my normal accounts. That separation might sound like a tiny thing, but when you're switching between normal browsing and security labs constantly, it makes the whole workflow feel much cleaner. It's one of those things that you don't think you need until you actually use it and then wonder why you didn't do it earlier.

The notes setup got its own little ecosystem too. I've got three Obsidian vaults: **Ken Messed Up**, **Ken Field Manual**, and **Pen PortSwigger**. Even my notes have lore now. They're synced through GitLab using SSH keys generated on this machine, with the Obsidian Git plugin handling the pull and push side of things. So the notes aren't just sitting on one machine anymore. They're part of the same workflow as everything else.

And that's probably the part of this whole thing I didn't expect. I thought I was installing Linux because I was tired of Windows. Then I thought I was setting up Linux because I wanted a better pentesting environment. Then I realized I was actually building an environment around the way I think and work. That's a completely different feeling.

Every little configuration exists because I chose it. Every tool is there because I wanted it. Every shortcut, shell plugin, browser profile, terminal layout and note system came from me experimenting, breaking something, getting annoyed, searching for an answer and eventually fixing it. It doesn't feel like I'm using somebody else's computer anymore. It feels like **my environment**.

And yeah, some of the customization is absolutely just me LARPing. I'm not going to pretend otherwise. I've got the fancy terminal prompt, the Dracula tmux theme, the icons, the split panes, the different Firefox profiles, the security tools and all the little details that make the machine look unnecessarily serious. But honestly, I like it, and that's enough of a reason.

There's something satisfying about opening the terminal and seeing something that you built yourself. Not because it's objectively better than someone else's setup, but because you know exactly why it's there. You remember the stupid problem you had when you installed it, the configuration you messed up and the command you had to search for at 2 AM. Eventually all those little frustrations become part of the system, and somehow the broken things become part of the story too.

A few weeks ago, if someone told me I'd be manually resizing Linux partitions, debugging `fstab` UUIDs, ranking mirrors, configuring Burp, setting up tmux, building a proper shell environment and syncing my entire notes workflow through GitLab, I probably would've laughed. Now I'm sitting here thinking, yeah, I actually did all that. And somehow I enjoyed it, which is probably the biggest sign that I was meant to fall down this particular rabbit hole.

That's probably why Arch clicked with me more than I expected. It doesn't constantly try to hide the machine from you. It gives you the pieces and basically says, "Here. Figure it out." Sometimes you absolutely fuck it up, sometimes you spend an hour fixing something that should've taken five minutes, but when you finally get it working, you understand a little more than you did before. That's what I wanted from the beginning.

Not just another operating system. I wanted something I could actually learn from, something I could customize without feeling like I was fighting against the system, and something that would let me build my own workflow instead of forcing me into somebody else's idea of how I should use a computer.

So yeah, if you're thinking about going down this rabbit hole yourself, start in a VM if you're nervous. It's a ridiculously good playground for learning without putting your actual machine at risk. Break things there, reinstall it, resize stuff, mess with the bootloader, try different desktops and customize the hell out of it. Once you're comfortable enough, go bare metal. Just maybe don't do it on the family computer. Trust me on that one.

And now, after all that, I'm finally getting back to the stuff I actually wanted to spend my time on. HTB , development, programming, research, writing and all the other things I've been putting on pause while I dealt with exams and everything else. I've got a ridiculous amount left to learn, but at least now I've got an environment that actually feels like it's built around the way I want to work.

I know half of this customization was probably unnecessary. I could've installed a distro, opened a terminal and just started working, but where's the fun in that? I wanted to build something that felt like mine, and somewhere between fixing partitions at 2 AM and making my terminal look unnecessarily serious, I ended up learning a hell of a lot more than I expected.

So yeah, that's pretty much the story. I left Windows, went down the Arch rabbit hole, broke a few things, fixed a few more, customized the shit out of everything and somehow ended up with a setup I genuinely enjoy using. Maybe I'm LARPing a little too hard, but honestly, I'm having fun with it, and for once I don't think I need a better reason than that.

