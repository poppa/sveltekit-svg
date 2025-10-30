import adapter from '@sveltejs/adapter-node'
import { resolve } from 'path'
import { sveltePreprocess } from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess(),
  kit: {
    adapter: adapter({ strict: false }),

    alias: {
      $lib: resolve('./src/lib'),
      $assets: resolve('./src/assets'),
    },
  },
}

export default config
