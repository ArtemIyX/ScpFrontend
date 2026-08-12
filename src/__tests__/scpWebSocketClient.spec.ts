import { describe, expect, it } from 'vitest'

import { MessageType, PingMessage, ScpEnvelope } from '../proto/gen/scp_webui'
import {
  ScpWebSocketClient,
  messageTypeName,
  type ScpPacketEvent,
} from '../services/scpwebsocketclient'

class FakeWebSocket {
  static readonly CLOSED = 3
  static readonly OPEN = 1

  readonly sent: ArrayBuffer[] = []
  readyState = 0
  binaryType = ''
  private readonly listeners = new Map<string, Set<(event?: unknown) => void>>()

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

  open(): void {
    this.readyState = FakeWebSocket.OPEN
    this.dispatch('open')
  }

  receive(data: ArrayBuffer): void {
    this.dispatch('message', { data })
  }

  private dispatch(type: string, event?: unknown): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener(event)
    }
  }
}

describe('ScpWebSocketClient packet observation', () => {
  it('emits named sent and received packet events', async () => {
    const socket = new FakeWebSocket()
    const client = new ScpWebSocketClient({
      url: 'ws://localhost:18181',
      webSocketFactory: () => socket as unknown as WebSocket,
    })
    const events: ScpPacketEvent[] = []

    client.onPacket((event) => events.push(event))
    client.connect()
    socket.open()
    client.sendTypedMessage(
      MessageType.MESSAGE_PING,
      { clientTimeMs: '1', code: 7 },
      PingMessage,
    )
    socket.receive(
      ScpEnvelope.encode({
        messageType: MessageType.MESSAGE_PONG,
        messageBytes: new Uint8Array(0),
      }).finish().buffer,
    )
    await new Promise<void>((resolve) => queueMicrotask(resolve))

    expect(events.map(({ direction, messageTypeName }) => ({ direction, messageTypeName }))).toEqual([
      { direction: 'sent', messageTypeName: 'MESSAGE_PING' },
      { direction: 'received', messageTypeName: 'MESSAGE_PONG' },
    ])
  })

  it('uses a stable fallback for unknown packet types', () => {
    expect(messageTypeName(999)).toBe('UNKNOWN_MESSAGE_TYPE_999')
  })
})
