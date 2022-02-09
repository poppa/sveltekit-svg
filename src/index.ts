import { optimize, OptimizeOptions } from 'svgo'
import { compile } from 'svelte/compiler'
import { promises } from 'fs'
import { match as globmatch } from 'minimatch'
const { readFile } = promises

interface Options {
  /**
   * Output type
   * @default "component"
   */
  type?: 'src' | 'url' | 'component'
  /**
   * Verbatim [SVGO](https://github.com/svg/svgo) options
   */
  svgoOptions?: OptimizeOptions
  /**
   * Paths to apply the SVG plugin on. This can be useful if you want to apply
   * different SVGO options/plugins on different SVGs.
   *
   * The paths are [minimatch](https://github.com/isaacs/minimatch) globs and
   * should be relative to your `svelte.config.js` file.
   *
   * @example
   * ```
   * {
   *   includePaths: ['src/assets/icons/*.svg']
   * }
   * ```
   */
  includePaths?: string[]
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

// TODO: Remove this when Vite 2.7.0 is well-adopted.
// https://github.com/vitejs/vite/blob/v2.7.1/packages/vite/CHANGELOG.md#270-2021-12-07
function getSsrOption(transformOptions: boolean | { ssr: boolean }) {
  return typeof transformOptions === 'object'
    ? transformOptions.ssr
    : transformOptions
}

const cwd = process.cwd()

function readSvg(options: Options = { type: 'component' }) {
  const resvg = /\.svg(?:\?(src|url|component))?$/
  const cache = new Map()

  if (options.includePaths) {
    // Normalize the include paths patterns ahead of time
    options.includePaths = options.includePaths.map((pattern) => {
      if (pattern.startsWith(cwd)) {
        pattern = pattern.substring(cwd.length + 1)
      } else if (pattern.startsWith('./') || pattern.startsWith('.\\')) {
        pattern = pattern.substring(2)
      }

      return pattern
    })
  }

  return {
    name: 'sveltekit-svg',
    async transform(
      source: string,
      id: string,
      transformOptions: boolean | { ssr: boolean }
    ) {
      if (options.includePaths) {
        let internalId = id.substring(cwd.length + 1)

        if (internalId.includes('?')) {
          internalId = internalId.split('?').shift() ?? ''
        }

        const isIncluded = options.includePaths.some((pattern) => {
          return globmatch([internalId], pattern).some((val) => !!val)
        })

        if (!isIncluded) {
          return undefined
        }
      }

      const match = id.match(resvg)
      const isBuild = getSsrOption(transformOptions)

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
