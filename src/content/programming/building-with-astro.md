---
title: "building my personal site with Astro"
description: "Why I chose Astro, how the build system works, and what I learned deploying to GitHub Pages."
date: "2026-06-15"
tags: ["astro", "web", "github-pages", "static-site"]
---

spent a few days building this site from scratch. astro was the right call — here's what i learned.

## why astro

- ships zero JS by default (just HTML + CSS)
- markdown-first content system
- static output → free GitHub Pages hosting
- component model is clean

for a personal blog/portfolio, you don't need React. you need a fast static site that's easy to write content for. astro is exactly that.

## content collections

astro's content collections are the best part. write markdown with frontmatter, get type-safe data:

```typescript
// src/content/config.ts
const cybersecurity = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
  }),
});
```

then query it anywhere:

```astro
---
const posts = await getCollection('cybersecurity');
---
```

## deployment

github actions + github pages = zero cost, auto-deploys on push.

push to main → workflow runs `npm run build` → uploads `dist/` → live in ~60 seconds.

## what i'd do differently

start with the content structure before the design. i spent too long on CSS before i had real content to test against. get the markdown files in first.
