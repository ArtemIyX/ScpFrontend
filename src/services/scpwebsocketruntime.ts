import { MessageType } from '@/proto/gen/scp_webui'
import { installLocalizationClient } from '@/localization'

import { ScpWebSocketClient } from './scpwebsocketclient'

let sharedScpWebSocketClient: ScpWebSocketClient | null = null

export type WebSocketPort = number | string

export function createScpWebSocketClient(host: string, port?: WebSocketPort): ScpWebSocketClient {
  const url = normalizeSocketUrl(host, port)
  let hasOpened = false

  if (sharedScpWebSocketClient) {
    sharedScpWebSocketClient.disconnect()
  }

  sharedScpWebSocketClient = new ScpWebSocketClient({ url })
  installLocalizationClient(sharedScpWebSocketClient)
  sharedScpWebSocketClient.onTypedMessage(MessageType.MESSAGE_PONG, (message) => {
    console.log("pong:" + JSON.stringify(message))
  })
  sharedScpWebSocketClient.onStateChange((state) => {
    if (!sharedScpWebSocketClient || sharedScpWebSocketClient.socketUrl !== url) {
      return
    }

    if (state === 'open') {
      hasOpened = true
      console.info('[scp-websocket] connected', url)
      return
    }

    if (state === 'closed') {
      if (hasOpened) {
        console.warn('[scp-websocket] closed', url)
      } else {
        console.error('[scp-websocket] failed to connect', url)
      }
    }
  })
  sharedScpWebSocketClient.onError((error) => {
    if (!sharedScpWebSocketClient || sharedScpWebSocketClient.socketUrl !== url) {
      return
    }

    console.error('[scp-websocket] error', url, error)
  })
  console.info('[scp-websocket] connecting', url)
  sharedScpWebSocketClient.connect()

  return sharedScpWebSocketClient
}

/** Connects to a game client using the separate IP/port values supplied by Unreal. */
export function connectScpWebSocket(ip: string, port: WebSocketPort): ScpWebSocketClient {
  return createScpWebSocketClient(ip, port)
}

export function getScpWebSocketClient(): ScpWebSocketClient | null {
  return sharedScpWebSocketClient
}

export function requireScpWebSocketClient(): ScpWebSocketClient {
  if (!sharedScpWebSocketClient) {
    throw new Error('SCP WebSocket client has not been created yet.')
  }

  return sharedScpWebSocketClient
}

export function destroyScpWebSocketClient(): void {
  if (!sharedScpWebSocketClient) {
    return
  }

  sharedScpWebSocketClient.disconnect()
  sharedScpWebSocketClient = null
}

export function normalizeSocketUrl(host: string, port?: WebSocketPort): string {
  const trimmedHost = host.trim()

  if (!trimmedHost) {
    throw new Error('WebSocket host cannot be empty.')
  }

  if (port !== undefined) {
    if (trimmedHost.startsWith('ws://') || trimmedHost.startsWith('wss://')) {
      throw new Error('WebSocket host must not include a protocol when port is provided.')
    }

    const normalizedPort = Number(port)
    if (!Number.isInteger(normalizedPort) || normalizedPort < 1 || normalizedPort > 65535) {
      throw new RangeError('WebSocket port must be an integer between 1 and 65535.')
    }

    const normalizedHost =
      trimmedHost.includes(':') && !trimmedHost.startsWith('[') ? `[${trimmedHost}]` : trimmedHost

    return `ws://${normalizedHost}:${normalizedPort}`
  }

  if (trimmedHost.startsWith('ws://') || trimmedHost.startsWith('wss://')) {
    return trimmedHost
  }

  return `ws://${trimmedHost}`
}
