/// <reference types="@sveltejs/kit" />

declare module '*.svg' {
  const content: ConstructorOfATypedSvelteComponent
  export default content
}

declare module '*.svg?component' {
  const content: ConstructorOfATypedSvelteComponent
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
