import type { APIRoute } from 'astro';
import { iconPng } from '~/lib/server/icons';

// Full-bleed square: iOS rounds the corners itself.
export const GET: APIRoute = async () =>
  new Response(await iconPng(180, { scale: 0.74 }), { headers: { 'Content-Type': 'image/png' } });
