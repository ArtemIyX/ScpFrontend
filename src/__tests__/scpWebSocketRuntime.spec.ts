import { describe, expect, it } from 'vitest'

import { normalizeSocketUrl } from '../services/scpwebsocketruntime'

describe('SCP WebSocket runtime URL handling', () => {
  it('builds a websocket URL from the separate host and port', () => {
    expect(normalizeSocketUrl('localhost', 18181)).toBe('ws://localhost:18181')
    expect(normalizeSocketUrl('::1', 18181)).toBe('ws://[::1]:18181')
  })

  it('rejects invalid ports before opening a socket', () => {
    expect(() => normalizeSocketUrl('localhost', 0)).toThrow(RangeError)
    expect(() => normalizeSocketUrl('localhost', 65536)).toThrow(RangeError)
  })
})
