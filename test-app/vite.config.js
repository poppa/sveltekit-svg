import { sveltekit } from '@sveltejs/kit/vite'
import svg from '@poppanator/sveltekit-svg'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    svg({ includePaths: [`./src/assets/`, 'src/other/'] }),
    svg({ includePaths: [`${process.cwd()}/static`] }),
  ],
}

export default config
