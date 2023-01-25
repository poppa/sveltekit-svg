import { promises } from 'fs'
import path from 'path'
import { compile } from 'svelte/compiler'
import { optimize, type OptimizedError, type OptimizeOptions } from 'svgo'
import { Plugin } from 'vite'

const { readFile } = promises

interface Options {
  /**
   * Output type
   * @default "component"
   */
  type?: 'src' | 'url' | 'component' | 'dataurl'
  /**
   * Verbatim [SVGO](https://github.com/svg/svgo) options
   */
  svgoOptions?: OptimizeOptions | false
  /**
   * Paths to apply the SVG plugin on. This can be useful if you want to apply
   * different SVGO options/plugins on different SVGs.
   *
   * The paths are path prefixes and should be relative to your
   * `svelte.config.js` file.
   *
   * @example
   * ```
   * {
   *   includePaths: ['src/assets/icons/', 'src/images/icons/']
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

function isSvgoOptimizeError(obj: unknown): obj is OptimizedError {
  return typeof obj === 'object' && obj !== null && !('data' in obj)
}

// TODO: Remove this when Vite 2.7.0 is well-adopted.
// https://github.com/vitejs/vite/blob/v2.7.1/packages/vite/CHANGELOG.md#270-2021-12-07
function getSsrOption(transformOptions: { ssr?: boolean } | undefined) {
  return typeof transformOptions === 'object'
    ? transformOptions.ssr
    : transformOptions
}

function readSvg(options: Options = { type: 'component' }): Plugin {
  const resvg = /\.svg(?:\?(src|url|component|dataurl))?$/

  if (options.includePaths) {
    // Normalize the include paths prefixes ahead of time
    options.includePaths = options.includePaths.map((pattern) => {
      const filepath = path.resolve(path.normalize(pattern))
      return path.sep === '\\' ? filepath.replace(/\\/g, '/') : filepath
    })
  }

  const isType = (str: string | undefined, type: Options['type']): boolean => {
    return (!str && options.type === type) || str === type
  }

  return {
    name: 'sveltekit-svg',
    async transform(
      source: string,
      id: string,
      transformOptions?: { ssr?: boolean }
    ) {
      if (options.includePaths) {
        const isIncluded = options.includePaths.some((pattern) => {
          return id.startsWith(pattern)
        })

        if (!isIncluded) {
          return undefined
        }
      }

      const match = id.match(resvg)

      if (!match!) {
        return undefined
      }

      const isBuild = getSsrOption(transformOptions)
      const type = match[1]

      if (isType(type, 'url')) {
        return source
      }

      try {
        const filename = id.replace(/\.svg(\?.*)$/, '.svg')
        let data = (await readFile(filename)).toString('utf-8')
        const opt =
          options.svgoOptions !== false
            ? optimize(data, {
                path: filename,
                ...(options.svgoOptions || {}),
              })
            : { data }

        if (isSvgoOptimizeError(opt)) {
          console.error('Got optimize error from SVGO:', opt)
          return undefined
        }

        if (isType(type, 'src')) {
          data = `\nexport default \`${opt.data}\`;`
        } else if (isType(type, 'dataurl')) {
          const head = `data:image/svg+xml;base64,`
          const dataurl = Buffer.from(opt.data).toString('base64url')
          data = `\nexport default \`${head}${dataurl}\`;`
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

        return data
      } catch (err: unknown) {
        console.error(
          'Failed reading SVG "%s": %s',
          id,
          (err as Error).message,
          err
        )

        return undefined
      }
    },
  }
}

export = readSvg
