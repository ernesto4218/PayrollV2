import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ out: 'build' })
  },
  // vitePlugin belongs here, at the top-level svelte config
  vitePlugin: {
    dynamicCompileOptions: ({ filename }) =>
      filename.includes('node_modules') ? undefined : { runes: true }
  }
};

export default config;