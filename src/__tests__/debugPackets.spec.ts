import { describe, expect, it } from 'vitest'

import { MessageType } from '../proto/gen/scp_webui'
import {
  expectedResponseType,
  removeMatchingWaitingEntry,
  type DebugWaitingEntry,
} from '../components/debug/debugpackets'

describe('debug packet waiting relationships', () => {
  it('maps requests to their expected response types', () => {
    expect(expectedResponseType(MessageType.REQUEST_GET_DISPLAY_SETTINGS)).toBe(
      MessageType.RESPONSE_DISPLAY_SETTINGS,
    )
    expect(expectedResponseType(MessageType.MESSAGE_PING)).toBe(MessageType.MESSAGE_PONG)
    expect(expectedResponseType(MessageType.REQUEST_SET_DISPLAY_SETTINGS)).toBeNull()
  })

  it('removes the oldest matching waiting entry', () => {
    const entries: DebugWaitingEntry[] = [
      {
        id: 1,
        requestTypeName: 'REQUEST_GET_DISPLAY_SETTINGS',
        responseType: MessageType.RESPONSE_DISPLAY_SETTINGS,
        responseTypeName: 'RESPONSE_DISPLAY_SETTINGS',
        timestamp: 1,
      },
      {
        id: 2,
        requestTypeName: 'REQUEST_GET_GRAPHICS_SETTINGS',
        responseType: MessageType.RESPONSE_GRAPHICS_SETTINGS,
        responseTypeName: 'RESPONSE_GRAPHICS_SETTINGS',
        timestamp: 2,
      },
    ]

    expect(removeMatchingWaitingEntry(entries, MessageType.RESPONSE_DISPLAY_SETTINGS)).toEqual([
      entries[1],
    ])
  })
})
