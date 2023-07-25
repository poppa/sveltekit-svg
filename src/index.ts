import { promises } from 'fs'
import path from 'path'
import { compile } from 'svelte/compiler'
import { optimize, type Config } from 'svgo'
import type { Plugin } from 'vite'

const { readFile } = promises

interface Options {
  /**
   * Output type
   *
   * `dataurl` can also take the following options, which are verbatim SVGO
   * `datauri` options:
   *
   * - `?dataurl=base64` (default, same as `?dataurl`)
   * - `?dataurl=enc` URL encoded string
   * - `?dataurl=unenc` Plain SVG
   *
   * @default "component"
   */
  type?: 'src' | 'url' | 'component' | 'dataurl'
  /**
   * Verbatim [SVGO](https://github.com/svg/svgo) options
   */
  svgoOptions?: Config | false
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
  /**
   * This hook allows you to modify the resulting svg component
   * to include props, lifercycle events etc.
   * @param component the stringified version of the component
   * @returns an updated version of the stringified component
   */
  transformComponent?: (component: string) => string
}

type Position = {
  line: number
  column: number
  character: number
}

type CompileError = Error & {
  code: string
  pos: number
  filename: string
  frame: string
  start: Position
  end: Position
}

function isCompileError(err: unknown): err is CompileError {
  return err instanceof Error && 'code' in err && 'frame' in err
}

const svgRegex = /(<svg.*?)(>.*)/s

function color(start: string, end = '\u001b[0m'): (text: string) => string {
  return (text: string) => `${start}${text}${end}`
}

const yellow = color('\u001b[33m')
const blue = color('\u001b[34m')

function isSvgoOptimizeError(obj: unknown): obj is Error {
  return typeof obj === 'object' && obj !== null && !('data' in obj)
}

function hasCdata(code: string): boolean {
  return code.includes('<![CDATA[')
}

function readSvg(options: Options = { type: 'component' }): Plugin {
  const resvg = /\.svg(?:\?(src|url|component|dataurl)(=(base64|(un)?enc))?)?$/

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

  function addComponentProps(data: string): string {
    const parts = svgRegex.exec(data)
    if (!parts) {
      throw new Error('Invalid SVG fuck')
    }

    const [, head, body] = parts
    let retval = `${head} {...$$restProps}${body}`
    if (options.transformComponent) {
      retval = options.transformComponent(data)
    }
    return retval
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

      if (!match) {
        return undefined
      }

      const isBuild = transformOptions?.ssr ?? false
      const type = match[1]

      if (isType(type, 'url')) {
        return source
      }

      let svgo =
        typeof options.svgoOptions === 'object'
          ? { ...options.svgoOptions }
          : options.svgoOptions
      let isSvgoDataUri = false

      if (svgo && typeof svgo === 'object') {
        if (svgo.datauri) {
          isSvgoDataUri = true
        }
      }

      if (isSvgoDataUri && type === 'component') {
        console.warn(
          `%s Type %O can not be imported as a Svelte component ` +
            `since "datauri" is set in vite.config`,
          yellow('[WARNING]'),
          id
        )
      } else if (type === 'dataurl') {
        const t = match[3] ?? 'base64'

        if (!svgo) {
          svgo = {}
        }

        svgo.datauri = t as Config['datauri']
        isSvgoDataUri = true
      }

      try {
        const filename = id.replace(/\.svg(\?.*)$/, '.svg')
        let data = (await readFile(filename)).toString('utf-8')
        const opt =
          svgo !== false
            ? optimize(data, {
                path: filename,
                ...(svgo || {}),
              })
            : { data }

        if (isSvgoOptimizeError(opt)) {
          console.error('Got optimize error from SVGO:', opt)
          return undefined
        }

        if (isType(type, 'src') || isSvgoDataUri) {
          data = `\nexport default \`${opt.data}\`;`
        } else {
          opt.data = addComponentProps(opt.data)
          const { js } = compile(opt.data, {
            css: false,
            filename: id,
            hydratable: !isBuild,
            namespace: 'svg',
            generate: isBuild ? 'ssr' : 'dom',
          })

          data = js.code
        }

        return data
      } catch (err: unknown) {
        if (isCompileError(err) && hasCdata(err.frame)) {
          const msg =
            `\n%s The SVG file %O contains a %s section which is not ` +
            `supported by Svelte. To make this SVG work with the %s ` +
            `plugin, you need to remove all %s sections from the SVG.\n`

          console.warn(
            msg,
            yellow('[WARNING]'),
            id,
            blue('<![CDATA[...]]>'),
            blue('@poppanator/sveltekit-svg'),
            blue('<![CDATA[...]]>')
          )
        } else {
          console.error(
            'Failed reading SVG "%s": %s',
            id,
            (err as Error).message,
            err
          )
        }

        return undefined
      }
    },
  }
}

export = readSvg
