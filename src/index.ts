import { optimize, OptimizeOptions } from 'svgo'
import { compile } from 'svelte/compiler'
import { promises } from 'fs'
const { readFile } = promises

interface Options {
  type?: 'src' | 'url' | 'component'
  svgoOptions?: OptimizeOptions
}

const svgRegex = /(<svg.*?)(>.*)/s

function addComponentProps(data: string): string {
  const parts = svgRegex.exec(data)

  if (!parts) {
    throw new Error('Invalid SVG')
  }

  const [, head, body] = parts
  return `${head} {...$$props}${body}`
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
            return cached
          }

          const filename = id.replace(/\.svg(\?.*)$/, '.svg')
          let data = (await readFile(filename)).toString('utf-8')
          // The typedef if wrong. The actual method expects options to be
          // an object or null
          // @ts-expect-error
          const opt = optimize(data, options.svgoOptions || null)

          if (type === 'src' || (!type && options.type === 'src')) {
            data = `\nexport default \`${opt.data}\`;`
          } else {
            opt.data = addComponentProps(opt.data)
            const { js } = compile(opt.data, {
              css: false,
              filename: id,
              hydratable: true,
              namespace: 'svg',
              generate: isBuild ? 'ssr' : 'dom',
            })

            delete js.map
            data = js
          }

          cache.set(cacheKey, data)

          return data
        } catch (err: unknown) {
          console.error(
            'Failed reading SVG "%s": %s',
            id,
            (err as Error).message,
            err
          )
        }
      }

      return undefined
    },
  }
}

export = readSvg
