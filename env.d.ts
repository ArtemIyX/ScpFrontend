/// <reference types="vite/client" />

declare module '*.proto?raw' {
  const value: string
  export default value
}

interface Window {
  /** Unreal entry point: ExecuteJavaScript("window.connect_socket('127.0.0.1', 18181);") */
  connect_socket: (
    ip: string,
    port: import('@/services').WebSocketPort,
  ) => import('@/services').ScpWebSocketClient
  create_socket: {
    (host: string): import('@/services').ScpWebSocketClient
    (host: string, port: import('@/services').WebSocketPort): import('@/services').ScpWebSocketClient
  }
  get_socket: () => import('@/services').ScpWebSocketClient | null
  destroy_socket: () => void
}
