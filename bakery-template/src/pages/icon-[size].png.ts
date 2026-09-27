import type { APIRoute, GetStaticPaths } from 'astro';
import { iconPng } from '~/lib/server/icons';

export const getStaticPaths = (() =>
  ['192', '512'].map((size) => ({ params: { size } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) =>
  new Response(await iconPng(Number(params.size), { rounded: true }), {
    headers: { 'Content-Type': 'image/png' },
  });
