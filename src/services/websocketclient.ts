export type WebSocketConnectionState = 'idle' | 'connecting' | 'open' | 'closed'

export type WebSocketClientOptions = {
  url: string
  protocols?: string | string[]
  webSocketFactory?: (url: string, protocols?: string | string[]) => WebSocket
}

export type WebSocketBytesHandler = (bytes: Uint8Array) => void
export type WebSocketStateHandler = (state: WebSocketConnectionState) => void
export type WebSocketErrorHandler = (error: Event | Error) => void

type Unsubscribe = () => void

export class WebSocketClient {
  private readonly url: string
  private readonly protocols?: string | string[]
  private readonly webSocketFactory: (url: string, protocols?: string | string[]) => WebSocket
  private readonly bytesHandlers = new Set<WebSocketBytesHandler>()
  private readonly stateHandlers = new Set<WebSocketStateHandler>()
  private readonly errorHandlers = new Set<WebSocketErrorHandler>()
  private socket: WebSocket | null = null
  private state: WebSocketConnectionState = 'idle'

  constructor(options: WebSocketClientOptions) {
    this.url = options.url
    this.protocols = options.protocols
    this.webSocketFactory =
      options.webSocketFactory ?? ((url, protocols) => new WebSocket(url, protocols))
  }

  get connectionState(): WebSocketConnectionState {
    return this.state
  }

  connect(): void {
    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      return
    }

    this.setState('connecting')

    const socket = this.webSocketFactory(this.url, this.protocols)
    socket.binaryType = 'arraybuffer'
    socket.addEventListener('open', this.handleOpen)
    socket.addEventListener('close', this.handleClose)
    socket.addEventListener('error', this.handleError)
    socket.addEventListener('message', this.handleMessage)
    this.socket = socket
  }

  disconnect(code?: number, reason?: string): void {
    this.socket?.close(code, reason)
  }

  sendBytes(bytes: Uint8Array): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('Cannot send bytes before the WebSocket is open.')
    }

    this.socket.send(this.toArrayBuffer(bytes))
  }

  sendMessage(bytes: Uint8Array): void {
    this.sendBytes(bytes)
  }

  onBytes(handler: WebSocketBytesHandler): Unsubscribe {
    this.bytesHandlers.add(handler)

    return () => {
      this.bytesHandlers.delete(handler)
    }
  }

  onStateChange(handler: WebSocketStateHandler): Unsubscribe {
    this.stateHandlers.add(handler)
    handler(this.state)

    return () => {
      this.stateHandlers.delete(handler)
    }
  }

  onError(handler: WebSocketErrorHandler): Unsubscribe {
    this.errorHandlers.add(handler)

    return () => {
      this.errorHandlers.delete(handler)
    }
  }

  protected handleIncomingBytes(bytes: Uint8Array): void {
    for (const handler of this.bytesHandlers) {
      handler(bytes)
    }
  }

  private readonly handleOpen = (): void => {
    this.setState('open')
  }

  private readonly handleClose = (): void => {
    this.setState('closed')
    this.teardownSocket()
  }

  private readonly handleError = (event: Event): void => {
    for (const handler of this.errorHandlers) {
      handler(event)
    }
  }

  private readonly handleMessage = async (event: MessageEvent<ArrayBuffer | Blob | Uint8Array>): Promise<void> => {
    try {
      const bytes = await this.normalizeIncomingData(event.data)
      this.handleIncomingBytes(bytes)
    } catch (error) {
      const normalizedError =
        error instanceof Error ? error : new Error('Failed to normalize incoming WebSocket bytes.')

      for (const handler of this.errorHandlers) {
        handler(normalizedError)
      }
    }
  }

  private setState(state: WebSocketConnectionState): void {
    this.state = state

    for (const handler of this.stateHandlers) {
      handler(state)
    }
  }

  private teardownSocket(): void {
    if (!this.socket) {
      return
    }

    this.socket.removeEventListener('open', this.handleOpen)
    this.socket.removeEventListener('close', this.handleClose)
    this.socket.removeEventListener('error', this.handleError)
    this.socket.removeEventListener('message', this.handleMessage)
    this.socket = null
  }

  private async normalizeIncomingData(data: ArrayBuffer | Blob | Uint8Array): Promise<Uint8Array> {
    if (data instanceof Uint8Array) {
      return new Uint8Array(data)
    }

    if (data instanceof ArrayBuffer) {
      return new Uint8Array(data)
    }

    return new Uint8Array(await data.arrayBuffer())
  }

  private toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    return new Uint8Array(bytes).buffer
  }
}
