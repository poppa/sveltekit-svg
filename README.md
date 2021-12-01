# SvelteKit SVG Plugin

This plugin makes it possible to import SVG files as Svelte
components, inline SVG code or urls.

## Install

- `yarn add --dev @poppanator/sveltekit-svg`
- `npm install -D @poppanator/sveltekit-svg`

## Usage

In your `svelte.config.js`

```js
const svg = require('@poppanator/sveltekit-svg')

module.exports = {
  ...,

  kit: {
    ...,
    vite: {
      // Options are optional
      plugins: [svg(options)]
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

When used as a component you can also pas attributes to the SVG

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

```ts
interface Options {
  type?: 'src' | 'url' | 'component'
  svgoOptions?: svgo.OptimizeOptions
}
```

## Typescript

For Typescript not to complain about `file.svg?component` et.al, add the
following to your application's `global.d.ts`. _(`global.d.ts` is just an
arbitrary file. It can be named whatever and reside wherever as long as
your Typescript config recognize it)_

```ts
declare module '*.svg' {
  import { SvelteComponent } from 'svelte'
  const content: SvelteComponent
  export default content
}

declare module '*.svg?component' {
  import { SvelteComponent } from 'svelte'
  const content: SvelteComponent
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
