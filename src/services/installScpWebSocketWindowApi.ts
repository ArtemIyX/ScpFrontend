import {
  connectScpWebSocket,
  createScpWebSocketClient,
  destroyScpWebSocketClient,
  getScpWebSocketClient,
  type WebSocketPort,
} from './scpwebsocketruntime'

export const SCP_UI_LOADED_MESSAGE = 'SCP_UI_LOADED'

export function installScpWebSocketWindowApi(target: Window = window): void {
  target.connect_socket = (ip: string, port: WebSocketPort) => connectScpWebSocket(ip, port)
  target.create_socket = (host: string, port?: WebSocketPort) => createScpWebSocketClient(host, port)
  target.get_socket = () => getScpWebSocketClient()
  target.destroy_socket = () => destroyScpWebSocketClient()
}
