# SvelteKit SVG Plugin

This plugin makes it possible to import SVG files as Svelte
components, inline SVG code or urls.

## Install

- `yarn add --dev @poppanator/sveltekit-svg`
- `npm install -D @poppanator/sveltekit-svg`

## Usage

In your `svelte.config.js`

```js
import svg from '@poppanator/sveltekit-svg'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  ...,

  kit: {
    ...,
    vite: {
      // Options are optional
      plugins: [svg(options)]
    }
  }
}

export default config
```

You can also pass multiple `svg` transformers based on paths if you want to
apply different SVGO options for different SVGs

```js
/** @type {import('@sveltejs/kit').Config} */
const config = {
  ...,

  kit: {
    ...,
    vite: {
      plugins: [
        svg({
          includePaths: ["./src/lib/icons/", "./src/assets/icons/"],
          svgoOptions: {
            multipass: true,
            plugins: ["preset-default", { name: "removeAttrs", params: { attrs: "(fill|stroke)" }}],
          },
        }),
        svg({
          includePaths: ["./src/lib/graphics/"],
          svgoOptions: {
            multipass: true,
            plugins: ["preset-default" ],
          },
        }),
      ]
    }
  }
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
