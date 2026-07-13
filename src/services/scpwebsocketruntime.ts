import { ScpWebSocketClient } from './scpwebsocketclient'

let sharedScpWebSocketClient: ScpWebSocketClient | null = null

export function createScpWebSocketClient(host: string): ScpWebSocketClient {
  const url = normalizeSocketUrl(host)

  if (sharedScpWebSocketClient) {
    sharedScpWebSocketClient.disconnect()
  }

  sharedScpWebSocketClient = new ScpWebSocketClient({ url })
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
