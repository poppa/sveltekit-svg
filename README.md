# SvelteKit SVG Plugin

**NOTE!** _This package is not yet released_

This plugin makes it possible to import SVG files as Svelte
components, inline SVG code or urls.

## Install

- `yarn add --dev @poppanator/sveltekit-svg`
- `npm install -D @poppanator/sveltekit-svg`

## Usage

In your `svelte.config.cjs`

```js
const svg = import('@poppanator/sveltekit-svg')

module.exports = {
  ...,

  kit: {
    ...,
    // Options are optional
    plugins: [svg(options)]
  }
}
```

## Svelte usage

Import as a Svelte component:

```svelte
<script>
import Logo from "./logo.svg";
</script>

<Logo />
```

Import as file path:

```svelte
<script>
import logoUrl from "./logo.svg?url";
</script>

<img src={logoUrl} />
```

Import as code:

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
following to your application's `global.d.ts`

```ts
declare module '*.svg?src' {
  const content: string
  export default content
}

declare module '*.svg?component' {
  const content: string
  export default content
}

declare module '*.svg?url' {
  const content: string
  export default content
}
```
