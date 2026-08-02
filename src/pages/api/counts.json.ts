import { getCollection } from 'astro:content';

export async function GET() {
  const [cybersecurity, programming, journal, notes, maths, random] = await Promise.all([
    getCollection('cybersecurity', ({ data }) => !data.draft),
    getCollection('programming', ({ data }) => !data.draft),
    getCollection('journal', ({ data }) => !data.draft),
    getCollection('notes', ({ data }) => !data.draft),
    getCollection('maths', ({ data }) => !data.draft),
    getCollection('random', ({ data }) => !data.draft),
  ]);

  return new Response(JSON.stringify({
    cybersecurity: cybersecurity.length,
    programming: programming.length,
    journal: journal.length,
    notes: notes.length,
    maths: maths.length,
    random: random.length,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
