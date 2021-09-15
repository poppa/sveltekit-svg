/// <reference types="@sveltejs/kit" />

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
