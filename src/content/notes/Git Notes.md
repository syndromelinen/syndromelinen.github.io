---
title: "Git & GitHub Notes"
description: "..."
date: "2026-07-18"
tags:
  - Git
  
---
> **By**: Kenneth Solomon  
---

## Table of Contents

1. [What is Version Control?](#1-what-is-version-control)
2. [What is Git?](#2-what-is-git)
3. [What is GitHub?](#3-what-is-github)
4. [Installing Git](#4-installing-git)
5. [Git Configuration (First-Time Setup)](#5-git-configuration-first-time-setup)
6. [Core Concepts You Must Know](#6-core-concepts-you-must-know)
7. [Creating Your First Repository](#7-creating-your-first-repository)
8. [The Git Workflow (Daily Use)](#8-the-git-workflow-daily-use)
9. [Staging & Committing](#9-staging--committing)
10. [Viewing History & Status](#10-viewing-history--status)
11. [Undoing Things](#11-undoing-things)
12. [Branching](#12-branching)
13. [Merging](#13-merging)
14. [Rebasing](#14-rebasing)
15. [Remote Repositories](#15-remote-repositories)
16. [GitHub: Getting Started](#16-github-getting-started)
17. [Pushing & Pulling](#17-pushing--pulling)
18. [Cloning a Repository](#18-cloning-a-repository)
19. [Forking & Pull Requests](#19-forking--pull-requests)
20. [GitHub Issues](#20-github-issues)
21. [GitHub Actions (CI/CD Intro)](#21-github-actions-cicd-intro)
22. [gitignore](#22-gitignore)
23. [Git Tags & Releases](#23-git-tags--releases)
24. [Git Stash](#24-git-stash)
25. [Git Aliases](#25-git-aliases)
26. [Advanced Git Commands](#26-advanced-git-commands)
27. [Git Internals (How Git Works Under the Hood)](#27-git-internals-how-git-works-under-the-hood)
28. [Collaboration Workflows](#28-collaboration-workflows)
29. [SSH Keys & GitHub Authentication](#29-ssh-keys--github-authentication)
30. [Common Mistakes & Fixes](#30-common-mistakes--fixes)
31. [Quick Reference Cheat Sheet](#31-quick-reference-cheat-sheet)

---

## 1. What is Version Control?

### Theory

Imagine you're writing a college project report. You save it as:

```
report.docx
report_v2.docx
report_final.docx
report_final_REAL.docx
report_final_REAL_v2.docx
```

This is **manual version control** — chaotic, error-prone, and wasteful.

**Version Control Systems (VCS)** solve this. They:

- Track every change ever made to a file
- Let you go back to any previous version
- Allow multiple people to work on the same files without overwriting each other
- Tell you **who** changed **what**, **when**, and **why**

### Types of Version Control

| Type | How it works | Example |
|------|-------------|---------|
| **Local VCS** | Database of changes on your own machine | RCS |
| **Centralized VCS (CVCS)** | Single central server; everyone checks out from it | SVN, CVS |
| **Distributed VCS (DVCS)** | Every user has the **full history** of the project locally | **Git**, Mercurial |

Git is a **Distributed VCS** — meaning even if the central server (GitHub) goes down, every developer has a complete copy of the project.

---

## 2. What is Git?

### Theory

Git is a **free, open-source distributed version control system** created by **Linus Torvalds** in **2005** (the same person who created Linux). He built it in just 2 weeks!

Git is:
- **Fast** — Most operations are local (no network needed)
- **Distributed** — Full copy of repo on every machine
- **Branching-friendly** — Creating branches is cheap and fast
- **Data integrity** — Every file and commit is checksummed using SHA-1 hashes

### How Git thinks about data

Most VCS systems store data as **changes to files** (delta-based). Git thinks differently.

Git takes a **snapshot** of all your files every time you commit. If a file hasn't changed, Git stores a link to the previous identical file rather than storing it again.

```
Delta-based (other VCS):
  File A → Δ1 → Δ2 → Δ3

Git (snapshot-based):
  Commit 1: [File A v1] [File B v1] [File C v1]
  Commit 2: [File A v2] [File B v1*] [File C v2]  ← B unchanged, just linked
```

### The Three States of Git

This is **the most important concept** to understand in Git.

Every file in Git can be in one of **three states**:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Working        Staging Area        Repository         │
│   Directory      (Index)             (.git folder)      │
│                                                         │
│   [modified]  →  [staged]       →    [committed]        │
│                                                         │
│   You edit      git add              git commit         │
│   files here    adds to staging      saves snapshot     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

- **Working Directory**: Where you edit files on your computer
- **Staging Area (Index)**: A preparation zone — you choose which changes to include in the next commit
- **Repository (.git folder)**: The permanent database of all your snapshots/commits

---

## 3. What is GitHub?

### Theory

**GitHub** is a **web-based hosting platform** for Git repositories. It adds:

- A visual interface to browse your code
- Cloud storage for your repositories
- **Collaboration tools**: Issues, Pull Requests, Project Boards
- **CI/CD**: GitHub Actions to automate testing and deployment
- A social layer: Follow developers, star projects, fork repos

> **Key distinction**: Git is the tool. GitHub is the website. You can use Git without GitHub (with GitLab, Bitbucket, or no remote at all).

### GitHub vs GitLab vs Bitbucket

| Feature | GitHub | GitLab | Bitbucket |
|---------|--------|--------|-----------|
| Owned by | Microsoft | GitLab Inc. | Atlassian |
| Free private repos | ✅ Yes | ✅ Yes | ✅ Yes |
| CI/CD | GitHub Actions | GitLab CI | Bitbucket Pipelines |
| Most popular for | Open Source | DevOps | Atlassian ecosystem |

---

## 4. Installing Git

### On Windows

1. Download the installer from: https://git-scm.com/download/win
2. Run the installer (use default settings for beginners)
3. This installs **Git Bash** — use this terminal for all Git commands

### On macOS

```bash
# Option 1: Install Xcode Command Line Tools (installs Git)
xcode-select --install

# Option 2: Using Homebrew
brew install git
```

### On Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install git -y
```

### On Linux (Fedora/RHEL)

```bash
sudo dnf install git -y
```

### Verify Installation

```bash
git --version
# Output: git version 2.x.x
```

---

## 5. Git Configuration (First-Time Setup)

Before using Git, you need to tell it who you are. This info is attached to every commit you make.

### Setting Your Identity

```bash
# Set your name
git config --global user.name "Kenneth Solomon"

# Set your email (use the same one as your GitHub account!)
git config --global user.email "kenneth@example.com"
```

### Setting Your Default Editor

```bash
# Use VS Code as your editor
git config --global core.editor "code --wait"

# Use Vim (default on many systems)
git config --global core.editor "vim"

# Use Nano (beginner-friendly)
git config --global core.editor "nano"
```

### Setting Default Branch Name

GitHub uses `main` as default. Let's match that:

```bash
git config --global init.defaultBranch main
```

### Configuring Line Endings

```bash
# Windows users: convert LF to CRLF on checkout, CRLF to LF on commit
git config --global core.autocrlf true

# Mac/Linux users: convert CRLF to LF on commit only
git config --global core.autocrlf input
```

### Viewing Your Configuration

```bash
# View all configuration
git config --list

# View a specific setting
git config user.name
git config user.email

# View config file directly
cat ~/.gitconfig
```

### Configuration Levels

| Level | Flag | File Location | Scope |
|-------|------|--------------|-------|
| System | `--system` | `/etc/gitconfig` | All users on machine |
| Global | `--global` | `~/.gitconfig` | Your user account |
| Local | `--local` | `.git/config` | Just this repo |

Local overrides Global, which overrides System.

---

## 6. Core Concepts You Must Know

### Repository (Repo)

A folder tracked by Git. It contains your project files + a hidden `.git` folder that stores all history.

### Commit

A **snapshot** of your project at a point in time. Each commit has:
- A unique SHA-1 hash (like `a3f2b91c...`)
- Author name and email
- Timestamp
- Commit message
- Pointer to parent commit(s)

### Branch

A **lightweight movable pointer** to a specific commit. The default branch is called `main` (or `master` in older projects). Branches let you work on features without affecting the main codebase.

```
main:    A → B → C → D
                  ↘
feature:           E → F → G
```

### HEAD

`HEAD` is a special pointer that tells Git: **"this is where you are right now"**. It usually points to the latest commit on your current branch.

```
main: A → B → C ← HEAD
```

When you switch branches, HEAD moves. When you commit, HEAD advances forward.

### Remote

A version of your repository hosted on another computer (like GitHub). Conventionally called `origin`.

### Clone

Making a complete local copy of a remote repository.

### Fork

Making a copy of someone else's GitHub repository into your own GitHub account.

### Pull Request (PR)

A request to merge your changes into another branch, often with code review.

---

## 7. Creating Your First Repository

### Method 1: Initialize a New Repo (Local First)

```bash
# Create a new folder
mkdir my-first-project
cd my-first-project

# Initialize Git in this folder
git init
```

**What happens**: Git creates a hidden `.git` folder. This folder IS your repository — it stores everything.

```bash
# See the hidden .git folder
ls -la
# You'll see: .git/
```

### Method 2: Clone an Existing Repo (from GitHub)

```bash
git clone https://github.com/username/repository-name.git
cd repository-name
```

### Method 3: Create on GitHub First, Then Clone

1. Go to github.com → Click "New" (green button)
2. Enter repo name, description, choose public/private
3. Check "Add a README file"
4. Click "Create repository"
5. Copy the HTTPS URL
6. Run: `git clone <URL>`

### Verify Your Repo

```bash
# Check Git status (run this constantly!)
git status

# Output for a fresh empty repo:
# On branch main
# No commits yet
# nothing to commit (create/copy files and use "git add" to track)
```

---

## 8. The Git Workflow (Daily Use)

This is the core loop you'll repeat hundreds of times:

```
1. Edit/create files         (Working Directory)
        ↓
2. git add <files>           (Staging Area)
        ↓
3. git commit -m "message"   (Repository)
        ↓
4. git push                  (Remote/GitHub)
```

### Practical Example: Your First Commit

```bash
# Step 1: Create a file
echo "# My First Project" > README.md
echo "Hello, Git World!" >> README.md

# Step 2: Check what Git sees
git status
# Output: README.md is "Untracked" (Git sees it but isn't tracking it yet)

# Step 3: Stage the file
git add README.md

# Step 4: Check status again
git status
# Output: README.md is "Changes to be committed" (staged)

# Step 5: Commit
git commit -m "Initial commit: Add README"

# Step 6: Check the log
git log
```

---

## 9. Staging & Committing

### git add — Adding to Staging

```bash
# Add a specific file
git add filename.txt

# Add multiple specific files
git add file1.txt file2.txt

# Add all files in current directory and subdirectories
git add .

# Add all .py files
git add *.py

# Add all files in a specific folder
git add src/

# Add changes interactively (choose line by line)
git add -p
git add --patch

# Add all tracked files that have been modified (not new untracked files)
git add -u
```

### Understanding Staged vs Unstaged

```bash
# Show changes NOT yet staged (working dir vs staging)
git diff

# Show changes that ARE staged (staging vs last commit)
git diff --staged
git diff --cached   # same thing

# Show all changes (working dir vs last commit)
git diff HEAD
```

### git commit — Creating Snapshots

```bash
# Basic commit with message
git commit -m "Your message here"

# Commit with multi-line message (opens editor)
git commit

# Stage all tracked modified files AND commit in one step
git commit -am "Message"
# Note: -am does NOT add NEW (untracked) files

# Amend the last commit (change message or add forgotten files)
git add forgotten_file.txt
git commit --amend -m "Corrected commit message"
# WARNING: Only amend commits that haven't been pushed!
```

### Writing Good Commit Messages

A good commit message answers: **"What does this commit do?"**

```
# Bad commit messages:
fix stuff
update
changes
WIP
aaaaaa

# Good commit messages:
Add user authentication with JWT tokens
Fix null pointer exception in login handler
Remove deprecated API endpoints from v1
Update README with installation instructions
```

**Commit message format (professional)**:
```
<type>: <short summary> (50 chars max)

<optional body explaining WHY, not WHAT>

<optional footer: issue numbers, breaking changes>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat: Add password reset functionality

Users can now request a password reset email from the login page.
Token expires after 24 hours for security.

Closes #42
```

---

## 10. Viewing History & Status

### git status

```bash
# Show working tree status
git status

# Short/compact version
git status -s
git status --short

# Short output legend:
# ?? = Untracked (new file not tracked)
# A  = Added to staging
# M  = Modified
# D  = Deleted
# R  = Renamed
# MM = Modified in staging AND working dir
```

### git log — Viewing Commit History

```bash
# Full log (default)
git log

# One-line per commit
git log --oneline

# Show last N commits
git log -3
git log -10

# Show with stats (files changed, insertions, deletions)
git log --stat

# Show actual changes (patch/diff)
git log -p
git log --patch

# Beautiful graph view (great for branches)
git log --oneline --graph --all --decorate

# Search by author
git log --author="Kenneth"

# Search commits by message keyword
git log --grep="authentication"

# Show commits between two dates
git log --after="2024-01-01" --before="2024-12-31"

# Show commits that changed a specific file
git log -- filename.txt

# Show commits that added/removed specific text
git log -S "functionName"

# Pretty formatted log
git log --pretty=format:"%h %an %ar - %s"
# %h = short hash, %an = author name, %ar = relative date, %s = subject
```

### git show — Inspect a Specific Commit

```bash
# Show the most recent commit
git show

# Show a specific commit
git show a3f2b91c

# Show a specific file from a commit
git show a3f2b91c:filename.txt

# Show without diff
git show --stat a3f2b91c
```

### git diff — See Changes

```bash
# Changes in working dir (not staged)
git diff

# Changes staged for next commit
git diff --staged

# Compare two branches
git diff main..feature-branch

# Compare two commits
git diff abc123..def456

# Compare specific file between branches
git diff main..feature -- filename.txt

# Summary of what changed
git diff --stat
```

---

## 11. Undoing Things

This section is crucial. Git makes it safe to experiment because you can always undo.

### Undo in Working Directory (before staging)

```bash
# Discard changes to a file (restore to last commit state)
git checkout -- filename.txt         # old syntax
git restore filename.txt             # new syntax (Git 2.23+)

# Discard ALL changes in working directory
git checkout -- .
git restore .
```

⚠️ **WARNING**: These commands permanently discard your changes. They cannot be undone.

### Undo in Staging Area (unstage a file)

```bash
# Remove a file from staging (keep the changes in working dir)
git reset HEAD filename.txt          # old syntax
git restore --staged filename.txt    # new syntax (Git 2.23+)

# Unstage everything
git reset HEAD
git restore --staged .
```

### Undo Commits

#### git revert — The Safe Way (for shared repos)

Creates a **new commit** that undoes the changes. Safe for pushed commits.

```bash
# Revert the last commit
git revert HEAD

# Revert a specific commit
git revert a3f2b91c

# Revert without auto-committing (review first)
git revert --no-commit a3f2b91c
```

#### git reset — The Powerful Way (local only!)

Moves the branch pointer backwards. **Never use on pushed commits.**

```bash
# --soft: Undo commit, keep changes staged
git reset --soft HEAD~1
git reset --soft HEAD~3    # undo last 3 commits, keep changes staged

# --mixed (default): Undo commit, unstage changes, keep files
git reset HEAD~1
git reset --mixed HEAD~1

# --hard: Undo commit AND discard all changes (DANGEROUS)
git reset --hard HEAD~1
git reset --hard HEAD~3    # destroy last 3 commits forever

# Reset to a specific commit
git reset --hard a3f2b91c
```

**Visual comparison:**

```
Commits: A → B → C ← HEAD

git reset --soft HEAD~1:
  Commits: A → B ← HEAD
  Staging: C's changes are staged

git reset --mixed HEAD~1:
  Commits: A → B ← HEAD
  Working Dir: C's changes are in working dir (unstaged)

git reset --hard HEAD~1:
  Commits: A → B ← HEAD
  Working Dir: C's changes are GONE
```

#### git clean — Remove Untracked Files

```bash
# Preview what would be deleted (dry run)
git clean -n
git clean --dry-run

# Remove untracked files
git clean -f

# Remove untracked files AND directories
git clean -fd

# Remove untracked files, directories, and ignored files
git clean -fdx
```

---

## 12. Branching

Branches are one of Git's superpowers. They're fast, lightweight, and cheap to create.

### Theory

A branch is just a **pointer to a commit**. Creating a branch doesn't copy your files — it just creates a new pointer.

```
Before branching:
main: A → B → C ← HEAD

After "git branch feature-login":
main:          A → B → C ← HEAD (still on main)
feature-login:         ↑
                       C (same commit, just a new pointer)
```

### Creating & Switching Branches

```bash
# Create a new branch
git branch feature-login

# List all local branches (* = current branch)
git branch

# List all branches including remote
git branch -a

# List remote branches only
git branch -r

# Switch to a branch
git checkout feature-login     # old syntax
git switch feature-login       # new syntax (Git 2.23+)

# Create AND switch in one command
git checkout -b feature-login  # old syntax
git switch -c feature-login    # new syntax

# Create branch from a specific commit
git checkout -b hotfix a3f2b91c

# Create branch from a remote branch
git checkout -b local-name origin/remote-branch
```

### Branch Info

```bash
# Show which branch each commit belongs to
git log --oneline --graph --all --decorate

# Show last commit on each branch
git branch -v

# Show branches merged into current branch
git branch --merged

# Show branches NOT merged into current branch
git branch --no-merged
```

### Deleting Branches

```bash
# Delete a branch (safe — only if merged)
git branch -d feature-login

# Force delete a branch (even if not merged)
git branch -D feature-login

# Delete a remote branch
git push origin --delete feature-login
git push origin :feature-login    # old syntax

# Delete tracking reference to deleted remote branch
git remote prune origin
```

### Renaming Branches

```bash
# Rename current branch
git branch -m new-name

# Rename a specific branch
git branch -m old-name new-name

# Rename remote branch (delete old, push new)
git push origin --delete old-name
git push origin new-name
```

---

## 13. Merging

Merging integrates changes from one branch into another.

### Types of Merges

#### Fast-Forward Merge

Happens when the base branch hasn't diverged. Git simply moves the pointer forward.

```
Before:
main:    A → B
feature:       → C → D

After "git merge feature" (fast-forward):
main:    A → B → C → D
```

#### Three-Way Merge (Merge Commit)

Happens when both branches have new commits. Git creates a new "merge commit."

```
Before:
main:    A → B → C
feature:     → D → E

After merge:
main:    A → B → C → M (merge commit)
                 ↗
feature:     D → E
```

### Performing Merges

```bash
# Switch to the branch you want to merge INTO
git switch main

# Merge another branch into current branch
git merge feature-login

# Merge with a merge commit always (no fast-forward)
git merge --no-ff feature-login

# Merge and squash all commits into one (doesn't auto-commit)
git merge --squash feature-login
git commit -m "Add feature-login functionality"

# Abort a merge in progress
git merge --abort
```

### Merge Conflicts

When two branches edit the same part of a file, Git can't auto-merge — you get a **conflict**.

```bash
# Trigger: trying to merge and Git says "CONFLICT"
git merge feature-branch
# CONFLICT (content): Merge conflict in index.html
# Automatic merge failed; fix conflicts and then commit the result.
```

**What a conflict looks like in the file:**

```
<<<<<<< HEAD
This is the version from your current branch (main)
=======
This is the version from the branch being merged (feature)
>>>>>>> feature-branch
```

**Resolving conflicts:**

```bash
# Step 1: Open the conflicted file and edit it
# Remove the <<<, ===, >>> markers and keep the code you want

# Step 2: After fixing all conflicts, stage the files
git add index.html

# Step 3: Complete the merge
git commit
# Git auto-generates the merge commit message

# Alternative: Use a visual merge tool
git mergetool
```

**Checking for conflicts:**

```bash
# See which files have conflicts
git status
# Look for "both modified" files

# Show conflict markers in all conflicted files
git diff
```

---

## 14. Rebasing

Rebasing is an alternative to merging that **rewrites history** to create a cleaner, linear commit graph.

### Theory

```
Before rebase:
main:    A → B → C
feature:     → D → E

After "git rebase main" (on feature branch):
main:    A → B → C
feature:             → D' → E'
(D and E are replayed on top of C, creating new commits D' and E')

After merging:
main:    A → B → C → D' → E' (perfectly linear!)
```

### Rebase Commands

```bash
# Rebase current branch onto main
git switch feature
git rebase main

# Interactive rebase (most powerful) — edit last N commits
git rebase -i HEAD~3   # edit last 3 commits
git rebase -i HEAD~5   # edit last 5 commits

# Continue rebase after fixing a conflict
git rebase --continue

# Skip a commit during rebase
git rebase --skip

# Abort and return to original state
git rebase --abort
```

### Interactive Rebase — The Power Tool

```bash
git rebase -i HEAD~4
```

This opens an editor with something like:

```
pick a1b2c3d Add user model
pick e4f5a6b Add login endpoint
pick c7d8e9f Fix typo in login
pick 1a2b3c4 Add password validation

# Commands:
# p, pick   = use commit as-is
# r, reword = use commit, but edit the message
# e, edit   = use commit, but stop for amending
# s, squash = combine with previous commit
# f, fixup  = like squash, but discard this commit's log message
# d, drop   = remove this commit
```

Common operations:
- **squash**: Combine multiple commits into one (clean up "work in progress" commits)
- **reword**: Fix a commit message
- **drop**: Delete a commit entirely
- **reorder**: Change the order of lines to reorder commits

⚠️ **Golden Rule**: **Never rebase commits that have been pushed to a shared repo.** Rebasing rewrites history — it will break other people's work.

---

## 15. Remote Repositories

### What is a Remote?

A remote is a **version of your project hosted somewhere else** (GitHub, GitLab, etc.). When you clone a repo, Git automatically names the source remote `origin`.

### Managing Remotes

```bash
# List all remotes
git remote
git remote -v    # verbose: shows URLs

# Add a new remote
git remote add origin https://github.com/username/repo.git
git remote add upstream https://github.com/original/repo.git  # for forks

# Remove a remote
git remote remove origin

# Rename a remote
git remote rename origin upstream

# Change a remote's URL
git remote set-url origin https://github.com/new-username/repo.git

# Show details about a remote
git remote show origin
```

### Tracking Branches

Remote-tracking branches are read-only local references to the state of remote branches. They look like: `origin/main`, `origin/feature`.

```bash
# See all remote tracking branches
git branch -r

# Fetch updates from remote (updates tracking branches, doesn't merge)
git fetch origin

# Fetch from all remotes
git fetch --all

# Fetch and prune deleted remote branches
git fetch --prune
git fetch -p
```

---

## 16. GitHub: Getting Started

### Creating a GitHub Account

1. Go to https://github.com
2. Click "Sign up"
3. Enter username, email, password
4. Verify your account
5. Choose the free plan

### GitHub Profile Tips

- Use a clear profile photo
- Write a short bio mentioning your skills
- Pin your best repositories
- Add your location, website, social links
- Enable GitHub contributions graph ("green squares")

### Creating a Repository on GitHub

1. Click **"+"** in the top right → **"New repository"**
2. Fill in:
   - **Repository name**: `my-project` (lowercase, hyphens OK)
   - **Description**: Brief description
   - **Visibility**: Public or Private
   - **Initialize**: Check "Add a README file"
   - **.gitignore**: Choose a template (e.g., Python, Node)
   - **License**: Choose if open source (MIT is common)
3. Click **"Create repository"**

### GitHub Repository Page

Key sections:
- **Code tab**: Browse files, clone URL
- **Issues tab**: Bug reports, feature requests
- **Pull Requests tab**: Code review and merges
- **Actions tab**: CI/CD pipelines
- **Settings tab**: Repo configuration, collaborators, branches

---

## 17. Pushing & Pulling

### git push — Send Changes to Remote

```bash
# Push current branch to remote
git push origin main

# Push and set upstream tracking (do once per branch)
git push -u origin main
git push --set-upstream origin main

# After setting upstream, just use:
git push

# Push all local branches
git push --all origin

# Push tags
git push origin --tags
git push origin v1.0.0   # push specific tag

# Force push (DANGEROUS — rewrites remote history)
git push --force origin main
git push -f origin main

# Safer force push (fails if remote has changes you don't have)
git push --force-with-lease origin main
```

⚠️ **Never force-push to shared branches** (main, develop). It can destroy teammates' work.

### git pull — Get Changes from Remote

`git pull` = `git fetch` + `git merge`

```bash
# Pull from tracked remote branch
git pull

# Pull from specific remote and branch
git pull origin main

# Pull with rebase instead of merge (cleaner history)
git pull --rebase
git pull --rebase origin main

# Fetch without merging (safer, see what's coming)
git fetch origin
git log origin/main --oneline   # review changes
git merge origin/main            # merge when ready
```

### Tracking Upstream (for forks)

```bash
# Add the original repo as "upstream"
git remote add upstream https://github.com/original-owner/repo.git

# Fetch changes from upstream
git fetch upstream

# Merge upstream/main into your local main
git switch main
git merge upstream/main

# Push updated main to your fork
git push origin main
```

---

## 18. Cloning a Repository

```bash
# Clone via HTTPS
git clone https://github.com/username/repo.git

# Clone via SSH (requires SSH key setup)
git clone git@github.com:username/repo.git

# Clone into a specific folder name
git clone https://github.com/username/repo.git my-folder-name

# Clone a specific branch
git clone -b develop https://github.com/username/repo.git

# Shallow clone (only last N commits — faster, less data)
git clone --depth 1 https://github.com/username/repo.git

# Clone without downloading all history (sparse checkout)
git clone --filter=blob:none https://github.com/username/repo.git
```

---

## 19. Forking & Pull Requests

### What is Forking?

Forking creates **your own copy** of someone else's repository on GitHub. This is how open-source contribution works.

```
Original Repo (original-owner/project)
        ↓
    Fork
        ↓
Your Repo (your-username/project)  ← you have full control here
        ↓
  Clone to local machine
        ↓
  Make changes
        ↓
  Push to your fork
        ↓
  Open Pull Request
        ↓
Original Repo (original-owner merges your PR)
```

### Fork Workflow Step-by-Step

```bash
# Step 1: Fork on GitHub (click "Fork" button on the repo page)

# Step 2: Clone YOUR fork
git clone https://github.com/YOUR-USERNAME/project.git
cd project

# Step 3: Add upstream remote
git remote add upstream https://github.com/ORIGINAL-OWNER/project.git
git remote -v
# origin    https://github.com/YOUR-USERNAME/project.git (fetch)
# upstream  https://github.com/ORIGINAL-OWNER/project.git (fetch)

# Step 4: Create a feature branch
git switch -c fix-login-bug

# Step 5: Make your changes
# ... edit files ...
git add .
git commit -m "Fix null pointer in login handler"

# Step 6: Push to YOUR fork
git push origin fix-login-bug

# Step 7: Open a Pull Request on GitHub
# Go to your fork page → "Compare & pull request" button
```

### Creating a Pull Request on GitHub

1. Go to your fork on GitHub
2. You'll see a banner: **"Compare & pull request"** — click it
3. Fill in:
   - **Title**: Clear, descriptive title
   - **Description**: What you changed, why, how to test
   - Reference issues: `Closes #42` or `Fixes #17`
4. Click **"Create pull request"**

### Pull Request Best Practices

- Keep PRs small and focused (one feature or fix)
- Write a clear description
- Add screenshots for UI changes
- Make sure CI/tests pass before requesting review
- Respond to review comments promptly

### Reviewing a Pull Request

```bash
# Check out a PR locally to test it
git fetch origin pull/42/head:pr-42
git switch pr-42
```

On GitHub:
- Click **"Files changed"** to review the diff
- Click on lines to add inline comments
- Click **"Review changes"** to approve, request changes, or comment

---

## 20. GitHub Issues

Issues are GitHub's built-in task/bug tracker.

### Creating an Issue

1. Go to the **Issues** tab
2. Click **"New issue"**
3. Fill in title and description (use markdown)
4. Assign labels (bug, enhancement, documentation, etc.)
5. Assign to a person
6. Link to a milestone or project board

### Issue Templates

You can create templates for bugs and feature requests in `.github/ISSUE_TEMPLATE/`.

### Linking Issues to Commits/PRs

In a commit message or PR, use these keywords to auto-close issues:

```
Fixes #42
Closes #17
Resolves #8
```

When the PR is merged, the linked issue is automatically closed.

### Labels

Common default labels:
- `bug` — Something isn't working
- `enhancement` — New feature request
- `documentation` — Docs improvement
- `good first issue` — Good for newcomers
- `help wanted` — Extra attention needed
- `wontfix` — Won't be addressed

---

## 21. GitHub Actions (CI/CD Intro)

GitHub Actions lets you **automate workflows** — run tests, build, deploy automatically.

### Key Concepts

- **Workflow**: An automated process (defined in YAML files)
- **Event**: What triggers the workflow (push, PR, schedule)
- **Job**: A set of steps that run on a machine
- **Step**: An individual task (run a command or an action)
- **Runner**: The machine that runs your jobs (GitHub provides Ubuntu, Windows, macOS)

### Your First Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Run tests
        run: pytest tests/

      - name: Run linter
        run: flake8 .
```

### A Workflow for Node.js

```yaml
name: Node.js CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

### Triggering Options

```yaml
on:
  push:                          # on every push
  pull_request:                  # on PR open/update
  schedule:
    - cron: '0 9 * * 1'        # every Monday at 9am UTC
  workflow_dispatch:             # manual trigger via UI
  release:
    types: [published]           # when a release is published
```

---

## 22. .gitignore

The `.gitignore` file tells Git which files and folders to **never track**.

### Creating a .gitignore

```bash
# Create it in your project root
touch .gitignore
```

### .gitignore Syntax

```gitignore
# Comment line (ignored by Git)

# Ignore a specific file
secret.txt
.env
config/local.py

# Ignore all .log files
*.log

# Ignore a directory
node_modules/
__pycache__/
.venv/
dist/
build/

# Ignore all files in any "temp" folder
**/temp/

# Ignore .txt files EXCEPT important.txt
*.txt
!important.txt

# Ignore files only in the root, not subdirectories
/TODO.md

# Ignore all .db files in any data/ subdirectory
data/**/*.db
```

### Common .gitignore Patterns

**Python projects:**
```gitignore
__pycache__/
*.py[cod]
*.pyo
*.pyd
.Python
.env
.venv/
venv/
ENV/
*.egg-info/
dist/
build/
.pytest_cache/
.coverage
```

**Node.js projects:**
```gitignore
node_modules/
npm-debug.log*
yarn-debug.log*
.env
.env.local
dist/
build/
.cache/
```

**Java projects:**
```gitignore
*.class
*.jar
*.war
target/
.classpath
.project
.settings/
```

**General:**
```gitignore
# OS files
.DS_Store         # macOS
Thumbs.db         # Windows
desktop.ini

# IDE files
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# Secrets
*.pem
*.key
.env
.env.*
secrets.json
```

### Useful Commands

```bash
# Check if a file is being ignored
git check-ignore -v filename.txt

# List all ignored files
git status --ignored

# Add a global .gitignore for your machine (all repos)
git config --global core.excludesfile ~/.gitignore_global
```

### If You Already Committed a File You Want to Ignore

```bash
# Remove the file from tracking (but keep it locally)
git rm --cached filename.txt

# Remove a directory from tracking
git rm -r --cached directory/

# Then add to .gitignore and commit
git add .gitignore
git commit -m "Remove tracked files that should be ignored"
```

---

## 23. Git Tags & Releases

Tags mark specific points in history — typically used for version releases (v1.0, v2.1.3).

### Types of Tags

- **Lightweight tag**: Just a pointer to a commit (like a branch that doesn't move)
- **Annotated tag**: Full Git object with tagger name, email, date, message — preferred for releases

### Working with Tags

```bash
# Create a lightweight tag
git tag v1.0

# Create an annotated tag (recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Create a tag for a past commit
git tag -a v0.9.0 abc123 -m "Version 0.9.0 beta"

# List all tags
git tag
git tag -l "v1.*"    # list tags matching pattern

# Show tag info
git show v1.0.0

# Delete a local tag
git tag -d v1.0.0

# Push a tag to remote
git push origin v1.0.0

# Push all tags
git push origin --tags

# Delete a remote tag
git push origin --delete v1.0.0
git push origin :refs/tags/v1.0.0

# Checkout code at a specific tag
git checkout v1.0.0

# Create a branch from a tag
git checkout -b hotfix-from-v1 v1.0.0
```

### Semantic Versioning

Tags follow the pattern: `vMAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (v1.x.x → v2.0.0)
- **MINOR**: New features, backward compatible (v1.2.x → v1.3.0)
- **PATCH**: Bug fixes (v1.2.3 → v1.2.4)

### Creating a GitHub Release

1. Go to your repo → **Releases** (right sidebar)
2. Click **"Create a new release"**
3. Choose or create a tag
4. Add release title and description (changelog)
5. Attach binary files if needed
6. Check "Set as latest release"
7. Click **"Publish release"**

---

## 24. Git Stash

Stash lets you **temporarily save changes** without committing — perfect for when you need to quickly switch context.

```bash
# Save current changes to stash
git stash
git stash save "work in progress: user auth"   # with message

# Save including untracked files
git stash -u
git stash --include-untracked

# Save including ignored files too
git stash -a
git stash --all

# List all stashes
git stash list
# Output:
# stash@{0}: On main: work in progress: user auth
# stash@{1}: WIP on feature: add login
# stash@{2}: WIP on main: quick fix

# Apply most recent stash (keeps stash in list)
git stash apply

# Apply a specific stash
git stash apply stash@{2}

# Apply AND remove from list
git stash pop
git stash pop stash@{1}

# See what's in a stash
git stash show
git stash show -p stash@{0}   # with diff

# Delete a specific stash
git stash drop stash@{1}

# Delete all stashes
git stash clear

# Create a branch from a stash
git stash branch new-feature stash@{0}
```

### Practical Stash Scenario

```bash
# You're working on feature-x but need to fix an urgent bug on main

# Step 1: Stash your unfinished work
git stash save "feature-x WIP"

# Step 2: Switch to main
git switch main

# Step 3: Create hotfix branch
git switch -c hotfix-critical-bug

# Step 4: Fix the bug, commit, push, merge
git add .
git commit -m "Fix critical security vulnerability"
git push origin hotfix-critical-bug

# Step 5: Go back to your feature
git switch feature-x
git stash pop
# Your unfinished work is back!
```

---

## 25. Git Aliases

Aliases are shortcuts for long Git commands.

```bash
# Set up useful aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.df diff

# One-line pretty log
git config --global alias.lg "log --oneline --graph --all --decorate"

# Unstage command
git config --global alias.unstage "reset HEAD --"

# Last commit
git config --global alias.last "log -1 HEAD --stat"

# Undo last commit (keep changes staged)
git config --global alias.undo "reset --soft HEAD~1"

# Clean working directory
git config --global alias.cleanup "clean -fdx"
```

After setting up aliases:
```bash
git st          # instead of git status
git lg          # beautiful log graph
git last        # show last commit
git unstage file.txt   # unstage a file
```

---

## 26. Advanced Git Commands

### git cherry-pick — Apply Specific Commits

Apply a specific commit from another branch to your current branch.

```bash
# Cherry-pick a single commit
git cherry-pick a3f2b91c

# Cherry-pick a range of commits
git cherry-pick a3f2b91c..e7d8f3a1

# Cherry-pick without committing
git cherry-pick --no-commit a3f2b91c

# Abort cherry-pick
git cherry-pick --abort
```

### git bisect — Find the Commit That Introduced a Bug

Binary search through your commit history to find where a bug was introduced.

```bash
# Start bisect
git bisect start

# Mark current commit as bad (has the bug)
git bisect bad

# Mark a known good commit (no bug here)
git bisect good v1.0.0
git bisect good a3f2b91c

# Git checks out a commit in the middle
# Test if the bug is present, then:
git bisect good   # if no bug
git bisect bad    # if bug is present

# Git keeps narrowing down until it finds the culprit
# When done:
git bisect reset  # return to original state
```

### git blame — Who Wrote Each Line?

```bash
# Show who last modified each line
git blame filename.txt

# Blame with specific line range
git blame -L 10,25 filename.txt

# Show original commit, not latest change
git blame -C filename.txt

# Ignore whitespace changes
git blame -w filename.txt
```

### git reflog — Safety Net for Lost Commits

Reflog records every position of HEAD — even after resets, rebases, deleted branches.

```bash
# View reflog
git reflog

# Output:
# a3f2b91 HEAD@{0}: commit: Add user auth
# e7d8f3a HEAD@{1}: checkout: moving from feature to main
# 1b2c3d4 HEAD@{2}: reset: moving to HEAD~1

# Recover a lost commit
git checkout HEAD@{3}

# Restore a deleted branch
git branch recovered-branch HEAD@{5}

# Reflog for a specific branch
git reflog show main

# Reflog with time info
git reflog --date=iso
```

### git submodule — Repos Inside Repos

```bash
# Add a submodule
git submodule add https://github.com/user/repo.git path/to/submodule

# Initialize and update submodules after cloning
git submodule init
git submodule update
# or combined:
git submodule update --init --recursive

# Clone with submodules
git clone --recurse-submodules https://github.com/user/repo.git

# Update submodule to latest
git submodule update --remote
```

### git worktree — Multiple Working Directories

Check out multiple branches simultaneously in different folders.

```bash
# Add a new worktree
git worktree add ../project-feature feature-branch
git worktree add ../project-hotfix main

# List worktrees
git worktree list

# Remove a worktree
git worktree remove ../project-feature
```

### git archive — Export a Snapshot

```bash
# Export current state as tar.gz
git archive --format=tar.gz HEAD > project-snapshot.tar.gz

# Export as zip
git archive --format=zip HEAD > project.zip

# Export a specific branch
git archive --format=zip main > main-export.zip

# Export a specific tag
git archive --format=zip v1.0.0 > release-v1.zip
```

---

## 27. Git Internals (How Git Works Under the Hood)

Understanding this makes you a better Git user.

### The .git Directory

```bash
ls .git/
# HEAD         ← current branch reference
# config       ← local repo config
# objects/     ← all your data (blobs, trees, commits, tags)
# refs/        ← branch and tag pointers
# index        ← staging area
# logs/        ← reflog entries
# hooks/       ← scripts triggered by Git events
```

### Git Objects

Git has four types of objects, all stored in `.git/objects/`:

| Object | What it stores |
|--------|---------------|
| **blob** | Content of a file |
| **tree** | Directory listing (file names, permissions, blob references) |
| **commit** | Snapshot pointer + metadata (author, message, parent commit) |
| **tag** | Annotated tag object |

```
Commit Object
├── tree → Tree Object
│         ├── blob → File content
│         ├── blob → File content
│         └── tree → Subdirectory
│                   └── blob → File content
├── parent → Previous commit
├── author: Kenneth Solomon <k@example.com>
├── committer: Kenneth Solomon <k@example.com>
└── message: "Initial commit"
```

### SHA-1 Hash

Every object has a unique 40-character SHA-1 hash:

```bash
# See a commit's hash
git log --oneline
# a3f2b91 Initial commit

# Inspect an object by hash
git cat-file -t a3f2b91   # show type
git cat-file -p a3f2b91   # show content

# Compute the hash of a file without storing it
git hash-object filename.txt
```

### Git Hooks

Scripts that run automatically at certain Git events. Located in `.git/hooks/`.

```bash
ls .git/hooks/
# applypatch-msg.sample
# commit-msg.sample
# pre-commit.sample
# pre-push.sample
# post-commit.sample
# prepare-commit-msg.sample
```

**Creating a pre-commit hook** (runs before every commit):

```bash
# Create the hook file (remove .sample extension)
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Run tests before every commit
echo "Running tests..."
python -m pytest tests/
if [ $? -ne 0 ]; then
    echo "Tests failed! Commit aborted."
    exit 1
fi
echo "All tests passed!"
EOF

# Make it executable
chmod +x .git/hooks/pre-commit
```

**Useful hook events:**
- `pre-commit` — Before commit is created
- `commit-msg` — Validate commit message format
- `post-commit` — After commit (notifications)
- `pre-push` — Before pushing to remote
- `post-merge` — After a merge

---

## 28. Collaboration Workflows

### Feature Branch Workflow

Best for small teams. Everyone branches off `main`.

```
main: ──A──B────────────────M──
               \           /
feature:        C──D──E──F
```

```bash
# Developer 1: Create feature branch
git switch -c feature/user-auth main
# ... work, commit ...
git push -u origin feature/user-auth
# Open Pull Request on GitHub
# Get review and merge

# Developer 2: Same process on a different feature
git switch -c feature/payment-system main
```

### Gitflow Workflow

Best for projects with scheduled releases.

Branches:
- `main` — Production-ready code only
- `develop` — Integration branch for features
- `feature/*` — New features (branch from develop)
- `release/*` — Release preparation (branch from develop)
- `hotfix/*` — Urgent fixes (branch from main)

```
main:    ──A───────────────────────────M2────
            \                         /
hotfix:      \                  H──H2/
              \                /
develop: ──B───C─────────────R──R2────D──
               \            /
feature-x:      X──X2──X3──/
```

```bash
# Start a new feature
git switch -c feature/new-feature develop

# Finish a feature: merge to develop
git switch develop
git merge --no-ff feature/new-feature
git branch -d feature/new-feature

# Start a release
git switch -c release/1.2.0 develop
# ... bump version, update changelog ...
git switch main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Release 1.2.0"
git switch develop
git merge --no-ff release/1.2.0

# Hotfix
git switch -c hotfix/1.2.1 main
# ... fix the bug ...
git switch main
git merge --no-ff hotfix/1.2.1
git tag -a v1.2.1 -m "Hotfix 1.2.1"
git switch develop
git merge --no-ff hotfix/1.2.1
```

### Forking Workflow

Best for open-source projects. Maintainers don't give write access to contributors.

```
1. Fork the repo
2. Clone your fork
3. Add upstream remote
4. Create feature branch
5. Commit changes
6. Push to fork
7. Submit Pull Request
8. Maintainer reviews and merges
```

### Trunk-Based Development

Best for experienced teams with good test coverage. Everyone commits to `main` frequently.

```bash
# Very short-lived feature branches (hours, not days)
git switch -c tiny-feature
# ... make small focused change ...
git commit -m "Add specific small improvement"
git push origin tiny-feature
# Quick PR, auto-merge if tests pass
```

---

## 29. SSH Keys & GitHub Authentication

### Why SSH?

- No need to type username/password on every push
- More secure than HTTPS with password
- Industry standard for developer workflows

### Generating SSH Keys

```bash
# Generate a new SSH key pair
ssh-keygen -t ed25519 -C "your-email@example.com"

# For older systems that don't support ed25519:
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# When prompted:
# Enter file: press Enter (use default ~/.ssh/id_ed25519)
# Enter passphrase: optional but recommended
```

### Adding SSH Key to ssh-agent

```bash
# Start ssh-agent
eval "$(ssh-agent -s)"

# Add your key
ssh-add ~/.ssh/id_ed25519

# Verify key was added
ssh-add -l
```

### Adding SSH Key to GitHub

```bash
# Copy your public key to clipboard
cat ~/.ssh/id_ed25519.pub
# Copy the entire output

# On Windows (Git Bash):
clip < ~/.ssh/id_ed25519.pub

# On macOS:
pbcopy < ~/.ssh/id_ed25519.pub
```

1. Go to GitHub → **Settings** → **SSH and GPG keys**
2. Click **"New SSH key"**
3. Give it a title (e.g., "My Laptop")
4. Paste the public key
5. Click **"Add SSH key"**

### Test SSH Connection

```bash
ssh -T git@github.com
# Output: Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

### Switching from HTTPS to SSH

```bash
# Check current remote URL
git remote -v

# Change from HTTPS to SSH
git remote set-url origin git@github.com:username/repo.git

# Verify
git remote -v
```

### Personal Access Tokens (Alternative to SSH)

If you prefer HTTPS:

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token"**
3. Set expiration and select scopes (repo, workflow)
4. Copy the token (only shown once!)

```bash
# Use token as password when prompted
git push origin main
# Username: your-github-username
# Password: [paste your token here]

# Store credentials so you don't type every time
git config --global credential.helper store
```

---

## 30. Common Mistakes & Fixes

### "I committed to the wrong branch"

```bash
# Move last commit to correct branch
git log --oneline   # note the commit hash e.g. a3f2b91

# Create the correct branch
git branch correct-branch

# Undo commit from wrong branch (keep changes)
git reset --soft HEAD~1

# Switch to correct branch
git switch correct-branch

# Recommit
git commit -m "Your message"
```

### "I committed a secret/password"

```bash
# STEP 1: Revoke the secret immediately (change password, rotate API key)

# STEP 2: Remove from last commit (if not pushed)
git rm --cached .env
echo ".env" >> .gitignore
git commit --amend --no-edit

# STEP 3: If already pushed, use BFG Repo Cleaner or:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
git push --force --all
```

### "I accidentally deleted a branch"

```bash
# Find the lost branch in reflog
git reflog
# Look for the last commit of that branch, e.g. a3f2b91

# Recreate the branch
git branch recovered-branch a3f2b91
```

### "I need to undo a pushed commit"

```bash
# SAFE: Create a revert commit (preserves history)
git revert a3f2b91
git push

# UNSAFE (only if no one else pulled): Force reset
git reset --hard HEAD~1
git push --force-with-lease
```

### "My local main is behind remote"

```bash
git fetch origin
git pull origin main
# or
git pull --rebase origin main
```

### "I have a merge conflict I can't resolve"

```bash
# See which files conflict
git status

# Use a visual merge tool
git mergetool

# Or abort the merge and start fresh
git merge --abort

# Or accept one version entirely
git checkout --ours filename.txt    # keep my version
git checkout --theirs filename.txt  # keep incoming version
git add filename.txt
git commit
```

### "I pushed to main by accident"

```bash
# On GitHub, protect the main branch (Settings → Branches → Branch protection rules)
# Add rule: require pull request reviews before merging

# To undo the push:
git revert HEAD
git push origin main
```

### "git pull says 'diverged branches'"

```bash
# Your local branch and remote branch have different commits
# Option 1: Merge them
git pull --no-rebase

# Option 2: Rebase your changes on top of remote (cleaner)
git pull --rebase

# Option 3: Set as default behavior
git config --global pull.rebase true    # always rebase
git config --global pull.rebase false   # always merge
```

### "fatal: not a git repository"

```bash
# You're not inside a git repo folder
cd your-project-folder
git status

# Or initialize it
git init
```

### "Everything is broken, I want to start fresh from remote"

```bash
# Nuclear option: reset everything to match remote
git fetch origin
git reset --hard origin/main
git clean -fdx   # remove all untracked files

# WARNING: This destroys ALL local uncommitted changes
```

---

## 31. Quick Reference Cheat Sheet

### Setup

```bash
git config --global user.name "Name"
git config --global user.email "email"
git config --global init.defaultBranch main
git config --list
```

### Creating Repos

```bash
git init                     # new local repo
git clone <url>              # clone remote repo
git clone <url> <dir>        # clone into specific folder
```

### Basic Workflow

```bash
git status                   # check working tree
git add <file>               # stage a file
git add .                    # stage everything
git add -p                   # stage hunks interactively
git commit -m "message"      # commit staged changes
git commit -am "message"     # stage tracked + commit
git commit --amend           # modify last commit
```

### Viewing

```bash
git log                      # full commit history
git log --oneline            # compact history
git log --oneline --graph --all --decorate
git status                   # working tree status
git diff                     # unstaged changes
git diff --staged            # staged changes
git show <commit>            # show commit details
git blame <file>             # who wrote each line
```

### Branches

```bash
git branch                   # list local branches
git branch -a                # list all branches
git branch <name>            # create branch
git switch <name>            # switch to branch
git switch -c <name>         # create and switch
git branch -d <name>         # delete merged branch
git branch -D <name>         # force delete branch
git branch -m <new-name>     # rename current branch
```

### Merging & Rebasing

```bash
git merge <branch>           # merge branch into current
git merge --no-ff <branch>   # always create merge commit
git merge --abort            # abort in-progress merge
git rebase <branch>          # rebase current onto branch
git rebase -i HEAD~N         # interactive rebase last N commits
git rebase --abort           # abort rebase
git cherry-pick <commit>     # apply specific commit
```

### Undoing

```bash
git restore <file>           # discard working dir changes
git restore --staged <file>  # unstage a file
git reset --soft HEAD~1      # undo commit, keep staged
git reset HEAD~1             # undo commit, keep files
git reset --hard HEAD~1      # undo commit, lose changes
git revert <commit>          # create undo commit (safe)
git clean -fd                # remove untracked files/dirs
```

### Remote

```bash
git remote -v                # list remotes
git remote add origin <url>  # add remote
git remote set-url origin <url>  # change remote URL
git fetch                    # download changes, no merge
git pull                     # fetch + merge
git pull --rebase            # fetch + rebase
git push                     # push to tracked remote
git push -u origin main      # push and set upstream
git push --force-with-lease  # safe force push
```

### Stash

```bash
git stash                    # stash changes
git stash save "message"     # stash with label
git stash list               # list stashes
git stash pop                # apply and remove latest
git stash apply stash@{N}    # apply specific stash
git stash drop stash@{N}     # delete specific stash
git stash clear              # delete all stashes
```

### Tags

```bash
git tag                      # list tags
git tag v1.0.0               # lightweight tag
git tag -a v1.0.0 -m "msg"  # annotated tag
git push origin v1.0.0       # push tag
git push origin --tags       # push all tags
git tag -d v1.0.0            # delete local tag
```

### Advanced

```bash
git reflog                   # full HEAD history
git bisect start/good/bad    # binary search for bug
git log --grep="keyword"     # search commit messages
git log -S "code"            # search code changes
git archive HEAD > out.zip   # export snapshot
git shortlog -sn             # commit count by author
git count-objects -vH        # repo size info
```

---

## Appendix A: GitHub Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `?` | Show all shortcuts |
| `T` | Activate file finder |
| `L` | Jump to a line in code |
| `W` | Switch branches/tags |
| `Y` | Get permanent link to file |
| `B` | Open git blame view |
| `Ctrl+K` | Open command palette |

---

## Appendix B: Useful GitHub Features

### GitHub Gist
Quickly share code snippets: https://gist.github.com

### GitHub Pages
Host a static website from your repo for free:
1. Repo Settings → Pages
2. Choose source branch (usually `main` or `gh-pages`)
3. Your site is at: `https://username.github.io/repo-name`

### GitHub Copilot
AI pair programmer integrated into your editor.

### GitHub Codespaces
Full cloud dev environment in your browser — no local setup needed.

### GitHub CLI
```bash
# Install GitHub CLI
# https://cli.github.com

# Authenticate
gh auth login

# Clone a repo
gh repo clone username/repo

# Create a PR from command line
gh pr create --title "My PR" --body "Description"

# List PRs
gh pr list

# View issues
gh issue list

# Create an issue
gh issue create --title "Bug report" --body "Details"
```

---

## Appendix C: .gitconfig Template

Save this as `~/.gitconfig`:

```ini
[user]
    name = Kenneth Solomon
    email = your-email@example.com

[core]
    editor = code --wait
    autocrlf = input
    excludesfile = ~/.gitignore_global

[init]
    defaultBranch = main

[pull]
    rebase = false

[push]
    default = current

[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    df = diff
    lg = log --oneline --graph --all --decorate
    last = log -1 HEAD --stat
    unstage = reset HEAD --
    undo = reset --soft HEAD~1
    who = shortlog -sn --

[color]
    ui = auto

[merge]
    tool = vscode

[mergetool "vscode"]
    cmd = code --wait $MERGED

[diff]
    tool = vscode

[difftool "vscode"]
    cmd = code --wait --diff $LOCAL $REMOTE
```

---

## Appendix D: Markdown for GitHub README

GitHub READMEs are written in Markdown. Here's a reference:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
~~Strikethrough~~

- Unordered list item
- Another item
  - Nested item

1. Ordered list
2. Second item
3. Third item

[Link text](https://url.com)
![Alt text](image.png)

`inline code`

```python
# code block
def hello():
    print("Hello World")
```

> Blockquote text

| Column 1 | Column 2 |
|----------|----------|
| Cell     | Cell     |

---   ← horizontal rule

- [x] Completed task
- [ ] Pending task
```

### README Best Practices

A good README should have:
1. **Project title and description**
2. **Badges** (build status, version, license)
3. **Screenshot or demo GIF**
4. **Installation instructions**
5. **Usage examples**
6. **Contributing guidelines**
7. **License**

---

## Appendix E: Git Terminology Dictionary

| Term | Definition |
|------|-----------|
| **Repository (repo)** | A project tracked by Git |
| **Working directory** | Your local files |
| **Staging area** | Prep zone for the next commit |
| **Commit** | A saved snapshot of your project |
| **Branch** | A parallel line of development |
| **HEAD** | Pointer to current commit/branch |
| **Remote** | A hosted version of your repo (GitHub) |
| **Origin** | Default name for your remote |
| **Clone** | Copy a repo from remote to local |
| **Fork** | Copy someone's repo to your GitHub account |
| **Push** | Send local commits to remote |
| **Pull** | Fetch + merge from remote |
| **Fetch** | Download remote changes (no merge) |
| **Merge** | Combine branches |
| **Rebase** | Replay commits on top of another branch |
| **Conflict** | When two branches change the same line |
| **Stash** | Temporarily save uncommitted changes |
| **Tag** | Named pointer to a specific commit |
| **SHA/Hash** | Unique identifier for a commit |
| **Index** | Another name for staging area |
| **Upstream** | The original repo you forked from |
| **Tracking branch** | Local branch linked to a remote branch |
| **Fast-forward** | Merge that just moves the pointer |
| **Squash** | Combine multiple commits into one |
| **Cherry-pick** | Apply a specific commit to another branch |
| **Reflog** | Log of all HEAD movements |
| **Submodule** | A repo nested inside another repo |
| **Hook** | Script triggered by Git events |
| **CI/CD** | Automated testing and deployment |
| **PR / MR** | Pull Request / Merge Request |

---

*End of Guide*

---

