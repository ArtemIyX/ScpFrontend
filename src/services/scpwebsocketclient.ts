import {
  ResponseDisplaySettings,
  type ResponseDisplaySettings as ResponseDisplaySettingsShape,
} from '@/proto/gen/display_settings'
import {
  MessageType,
  PingMessage,
  PongMessage,
  ScpEnvelope,
  type PingMessage as PingMessageShape,
  type PongMessage as PongMessageShape,
} from '@/proto/gen/scp_webui'

import { WebSocketClient, type WebSocketClientOptions } from './websocketclient'

export type ScpIncomingMessageMap = {
  [MessageType.MESSAGE_PING]: PingMessageShape
  [MessageType.MESSAGE_PONG]: PongMessageShape
  [MessageType.RESPONSE_DISPLAY_SETTINGS]: ResponseDisplaySettingsShape
}

export type ScpKnownMessageType = keyof ScpIncomingMessageMap

export type ScpEnvelopeHandler = (envelope: ScpEnvelope) => void
export type ScpUnknownMessageHandler = (envelope: ScpEnvelope) => void
export type ScpMessageHandler<TMessage> = (message: TMessage, envelope: ScpEnvelope) => void

type Unsubscribe = () => void

type MessageCodec<TMessage> = {
  decode(input: Uint8Array): TMessage
  encode(message: TMessage): { finish(): Uint8Array }
}

export class ScpWebSocketClient extends WebSocketClient {
  private readonly envelopeHandlers = new Set<ScpEnvelopeHandler>()
  private readonly unknownMessageHandlers = new Set<ScpUnknownMessageHandler>()
  private readonly typedHandlers = new Map<number, Set<ScpMessageHandler<unknown>>>()
  private readonly codecs = new Map<number, MessageCodec<unknown>>()

  constructor(options: WebSocketClientOptions) {
    super(options)

    this.registerCodec(MessageType.MESSAGE_PING, PingMessage)
    this.registerCodec(MessageType.MESSAGE_PONG, PongMessage)
    this.registerCodec(MessageType.RESPONSE_DISPLAY_SETTINGS, ResponseDisplaySettings)
    this.onBytes((bytes) => {
      this.handleEnvelopeBytes(bytes)
    })
  }

  sendTypedMessage<TMessage>(
    messageType: number,
    message: TMessage,
    codec: MessageCodec<TMessage>,
  ): void {
    const messageBytes = codec.encode(message).finish()

    this.sendEnvelope({
      messageType,
      messageBytes,
    })
  }

  sendEnvelope(envelope: ScpEnvelope): void {
    const bytes = ScpEnvelope.encode(envelope).finish()
    this.sendBytes(bytes)
  }

  registerCodec<TMessage>(messageType: number, codec: MessageCodec<TMessage>): void {
    this.codecs.set(messageType, codec as MessageCodec<unknown>)
  }

  onEnvelope(handler: ScpEnvelopeHandler): Unsubscribe {
    this.envelopeHandlers.add(handler)

    return () => {
      this.envelopeHandlers.delete(handler)
    }
  }

  onUnknownMessage(handler: ScpUnknownMessageHandler): Unsubscribe {
    this.unknownMessageHandlers.add(handler)

    return () => {
      this.unknownMessageHandlers.delete(handler)
    }
  }

  onTypedMessage<TType extends ScpKnownMessageType>(
    messageType: TType,
    handler: ScpMessageHandler<ScpIncomingMessageMap[TType]>,
  ): Unsubscribe {
    const handlers = this.typedHandlers.get(messageType) ?? new Set<ScpMessageHandler<unknown>>()
    handlers.add(handler as ScpMessageHandler<unknown>)
    this.typedHandlers.set(messageType, handlers)

    return () => {
      handlers.delete(handler as ScpMessageHandler<unknown>)
      if (handlers.size === 0) {
        this.typedHandlers.delete(messageType)
      }
    }
  }

  private handleEnvelopeBytes(bytes: Uint8Array): void {
    try {
      const envelope = ScpEnvelope.decode(bytes)

      for (const handler of this.envelopeHandlers) {
        handler(envelope)
      }

      const codec = this.codecs.get(envelope.messageType)
      const handlers = this.typedHandlers.get(envelope.messageType)

      if (!codec || !handlers || handlers.size === 0) {
        for (const handler of this.unknownMessageHandlers) {
          handler(envelope)
        }
        return
      }

      const decodedMessage = codec.decode(envelope.messageBytes)

      for (const handler of handlers) {
        handler(decodedMessage, envelope)
      }
    } catch (error) {
      console.error(
        '[scp-websocket] failed to decode envelope bytes',
        Array.from(bytes.slice(0, 32))
          .map((value) => value.toString(16).padStart(2, '0'))
          .join(' '),
      )
      throw error
    }
  }
}
