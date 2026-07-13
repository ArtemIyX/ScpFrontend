import { describe, expect, it } from 'vitest'

import {
  decodeRuntimeEnvelope,
  decodeRuntimePayload,
  encodeRuntimeEnvelope,
  encodeRuntimePayload,
} from '@/proto/runtimeMessages'
import { GameWebSocketBridge } from '@/services'

describe('protobuf runtime messages', () => {
  it('encodes and decodes payloads through the runtime envelope', () => {
    const payloadBytes = encodeRuntimePayload('HELLO', {
      client_name: 'scp-front',
      client_version: '0.0.0',
      capabilities: ['menu', 'hud', 'localization-http'],
    })

    const envelopeBytes = encodeRuntimeEnvelope({
      protocol_version: 3,
      message_type: 'HELLO',
      payload: payloadBytes,
      sequence: 14,
      ack: 9,
    })

    const envelope = decodeRuntimeEnvelope(envelopeBytes)
    const payload = decodeRuntimePayload<{
      client_name: string
      client_version: string
      capabilities: string[]
    }>('HELLO', envelope.payload)

    expect(envelope.protocol_version).toBe(3)
    expect(envelope.message_type).toBe('HELLO')
    expect(envelope.sequence).toBe(14)
    expect(envelope.ack).toBe(9)
    expect(payload).toEqual({
      client_name: 'scp-front',
      client_version: '0.0.0',
      capabilities: ['menu', 'hud', 'localization-http'],
    })
  })
})

describe('GameWebSocketBridge', () => {
  it('sends protobuf envelopes over a binary websocket', () => {
    const socket = new FakeWebSocket()
    const bridge = new GameWebSocketBridge({
      url: 'ws://127.0.0.1:7777',
      protocolVersion: 5,
      webSocketFactory: () => socket as unknown as WebSocket,
    })

    bridge.connect()
    socket.open()
    bridge.sendMessage('UI_COMMAND', {
      action: 'open_pause_menu',
      params: {
        source: 'escape',
      },
    })

    expect(socket.sentFrames).toHaveLength(1)

    const firstFrame = socket.sentFrames[0]
    expect(firstFrame).toBeDefined()

    const envelope = decodeRuntimeEnvelope(firstFrame as Uint8Array)
    const payload = decodeRuntimePayload<{
      action: string
      params: Record<string, string>
    }>('UI_COMMAND', envelope.payload)

    expect(socket.binaryType).toBe('arraybuffer')
    expect(envelope.protocol_version).toBe(5)
    expect(envelope.message_type).toBe('UI_COMMAND')
    expect(envelope.sequence).toBe(1)
    expect(payload).toEqual({
      action: 'open_pause_menu',
      params: {
        source: 'escape',
      },
    })
  })

  it('decodes incoming protobuf envelopes and publishes connection state', async () => {
    const socket = new FakeWebSocket()
    const bridge = new GameWebSocketBridge({
      url: 'ws://127.0.0.1:7777',
      webSocketFactory: () => socket as unknown as WebSocket,
    })
    const states: string[] = []
    const messages: Array<{
      payloadType: string | null
      payload: unknown
    }> = []

    bridge.onStateChange((state) => {
      states.push(state)
    })
    bridge.onMessage((message) => {
      messages.push({
        payloadType: message.payloadType,
        payload: message.payload,
      })
    })

    bridge.connect()
    socket.open()
    socket.emitMessage(
      encodeRuntimeEnvelope({
        protocol_version: 1,
        message_type: 'GAME_STATE',
        payload: encodeRuntimePayload('GAME_STATE', {
          screen: 'hud',
          phase: 'live',
          input_locked: false,
          notices: ['Door sealed', 'Radio clear'],
        }),
        sequence: 7,
        ack: 6,
      }),
    )
    await Promise.resolve()
    socket.close()

    expect(states).toEqual(['idle', 'connecting', 'connected', 'closed'])
    expect(messages).toEqual([
      {
        payloadType: 'GAME_STATE',
        payload: {
          screen: 'hud',
          phase: 'live',
          input_locked: false,
          notices: ['Door sealed', 'Radio clear'],
        },
      },
    ])
  })
})

class FakeWebSocket extends EventTarget {
  binaryType: BinaryType = 'blob'
  readyState = 0
  sentFrames: Uint8Array[] = []

  send(data: BufferSource): void {
    if (data instanceof ArrayBuffer) {
      this.sentFrames.push(new Uint8Array(data))
      return
    }

    if (ArrayBuffer.isView(data)) {
      this.sentFrames.push(new Uint8Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)))
      return
    }

    throw new Error('Unsupported buffer source.')
  }

  close(): void {
    this.readyState = 3
    this.dispatchEvent(new CloseEvent('close'))
  }

  open(): void {
    this.readyState = 1
    this.dispatchEvent(new Event('open'))
  }

  emitMessage(data: Uint8Array): void {
    this.dispatchEvent(
      new MessageEvent('message', {
        data: data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength),
      }),
    )
  }
}
