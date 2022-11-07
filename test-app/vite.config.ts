import svg from '@poppanator/sveltekit-svg'
import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [
    sveltekit(),
    svg({ includePaths: [`./src/assets/`, 'src/other/', './src/lib/'] }),
    svg({ includePaths: [`${process.cwd()}/static`] }),
  ],
}

export default config
