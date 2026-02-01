import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://admin-auxo.github.io',
  base: '/vendor-dash/',
  integrations: [react(), tailwind()],
});
