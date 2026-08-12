import { MessageType } from '@/proto/gen/scp_webui'

const responseTypeByRequest = new Map<number, number>([
  [MessageType.MESSAGE_PING, MessageType.MESSAGE_PONG],
  [MessageType.REQUEST_GET_DISPLAY_SETTINGS, MessageType.RESPONSE_DISPLAY_SETTINGS],
  [MessageType.REQUEST_GET_GRAPHICS_SETTINGS, MessageType.RESPONSE_GRAPHICS_SETTINGS],
  [MessageType.REQUEST_GET_AUDIO_SETTINGS, MessageType.RESPONSE_AUDIO_SETTINGS],
  [MessageType.REQUEST_GET_KEYS_SETTINGS, MessageType.RESPONSE_ALL_KEY_SETTINGS],
  [MessageType.REQUEST_CLEAR_KEY_SETTINGS, MessageType.RESPONSE_SINGLE_KEY_SETTING],
  [MessageType.REQUEST_RESET_KEY_SETTINGS, MessageType.RESPONSE_SINGLE_KEY_SETTING],
  [MessageType.REQUEST_SET_KEYS_SETTINGS, MessageType.RESPONSE_KEYS_SETTINGS],
  [MessageType.REQUEST_RESET_ALL_KEY_SETTINGS, MessageType.RESPONSE_KEYS_SETTINGS],
  [MessageType.REQUEST_GET_LOCALIZATION, MessageType.RESPONSE_LOCALIZATION],
  [MessageType.REQUEST_GET_CURRENT_CULTURE, MessageType.RESPONSE_CURRENT_CULTURE],
  [MessageType.REQUEST_GET_SUPPORTED_CULTURES, MessageType.RESPONSE_SUPPORTED_CULTURES],
  [MessageType.REQUEST_SET_CULTURE, MessageType.MESSAGE_CULTURE_CHANGED],
])

export type DebugWaitingEntry = {
  id: number
  requestTypeName: string
  responseType: number
  responseTypeName: string
  timestamp: number
}

export function expectedResponseType(messageType: number): number | null {
  return responseTypeByRequest.get(messageType) ?? null
}

export function removeMatchingWaitingEntry(
  entries: DebugWaitingEntry[],
  responseType: number,
): DebugWaitingEntry[] {
  const matchingIndex = entries.findIndex((entry) => entry.responseType === responseType)
  if (matchingIndex < 0) {
    return entries
  }

  return entries.filter((_, index) => index !== matchingIndex)
}
