import type { APIRoute } from 'astro';
import { iconSvg } from '~/lib/brand-icon';
import { themeIconColors } from '~/lib/server/icons';

export const GET: APIRoute = () =>
  new Response(iconSvg(64, themeIconColors(), { rounded: true }), {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
