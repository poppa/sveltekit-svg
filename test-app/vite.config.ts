import svg from '@poppanator/sveltekit-svg'
import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'
import { createSVGDocument } from 'svgdom'

const config: UserConfig = {
  plugins: [
    sveltekit(),
    svg({ includePaths: [`./src/assets/`, 'src/other/', './src/lib/'] }),
    svg({
      includePaths: [`./src/advanced/`],
      svgoOptions: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
                removeTitle: false,
              },
            },
          },
          {
            name: 'addClassesToSVGElement',
            params: {
              className: 'inline',
            },
          },
        ],
      },
      transformComponent(data) {
        const document = createSVGDocument()
        let svg = document.documentElement
        svg.innerHTML = data
        svg = svg.lastChild
        const currentTitle = svg.querySelector('title')
        let defaultTitle = ''
        if (currentTitle) {
          defaultTitle = currentTitle.innerHTML
          currentTitle.innerHTML = '{title}'
        } else {
          const title = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'title'
          )
          title.innerHTML = '{title}'
          svg.prepend(title)
        }
        data = svg.outerHTML
        const updatedComponent = `<script>export let title='${defaultTitle}';</script>${data}`
        return updatedComponent
      },
    }),
    svg({ includePaths: [`${process.cwd()}/static`] }),
  ],
}

export default config
