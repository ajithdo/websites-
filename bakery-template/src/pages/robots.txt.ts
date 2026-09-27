import type { APIRoute } from 'astro';
import { site } from '~/config/site';

export const GET: APIRoute = ({ site: siteUrl }) => {
  const base = siteUrl ?? new URL('http://localhost:4321');
  const lines = site.features.demoMode
    ? [
        // Crawling stays open so link previews work; every page carries noindex.
        '# Sample website: pages are marked noindex.',
        'User-agent: *',
        'Allow: /',
      ]
    : ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('/sitemap-index.xml', base).href}`];
  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
