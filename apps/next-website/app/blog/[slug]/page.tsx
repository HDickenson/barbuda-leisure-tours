
    import { SectionRenderer } from '@/components/sections/renderer';
    export default async function Page() {
      const post = { title: 'Hello', date: '2025-01-01', html: '<p>Content</p>' };
      const sections = [{ type: 'prose', props: { html: post.html } }];
      return (<article className='prose mx-auto'><h1>{post.title}</h1><p>{post.date}</p><SectionRenderer sections={sections}/></article>);
    }
  