import fs from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import yaml from 'js-yaml';

// The canonical site URL is stored in src/data/site.yml so it can be changed
// from the CMS without touching any code.
function resolveSiteUrl() {
  try {
    const raw = fs.readFileSync(new URL('./src/data/site.yml', import.meta.url), 'utf8');
    const data = yaml.load(raw);
    const url = typeof data?.url === 'string' ? data.url.trim() : '';
    if (url) return url.replace(/\/+$/, '');
  } catch {
    // fall through to the default below
  }
  return 'https://example.com';
}

export default defineConfig({
  site: resolveSiteUrl(),
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [sitemap()],
  build: { format: 'directory' },
});
