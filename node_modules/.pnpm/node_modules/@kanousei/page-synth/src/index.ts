import { writeFile, mkdir } from 'fs/promises';

export async function synthPages(siteId: string) {
  const route = `apps/next-website/app/blog/[slug]/page.tsx`;
  const code = `
    import { SectionRenderer } from '@/components/sections/renderer';
    export default async function Page() {
      const post = { title: 'Hello', date: '2025-01-01', html: '<p>Content</p>' };
      const sections = [{ type: 'prose', props: { html: post.html } }];
      return (<article className='prose mx-auto'><h1>{post.title}</h1><p>{post.date}</p><SectionRenderer sections={sections}/></article>);
    }
  `;

  // Ensure directory exists
  await mkdir('apps/next-website/app/blog/[slug]', { recursive: true });

  await writeFile(route, code);
  return { siteId, pages: 1 };
}
