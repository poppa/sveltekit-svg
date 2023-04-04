import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import svg from '@poppanator/sveltekit-svg'

export default defineConfig({
  plugins: [
    sveltekit(),
    svg({
      svgoOptions: {
        datauri: false,
        plugins: [
          {
            name: 'preset-default',
            params: { overrides: { removeViewBox: false } },
          },
          'removeDimensions',
        ],
      },
    }),
  ],
})
