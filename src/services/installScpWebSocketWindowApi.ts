import {
  createScpWebSocketClient,
  destroyScpWebSocketClient,
  getScpWebSocketClient,
} from './scpwebsocketruntime'

export function installScpWebSocketWindowApi(target: Window = window): void {
  target.create_socket = (host: string) => createScpWebSocketClient(host)
  target.get_socket = () => getScpWebSocketClient()
  target.destroy_socket = () => destroyScpWebSocketClient()
}
