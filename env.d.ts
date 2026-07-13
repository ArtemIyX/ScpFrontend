/// <reference types="vite/client" />

declare module '*.proto?raw' {
  const value: string
  export default value
}

interface Window {
  create_socket: (host: string) => import('@/services').ScpWebSocketClient
  get_socket: () => import('@/services').ScpWebSocketClient | null
  destroy_socket: () => void
}
