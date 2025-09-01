# SvelteKit SVG Plugin

This plugin makes it possible to import SVG files as Svelte
components, inline SVG code or urls.

> ### **NOTE!** For **Svelte 4** projects, use version 4 of this plugin

> _NOTE! This plugin isn't just for SvelteKit, but works for any Svelte
project using Vite_

## Install

- `yarn add --dev @poppanator/sveltekit-svg`
- `npm install -D @poppanator/sveltekit-svg`

## Usage

In your `vite.config.js`

```js
import { sveltekit } from '@sveltejs/kit/vite'
import svg from '@poppanator/sveltekit-svg'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    svg(options), // Options are optional
  ],
}

export default config
```

You can also pass multiple `svg` transformers based on paths if you want to
apply different SVGO options for different SVGs

```js
const config = {
  plugins: [
    sveltekit(),
    svg({
      includePaths: ['./src/lib/icons/', './src/assets/icons/'],
      svgoOptions: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
          },
          { name: 'removeAttrs', params: { attrs: '(fill|stroke)' } },
        ],
      },
    }),
    svg({
      includePaths: ['./src/lib/graphics/'],
      svgoOptions: {
        multipass: true,
        plugins: ['preset-default'],
      },
    }),
  ],
}
```

## Svelte usage

**Import as a Svelte component:**

> **NOTE!** It's recommended that you use the `?component` query string if you
> use the suggested type definition below. The reason is that **Vite** ships a
> type definition for `*.svg` which states that `import Comp from './file.svg`
> returns a string.
>
> So providing a default type definition for `*.svg` is in most cases causing
> a conflict which will lead to TSC errors when treating such an import as a
> Svelte component.
>
> So the best way to avoid errors, current and future, is to always use
> `import Comp from './file.svg?component` with the suggested type definition
> at the end of this file.

```svelte
<script>
import Logo from "./logo.svg?component";
</script>

<Logo />
```

When used as a component you can also pass attributes to the SVG

```svelte
<Logo width="200" />
```

**Import as file path:**

```svelte
<script>
import logoUrl from "./logo.svg?url";
</script>

<img src={logoUrl} />
```

**Import as data URL:**

```svelte
<script>
import logoDataUrl from "./logo.svg?dataurl";
</script>

<img src={logoDataUrl} />
```

In contrast to `?url` this will apply SVGO optimization/transform before the
the SVG is turned into a data URL

You can also pass the SVGO config option `datauri` as value to `?dataurl`.
This will, for instance, generate an URI encoded string

```svelte
<script>
import logoDataUrl from "./logo.svg?dataurl=enc";
</script>

<img src={logoDataUrl} />
```

**Import as code:**

```svelte
<script>
import logo from "./logo.svg?src";
</script>

{@html logo}
```

## Options

````ts
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
   *
   * If no options are given, the SVG will be optimized with the default SVGO
   * options.
   * If `false` SVGO will be bypassed altogether
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
   * Hook that lets you transform the svg to a raw Svelte component yourself,
   * before being passed to the Svelte compiler.
   *
   * @param rawSvg The raw SVG data as read from disk
   * @param splitSvg The SVG split into parts, e.g its attributes and
   *  its content
   * @returns This should return a complete Svelte component that can be passed
   *  to the Svelte compiler
   */
  preCompileHook?(rawSvg: string, splitSvg: SplitSvg): string
}
````

## Typescript

For Typescript not to complain about `file.svg?component` et.al, add the
following import statement to `src/app.d.ts` (or any `.d.ts` file somewhere in the path of your
project where `tsc` can find it).

```ts
import '@poppanator/sveltekit-svg/dist/svg.d.ts'
```

> **NOTE!** If you have `module`/`moduleResolution` set to `NodeNext` in your
> Typescript config, you **MUST** include `.d.ts` in the import of the SVG
> type definition.

## Notes on using with _Jest_

_I don't know if this still applies, but it's kept here for good measure_

According to a report [_Jest_](https://jestjs.io/) will have trouble
transforming `.svg` files when such is imported as a Svelte component.

The solution seems to be to add a module name mapper entry in the the
`jest.config.cjs` file, like so:

```js
module.exports = {
  // ... other config
  moduleNameMapper: {
    // ... other mappers
    '^.+\\.svg$': '<rootDir>/src/lib/EmptyIcon.svelte',
  },
}
```

where `src/lib/EmptyIcon.svelte` can contain just `<svg />`.

> [See the reported issue and solution](https://github.com/poppa/sveltekit-svg/issues/22)
