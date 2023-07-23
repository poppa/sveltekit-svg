declare module '*.svg?component' {
  import type { ComponentType, SvelteComponent } from 'svelte'
  import type { SVGAttributes } from 'svelte/elements'

  const content: ComponentType<SvelteComponent<SVGAttributes<SVGSVGElement>>>

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

declare module '*.svg?dataurl' {
  const content: string
  export default content
}

declare module '*.svg?dataurl=base64' {
  const content: string
  export default content
}

declare module '*.svg?dataurl=enc' {
  const content: string
  export default content
}

declare module '*.svg?dataurl=unenc' {
  const content: string
  export default content
}
