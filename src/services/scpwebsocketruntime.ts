import { MessageType } from '@/proto/gen/scp_webui'

import { ScpWebSocketClient } from './scpwebsocketclient'

let sharedScpWebSocketClient: ScpWebSocketClient | null = null

export function createScpWebSocketClient(host: string): ScpWebSocketClient {
  const url = normalizeSocketUrl(host)
  let hasOpened = false

  if (sharedScpWebSocketClient) {
    sharedScpWebSocketClient.disconnect()
  }

  sharedScpWebSocketClient = new ScpWebSocketClient({ url })
  sharedScpWebSocketClient.onTypedMessage(MessageType.MESSAGE_PONG, (message) => {
    console.log(JSON.stringify(message))
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

export function normalizeSocketUrl(host: string): string {
  const trimmedHost = host.trim()

  if (trimmedHost.startsWith('ws://') || trimmedHost.startsWith('wss://')) {
    return trimmedHost
  }

  return `ws://${trimmedHost}`
}
