import svg from '@poppanator/sveltekit-svg'
import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [
    sveltekit(),
    svg({ includePaths: [`./src/assets/`, 'src/other/'] }),
    svg({ includePaths: ['./src/lib/'] }),
    svg({
      includePaths: [`./src/hook/`],
      preCompileHook(rawSvg, splitSvg) {
        const comp = `
        <script>export let title = 'Default Title'</script>
        <svg ${splitSvg.attributes} {...$$props}>
          <title>{title}</title>
          ${splitSvg.content}
        </svg>
        `

        return comp
      },
    }),
  ],
}

export default config
