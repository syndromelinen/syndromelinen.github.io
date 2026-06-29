# kennytherex

personal site — cybersec, notes, the grind.

## stack

- **astro** — static site generator, blazing fast
- **mdx** — write posts in markdown
- **github pages** — free hosting, auto-deploy on push

## local dev

```bash
npm install
npm run dev
# → localhost:4321
```

## writing a post

create a file in `src/content/blog/`:

```md
---
title: "your post title"
description: "one line description"
date: "2026-07-01"
tag: "cybersec"   # cybersec | notes | maths | life | writeup
---

your content here in markdown.
```

that's it. push to main → github actions builds and deploys automatically.

## writing a note

create a file in `src/content/notes/`:

```md
---
title: "note title"
meta: "short description shown in the card"
tag: "cybersec"   # cybersec | maths | notes | writeup
updated: "2026-07-01"
---

note content.
```

## deploy setup (one-time)

1. push this repo to `syndromelinen.github.io` (or any repo)
2. go to repo settings → pages → source: **github actions**
3. every push to main auto-deploys

## structure

```
src/
  content/
    blog/        ← your posts (.md files)
    notes/       ← your notes (.md files)
  pages/
    index.astro  ← home
    blog.astro   ← blog listing with filter+search
    notes.astro  ← notes grid
    about.astro  ← about page
  layouts/
    Base.astro   ← shared nav + footer + marble bg
    Post.astro   ← blog post layout
  styles/
    global.css   ← all styles (purple marble theme)
  components/
    Marble.astro ← animated canvas background
```
