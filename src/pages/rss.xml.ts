import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const cyber = await getCollection('cybersecurity', p => !p.data.draft);
  const prog = await getCollection('programming', p => !p.data.draft);
  const journal = await getCollection('journal', p => !p.data.draft);

  const all = [
    ...cyber.map(p => ({ ...p, section: 'cybersecurity' })),
    ...prog.map(p => ({ ...p, section: 'programming' })),
    ...journal.map(p => ({ ...p, section: 'journal' })),
  ].sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: 'kennytherex',
    description: 'Kenneth Solomon — cybersec, programming, thoughts.',
    site: context.site,
    items: all.map(p => ({
      title: p.data.title,
      pubDate: new Date(p.data.date),
      description: p.data.description,
      link: `/${p.section}/${p.slug}/`,
    })),
  });
}
