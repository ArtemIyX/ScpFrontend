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
const knownRows = new Map<string, LocalizedTextRef>()
const catalogBySource = new Map<string, LocalizedTextRef>()
const keysByTable = new Map<LocalizationTable, Set<string>>()
const preloadedTables = new Set<LocalizationTable>()
const version = ref(0)
let attachedClient: ScpWebSocketClient | null = null
let unsubscribeResponse: (() => void) | undefined
let unsubscribeState: (() => void) | undefined
let unsubscribeCultureChanged: (() => void) | undefined

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
      const keys = keysByTable.get(table) ?? new Set<string>()
      keys.add(row[1])
      keysByTable.set(table, keys)
    }
  }
}

function identifier(table: string, key: string): string {
  return `${table}\u0000${key}`
}

function request(ref: LocalizedTextRef): void {
  const id = identifier(ref.table, ref.key)
  knownRows.set(id, ref)
  if (requestedValues.has(id) || localizedValues.has(id) || attachedClient?.connectionState !== 'open') return

  requestedValues.add(id)
  attachedClient.sendTypedMessage(
    MessageType.REQUEST_GET_LOCALIZATION,
    { payload: [{ table: ref.table, key: ref.key }] },
    RequestGetLocalization,
  )
}

function requestTable(table: LocalizationTable): void {
  if (attachedClient?.connectionState !== 'open') return
  const payload = [...(keysByTable.get(table) ?? [])]
    .filter((key) => {
      const id = identifier(table, key)
      knownRows.set(id, { table, key })
      if (requestedValues.has(id) || localizedValues.has(id)) return false
      requestedValues.add(id)
      return true
    })
    .map((key) => ({ table, key }))

  if (payload.length > 0) {
    attachedClient.sendTypedMessage(MessageType.REQUEST_GET_LOCALIZATION, { payload }, RequestGetLocalization)
  }
}

function requestKnownRows(): void {
  if (attachedClient?.connectionState !== 'open') return
  const payload = [...knownRows.values()].filter((ref) => {
    const id = identifier(ref.table, ref.key)
    if (requestedValues.has(id) || localizedValues.has(id)) return false
    requestedValues.add(id)
    return true
  })

  if (payload.length > 0) {
    attachedClient.sendTypedMessage(MessageType.REQUEST_GET_LOCALIZATION, { payload }, RequestGetLocalization)
  }
}

function receive(message: ResponseLocalization): void {
  for (const entry of message.payload) {
    if (!entry.request) continue
    const id = identifier(entry.request.table, entry.request.key)
    knownRows.set(id, entry.request as LocalizedTextRef)
    localizedValues.set(id, entry.response)
    requestedValues.delete(id)
  }
}

export function installLocalizationClient(client: ScpWebSocketClient): void {
  if (attachedClient === client) return
  unsubscribeResponse?.()
  unsubscribeState?.()
  unsubscribeCultureChanged?.()
  attachedClient = client
  unsubscribeResponse = client.onTypedMessage(MessageType.RESPONSE_LOCALIZATION, receive)
  unsubscribeCultureChanged = client.onTypedMessage(MessageType.MESSAGE_CULTURE_CHANGED, () => {
    localizedValues.clear()
    requestedValues.clear()
    version.value += 1
    requestKnownRows()
  })
  unsubscribeState = client.onStateChange((state) => {
    if (state === 'open') {
      requestedValues.clear()
      version.value += 1
      requestKnownRows()
    }
  })
}

export function provideLocalizationTable(table: LocalizationTable): void {
  provide(localizationTableKey, table)
}

/** Preloads every key in a table. Safe to call repeatedly and does nothing while disconnected. */
export function preloadLocalizationTable(table: LocalizationTable): void {
  preloadedTables.add(table)
  for (const key of keysByTable.get(table) ?? []) {
    knownRows.set(identifier(table, key), { table, key })
  }
  requestTable(table)
}

export function preloadSettingsLocalizations(): void {
  for (const table of keysByTable.keys()) {
    if (table.startsWith('Local.Settings.')) preloadLocalizationTable(table)
  }
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
