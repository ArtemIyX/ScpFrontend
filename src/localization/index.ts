import { inject, provide, reactive, ref, type InjectionKey } from 'vue'

import { RequestGetLocalization, type ResponseLocalization } from '@/proto/gen/local'
import { MessageType } from '@/proto/gen/scp_webui'
import type { ScpWebSocketClient } from '@/services/scpwebsocketclient'

import type { LocalizationTable } from './tags'

export interface LocalizedTextRef {
  table: LocalizationTable
  key: string
}

const localizationTableKey: InjectionKey<LocalizationTable | undefined> = Symbol('localization-table')
const localizedValues = reactive(new Map<string, string>())
const requestedValues = new Set<string>()
const catalogBySource = new Map<string, LocalizedTextRef>()
const version = ref(0)
let attachedClient: ScpWebSocketClient | null = null
let unsubscribeResponse: (() => void) | undefined
let unsubscribeState: (() => void) | undefined

const tableFiles: Record<string, LocalizationTable> = {
  Input: 'Local.Input',
  Menu: 'Local.Menu',
  SettingsAudio: 'Local.Settings.Audio',
  SettingsControls: 'Local.Settings.Controls',
  SettingsDisplay: 'Local.Settings.Display',
  SettingsGameplay: 'Local.Settings.Gameplay',
  SettingsGraphics: 'Local.Settings.Graphics',
  SettingsKeybindings: 'Local.Settings.KeyBindings',
}

const rawTables = import.meta.glob<string>('../../tables/*.csv', {
  eager: true,
  query: '?raw',
  import: 'default',
})

for (const [path, csv] of Object.entries(rawTables)) {
  const match = /\/([^/]+)\.csv$/.exec(path)
  const fileName = match?.[1]
  const table = fileName ? tableFiles[fileName] : undefined
  if (!table) continue

  for (const line of csv.split(/\r?\n/).slice(1)) {
    const row = /^"([^"]+)","([\s\S]*)"$/.exec(line)
    if (row?.[1] && row[2] !== undefined) {
      catalogBySource.set(row[2], { table, key: row[1] })
    }
  }
}

function identifier(table: string, key: string): string {
  return `${table}\u0000${key}`
}

function request(ref: LocalizedTextRef): void {
  const id = identifier(ref.table, ref.key)
  if (requestedValues.has(id) || localizedValues.has(id) || attachedClient?.connectionState !== 'open') return

  requestedValues.add(id)
  attachedClient.sendTypedMessage(
    MessageType.REQUEST_GET_LOCALIZATION,
    { payload: [{ table: ref.table, key: ref.key }] },
    RequestGetLocalization,
  )
}

function receive(message: ResponseLocalization): void {
  for (const entry of message.payload) {
    if (!entry.request) continue
    const id = identifier(entry.request.table, entry.request.key)
    localizedValues.set(id, entry.response)
    requestedValues.delete(id)
  }
}

export function installLocalizationClient(client: ScpWebSocketClient): void {
  if (attachedClient === client) return
  unsubscribeResponse?.()
  unsubscribeState?.()
  attachedClient = client
  unsubscribeResponse = client.onTypedMessage(MessageType.RESPONSE_LOCALIZATION, receive)
  unsubscribeState = client.onStateChange((state) => {
    if (state === 'open') {
      requestedValues.clear()
      version.value += 1
    }
  })
}

export function provideLocalizationTable(table: LocalizationTable): void {
  provide(localizationTableKey, table)
}

/** Resolves a table/key pair. Until Unreal responds, the visible fallback is the key. */
export function useLocalizedText(): (
  text?: string,
  explicit?: Partial<LocalizedTextRef> & Pick<LocalizedTextRef, 'key'>,
) => string | undefined {
  const inheritedTable = inject(localizationTableKey, undefined)

  return (text, explicit) => {
    void version.value
    const ref = explicit
      ? explicit.table || !inheritedTable
        ? (explicit as LocalizedTextRef)
        : { table: inheritedTable, key: explicit.key }
      : inheritedTable
        ? text === undefined
          ? undefined
          : catalogBySource.get(text)
        : undefined
    if (!ref) return text
    request(ref)
    return localizedValues.get(identifier(ref.table, ref.key)) ?? ref.key
  }
}
