import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ScpWebSocketClient } from '../services/scpwebsocketclient'

const {
  createScpWebSocketClient,
  connectScpWebSocket,
  getScpWebSocketClient,
  destroyScpWebSocketClient,
} = vi.hoisted(() => ({
  createScpWebSocketClient: vi.fn(() => ({}) as ScpWebSocketClient),
  connectScpWebSocket: vi.fn(() => ({}) as ScpWebSocketClient),
  getScpWebSocketClient: vi.fn(() => null),
  destroyScpWebSocketClient: vi.fn(),
}))

vi.mock('../services/scpwebsocketruntime', () => ({
  connectScpWebSocket,
  createScpWebSocketClient,
  destroyScpWebSocketClient,
  getScpWebSocketClient,
}))

import { installScpWebSocketWindowApi } from '../services/installScpWebSocketWindowApi'

describe('SCP WebSocket window API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registers the Unreal-compatible IP/port connection function', () => {
    const target = {} as Window

    installScpWebSocketWindowApi(target)
    target.connect_socket('127.0.0.1', 18181)

    expect(connectScpWebSocket).toHaveBeenCalledWith('127.0.0.1', 18181)
  })

  it('keeps the existing host-based debug function available', () => {
    const target = {} as Window

    installScpWebSocketWindowApi(target)
    target.create_socket('localhost:18181')

    expect(createScpWebSocketClient).toHaveBeenCalledWith('localhost:18181', undefined)
  })
})
