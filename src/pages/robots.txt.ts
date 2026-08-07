import type { APIRoute } from 'astro';
import { site } from '../lib/content';

export const GET: APIRoute = () => {
  const base = (import.meta.env.SITE ?? site.url).replace(/\/+$/, '');

  const body = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap-index.xml
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
