# SvelteKit SVG Plugin

This plugin makes it possible to import SVG files as Svelte
components, inline SVG code or urls.

## Install

- `yarn add --dev @poppanator/sveltekit-svg`
- `npm install -D @poppanator/sveltekit-svg`

## Usage

In your `vite.config.js`

```js
import { sveltekit } from '@sveltejs/kit/vite';
import svg from '@poppanator/sveltekit-svg';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    svg(options) // Options are optional
  ],
};

export default config;
```

You can also pass multiple `svg` transformers based on paths if you want to
apply different SVGO options for different SVGs

```js
const config = {
  plugins: [
    sveltekit(),
    svg({
      includePaths: ["./src/lib/icons/", "./src/assets/icons/"],
      svgoOptions: {
        multipass: true,
        plugins: [{
          name: "preset-default",
          // by default svgo removes the viewBox which prevents svg icons from scaling
          // not a good idea! https://github.com/svg/svgo/pull/1461
          params: { overrides: { removeViewBox: false } }
        },
        { name: "removeAttrs", params: { attrs: "(fill|stroke)" } }],
      },
    }),
    svg({
      includePaths: ["./src/lib/graphics/"],
      svgoOptions: {
        multipass: true,
        plugins: ["preset-default"],
      },
    }),
  ]
}
```

## Svelte usage

**Import as a Svelte component:**

```svelte
<script>
import Logo from "./logo.svg";
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
   * @default "component"
   */
  type?: 'src' | 'url' | 'component'
  /**
   * Verbatim [SVGO](https://github.com/svg/svgo) options
   */
  svgoOptions?: svgo.OptimizeOptions
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
````

## Notes on using with _Jest_

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

## Typescript

For Typescript not to complain about `file.svg?component` et.al, add the
following to your application's `global.d.ts`. _(`global.d.ts` is just an
arbitrary file. It can be named whatever and reside wherever as long as
your Typescript config recognize it)_

```ts
declare module '*.svg' {
  const content: any
  export default content
}

declare module '*.svg?component' {
  const content: any
  export default content
}

declare module '*.svg?src' {
  const content: string
  export default content
}

declare module '*.svg?url' {
  const content: string
  export default content
}
```
