import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const notes = await getCollection('notes');

  return new Response(JSON.stringify({
    posts: posts.length,
    notes: notes.length,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
