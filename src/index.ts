import { optimize, OptimizeOptions } from 'svgo'
import { compile } from 'svelte/compiler'
import { promises } from 'fs'
const { readFile } = promises

interface Options {
  type?: 'src' | 'url' | 'component'
  svgoOptions?: OptimizeOptions
}

function readSvg(options: Options = { type: 'component' }) {
  const resvg = /\.svg(?:\?(src|url|component))?$/
  const cache = new Map()

  return {
    name: 'sveltekit-svg',
    async transform(source: string, id: string, isBuild: boolean) {
      const match = id.match(resvg)

      if (match) {
        const type = match[1]

        if (type === 'url' || (!type && options.type === 'url')) {
          return source
        }

        try {
          const cacheKey = `${id}:${isBuild}`
          const cached = cache.get(cacheKey)

          if (cached) {
            console.log(`Found cache:`, cacheKey)
            return cached
          } else {
            console.log(`No cache:`, cacheKey)
          }

          const filename = id.replace(/\.svg(\?.*)$/, '.svg')
          let data = (await readFile(filename)).toString('utf-8')
          const opt = optimize(data, options.svgoOptions)

          if (type === 'src' || (!type && options.type === 'src')) {
            data = `\nexport default \`${opt.data}\`;`
          } else {
            const { js } = compile(data, {
              css: false,
              filename: id,
              hydratable: true,
              namespace: 'svg',
              generate: isBuild ? 'ssr' : 'dom',
            })

            data = js.code
          }

          cache.set(cacheKey, data)

          return data
        } catch (err: unknown) {
          console.error(
            'Failed reading SVG "%s": %s',
            id,
            (err as Error).message
          )
        }
      }

      return undefined
    },
  }
}

export = readSvg
