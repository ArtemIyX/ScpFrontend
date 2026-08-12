import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { MessageType, PingMessage, ScpEnvelope } from '../proto/gen/scp_webui'
import { normalizeSocketUrl } from '../services/scpwebsocketruntime'

class FakeWebSocket {
  static readonly CONNECTING = 0
  static readonly OPEN = 1
  static readonly CLOSING = 2
  static readonly CLOSED = 3
  static lastInstance: FakeWebSocket | null = null

  readonly sent: ArrayBuffer[] = []
  readyState = FakeWebSocket.CONNECTING
  binaryType = ''
  private readonly listeners = new Map<string, Set<(event?: unknown) => void>>()

  constructor() {
    FakeWebSocket.lastInstance = this
  }

  addEventListener(type: string, listener: (event?: unknown) => void): void {
    const listeners = this.listeners.get(type) ?? new Set<(event?: unknown) => void>()
    listeners.add(listener)
    this.listeners.set(type, listeners)
  }

  removeEventListener(type: string, listener: (event?: unknown) => void): void {
    this.listeners.get(type)?.delete(listener)
  }

  send(data: ArrayBuffer): void {
    this.sent.push(data)
  }

  close(): void {
    this.readyState = FakeWebSocket.CLOSED
    this.dispatch('close')
  }

  open(): void {
    this.readyState = FakeWebSocket.OPEN
    this.dispatch('open')
  }

  private dispatch(type: string, event?: unknown): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener(event)
    }
  }
}

describe('SCP WebSocket runtime URL handling', () => {
  beforeEach(() => {
    vi.stubGlobal('WebSocket', FakeWebSocket)
  })

  afterEach(async () => {
    const { destroyScpWebSocketClient } = await import('../services/scpwebsocketruntime')
    destroyScpWebSocketClient()
    vi.unstubAllGlobals()
  })

  it('builds a websocket URL from the separate host and port', () => {
    expect(normalizeSocketUrl('localhost', 18181)).toBe('ws://localhost:18181')
    expect(normalizeSocketUrl('::1', 18181)).toBe('ws://[::1]:18181')
  })

  it('rejects invalid ports before opening a socket', () => {
    expect(() => normalizeSocketUrl('localhost', 0)).toThrow(RangeError)
    expect(() => normalizeSocketUrl('localhost', 65536)).toThrow(RangeError)
  })

  it('logs the Unreal connection marker and sends a handshake ping after opening', async () => {
    const { connectScpWebSocket, SCP_WEBSOCKET_CONNECTED_MESSAGE } =
      await import('../services/scpwebsocketruntime')
    const consoleInfo = vi.spyOn(console, 'info').mockImplementation(() => undefined)
    connectScpWebSocket('localhost', 18181)
    const fakeSocket = FakeWebSocket.lastInstance
    if (!fakeSocket) {
      throw new Error('Expected the runtime to create a WebSocket.')
    }

    fakeSocket.open()

    expect(consoleInfo).toHaveBeenCalledWith(SCP_WEBSOCKET_CONNECTED_MESSAGE)
    expect(fakeSocket.sent).toHaveLength(1)

    const [sentFrame] = fakeSocket.sent
    if (!sentFrame) {
      throw new Error('Expected the connection ping frame to be sent.')
    }

    const envelope = ScpEnvelope.decode(new Uint8Array(sentFrame))
    expect(envelope.messageType).toBe(MessageType.MESSAGE_PING)
    expect(PingMessage.decode(envelope.messageBytes).code).toBe(0)

    consoleInfo.mockRestore()
  })

  it('forwards packet events and connection state through the shared runtime', async () => {
    const {
      connectScpWebSocket,
      onScpWebSocketPacket,
      onScpWebSocketRuntimeState,
    } = await import('../services/scpwebsocketruntime')
    const packetNames: string[] = []
    const states: string[] = []
    const unsubscribePackets = onScpWebSocketPacket((event) => {
      packetNames.push(event.messageTypeName)
    })
    const unsubscribeStates = onScpWebSocketRuntimeState((snapshot) => {
      states.push(snapshot.connectionState)
    })

    connectScpWebSocket('127.0.0.1', 19174)
    const fakeSocket = FakeWebSocket.lastInstance
    if (!fakeSocket) {
      throw new Error('Expected the runtime to create a WebSocket.')
    }

    fakeSocket.open()

    expect(states).toContain('connecting')
    expect(states).toContain('open')
    expect(packetNames).toContain('MESSAGE_PING')

    unsubscribePackets()
    unsubscribeStates()
  })
})
