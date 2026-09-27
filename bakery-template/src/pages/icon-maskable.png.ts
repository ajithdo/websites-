import type { APIRoute } from 'astro';
import { iconPng } from '~/lib/server/icons';

// Android may crop maskable icons to a circle: keep the mark inside the safe zone.
export const GET: APIRoute = async () =>
  new Response(await iconPng(512, { scale: 0.6 }), { headers: { 'Content-Type': 'image/png' } });
