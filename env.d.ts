/// <reference types="vite/client" />

declare module '*.proto?raw' {
  const value: string
  export default value
}
