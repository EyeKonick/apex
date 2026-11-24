// @ts-check
import { defineConfig } from 'astro/config';
import site from './src/data/site.json' with { type: 'json' };

// Static output. `site` makes the canonical, Open Graph and JSON-LD URLs absolute;
// set the real domain in src/data/site.json ("url") once it's known.
export default defineConfig({
  site: site.url,
  output: 'static',
});
