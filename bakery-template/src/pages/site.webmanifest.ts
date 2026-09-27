import type { APIRoute } from 'astro';
import { site } from '~/config/site';
import { themes } from '~/config/themes';
import { lt } from '~/i18n';

export const GET: APIRoute = () => {
  const colors = themes[site.theme].colors;
  const manifest = {
    name: `${site.brand.name} · ${lt(site.brand.descriptor, 'en')}`,
    short_name: site.brand.name,
    description: site.seo.description,
    lang: 'en-IN',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: colors.bg,
    theme_color: colors.bg,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
};
