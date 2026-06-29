import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tag: z.enum(['cybersec', 'notes', 'maths', 'life', 'writeup']),
    draft: z.boolean().optional().default(false),
  }),
});

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    meta: z.string(),
    tag: z.enum(['cybersec', 'maths', 'notes', 'writeup']),
    updated: z.string(),
  }),
});

export const collections = { blog, notes };
