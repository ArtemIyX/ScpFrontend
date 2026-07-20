<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import GAlert from '@/components/g/GAlert/GAlert.vue'
import GButton from '@/components/g/GButton/GButton.vue'
import GDivider from '@/components/g/GDivider/GDivider.vue'
import GKeybindInput from '@/components/g/GKeybindInput/GKeybindInput.vue'
import GLoading from '@/components/g/GLoading/GLoading.vue'
import GModal from '@/components/g/GModal/GModal.vue'
import GText from '@/components/g/GText/GText.vue'
import {
  RequestClearKeySettings,
  RequestGetKeysSettings,
  RequestResetAllKeySettings,
  RequestSetKeysSettings,
  type ResponseKeysSettings,
  type ResponseMultipleKeySetting,
  type ResponseSingleKeySetting,
} from '@/proto/gen/keybings_settings'
import { MessageType } from '@/proto/gen/scp_webui'
import { getScpWebSocketClient } from '@/services'
import { useSettingsStore } from '@/stores/settings'

import {
  applyKeyBindingDataToCategories,
  createKeyBindingMapFromCategories,
  mapProtoKeyBindingCategories,
  normalizeKeyBindingValue,
  sortKeyBindingCategories,
  sortKeyBindingVisualData,
} from './KeyBindingsSettingsSubview'

const emit = defineEmits<{
  dirtyChange: [dirty: boolean]
}>()

const settingsStore = useSettingsStore()
const { keyBindingCategories, keyBindingsLoadState } = storeToRefs(settingsStore)

const websocketConnected = ref(getScpWebSocketClient()?.connectionState === 'open')
const pendingBindingIds = ref<Set<string>>(new Set())
const pendingBindingValues = ref<Record<string, string | null>>({})
const mutationError = ref('')
const showResetModal = ref(false)

let unsubscribeAllResponse: (() => void) | null = null
let unsubscribeSingleResponse: (() => void) | null = null
let unsubscribeMultipleResponse: (() => void) | null = null
let unsubscribeState: (() => void) | null = null

const keyBindingsLoaded = computed(() => keyBindingsLoadState.value === 'loaded')
const showBlockingLoader = computed(
  () => websocketConnected.value && keyBindingsLoadState.value !== 'loaded',
)
const authoritativeBindings = computed(() => createKeyBindingMapFromCategories(keyBindingCategories.value))
const displayedBindings = computed(() => ({
  ...authoritativeBindings.value,
  ...pendingBindingValues.value,
}))
const uiCategories = computed(() => mapProtoKeyBindingCategories(keyBindingCategories.value))
const pendingCount = computed(() => pendingBindingIds.value.size)
const hasBindings = computed(() => uiCategories.value.length > 0)
const statusLabel = computed(() => {
  if (!keyBindingsLoaded.value) {
    return 'Requesting key bindings from the game client'
  }

  if (pendingCount.value > 0) {
    return `${pendingCount.value} binding change${pendingCount.value === 1 ? '' : 's'} awaiting backend approval`
  }

  if (!websocketConnected.value) {
    return 'Showing cached key bindings from this session'
  }

  return 'Bindings synced with backend'
})

function setSortedCategories(categories: ResponseKeysSettings['categories']): void {
  keyBindingCategories.value = sortKeyBindingCategories(categories).map((category) => ({
    ...category,
    keyBindings: sortKeyBindingVisualData(category.keyBindings),
  }))
}

function setPendingBinding(bindingId: string, value: string | null): void {
  pendingBindingIds.value = new Set(pendingBindingIds.value).add(bindingId)
  pendingBindingValues.value = {
    ...pendingBindingValues.value,
    [bindingId]: value,
  }
}

function clearPendingBindings(bindingIds: string[]): void {
  if (bindingIds.length === 0) {
    return
  }

  const nextIds = new Set(pendingBindingIds.value)
  const nextValues = { ...pendingBindingValues.value }

  for (const bindingId of bindingIds) {
    nextIds.delete(bindingId)
    delete nextValues[bindingId]
  }

  pendingBindingIds.value = nextIds
  pendingBindingValues.value = nextValues
}

function clearAllPendingBindings(): void {
  pendingBindingIds.value = new Set()
  pendingBindingValues.value = {}
}

function applyAuthoritativeBindings(updates: Array<{ uniqueId: string; key: string }>): void {
  keyBindingCategories.value = applyKeyBindingDataToCategories(keyBindingCategories.value, updates)
  clearPendingBindings(updates.map((update) => update.uniqueId))
}

function sendRequest<TMessage>(
  messageType: MessageType,
  message: TMessage,
  codec: {
    encode(message: TMessage): { finish(): Uint8Array }
    decode(input: Uint8Array): TMessage
  },
): boolean {
  const client = getScpWebSocketClient()

  if (!client || client.connectionState !== 'open') {
    mutationError.value = 'The game client is not connected right now.'
    return false
  }

  client.sendTypedMessage(messageType, message, codec)
  return true
}

function requestKeyBindings(force = false): void {
  if (!force && keyBindingsLoadState.value !== 'idle') {
    return
  }

  if (
    sendRequest(
      MessageType.REQUEST_GET_KEYS_SETTINGS,
      { empty: 0 },
      RequestGetKeysSettings,
    )
  ) {
    keyBindingsLoadState.value = 'loading'
    mutationError.value = ''
  }
}

function applyFullKeyBindingsResponse(message: ResponseKeysSettings): void {
  setSortedCategories(message.categories)
  keyBindingsLoadState.value = 'loaded'
  mutationError.value = ''
  clearAllPendingBindings()
}

function applySingleKeyBindingResponse(message: ResponseSingleKeySetting): void {
  mutationError.value = message.error

  if (message.content) {
    applyAuthoritativeBindings([message.content])
    return
  }

  clearAllPendingBindings()
}

function applyMultipleKeyBindingResponse(message: ResponseMultipleKeySetting): void {
  mutationError.value = message.error

  if (message.content.length > 0) {
    applyAuthoritativeBindings(message.content)
    return
  }

  clearAllPendingBindings()
}

function setBinding(bindingId: string, nextValue: string | null): void {
  const normalizedValue = normalizeKeyBindingValue(nextValue)
  const currentValue = authoritativeBindings.value[bindingId] ?? null

  if (normalizedValue === currentValue) {
    clearPendingBindings([bindingId])
    return
  }

  setPendingBinding(bindingId, normalizedValue)
  mutationError.value = ''

  const sent = normalizedValue === null
    ? sendRequest(
        MessageType.REQUEST_CLEAR_KEY_SETTINGS,
        { uniqueId: bindingId },
        RequestClearKeySettings,
      )
    : sendRequest(
        MessageType.REQUEST_SET_KEYS_SETTINGS,
        {
          keyBindings: [
            {
              uniqueId: bindingId,
              key: normalizedValue,
            },
          ],
        },
        RequestSetKeysSettings,
      )

  if (!sent) {
    clearPendingBindings([bindingId])
  }
}

function openResetModal(): void {
  showResetModal.value = true
}

function closeResetModal(): void {
  showResetModal.value = false
}

function resetAllBindings(): void {
  mutationError.value = ''

  if (
    sendRequest(
      MessageType.REQUEST_RESET_ALL_KEY_SETTINGS,
      { empty: 0 },
      RequestResetAllKeySettings,
    )
  ) {
    clearAllPendingBindings()
  }

  closeResetModal()
}

function isBindingPending(bindingId: string): boolean {
  return pendingBindingIds.value.has(bindingId)
}

function isDirty(): boolean {
  return false
}

function saveChanges(): boolean {
  return true
}

function discardChanges(): void {
  clearAllPendingBindings()
}

onMounted(() => {
  emit('dirtyChange', false)

  const client = getScpWebSocketClient()
  if (!client) {
    return
  }

  unsubscribeAllResponse = client.onTypedMessage(
    MessageType.RESPONSE_ALL_KEY_SETTINGS,
    (message) => {
      applyFullKeyBindingsResponse(message)
    },
  )

  unsubscribeSingleResponse = client.onTypedMessage(
    MessageType.RESPONSE_SINGLE_KEY_SETTING,
    (message) => {
      applySingleKeyBindingResponse(message)
    },
  )

  unsubscribeMultipleResponse = client.onTypedMessage(
    MessageType.RESPONSE_KEYS_SETTINGS,
    (message) => {
      applyMultipleKeyBindingResponse(message)
    },
  )

  unsubscribeState = client.onStateChange((state) => {
    websocketConnected.value = state === 'open'

    if (state === 'open' && keyBindingsLoadState.value === 'idle') {
      requestKeyBindings()
    }
  })

  if (client.connectionState === 'open' && keyBindingsLoadState.value === 'idle') {
    requestKeyBindings()
  }
})

onUnmounted(() => {
  unsubscribeAllResponse?.()
  unsubscribeSingleResponse?.()
  unsubscribeMultipleResponse?.()
  unsubscribeState?.()
})

defineExpose({
  discardChanges,
  isDirty,
  saveChanges,
})
</script>

<template>
  <section class="key-bindings-settings" aria-label="Key-bindings settings">
    <GLoading
      v-if="showBlockingLoader"
      label="Key Bindings"
      helper="Waiting for the game client to send grouped key binding data and active mappings."
      status="Syncing"
      width="full"
      centered
    />

    <template v-else>
      <header class="key-bindings-settings__header">
        <div class="key-bindings-settings__toolbar">
          <GText as="p" preset="caps" class="key-bindings-settings__status">
            {{ statusLabel }}
          </GText>

          <div class="key-bindings-settings__actions">
            <GButton preset="danger" shape="soft" :disabled="pendingCount > 0" @click="openResetModal">
              Reset all
            </GButton>
          </div>
        </div>
      </header>

      <GAlert
        v-if="!websocketConnected && !keyBindingsLoaded"
        preset="quiet"
        variant="soft"
        width="full"
        title="Keybindings are loading right now"
        class="key-bindings-settings__alert"
      >
        The websocket is disconnected, so this page stays visible and will fill in when the game
        client reconnects.
      </GAlert>

      <GAlert
        v-if="mutationError"
        preset="warning"
        variant="soft"
        width="full"
        title="Backend adjusted the binding request"
        class="key-bindings-settings__alert"
      >
        {{ mutationError }}
      </GAlert>

      <GAlert
        v-if="!hasBindings"
        preset="quiet"
        variant="soft"
        width="full"
        title="No key bindings available"
        class="key-bindings-settings__alert"
      >
        The game client did not return any key binding categories for this screen yet.
      </GAlert>

      <section
        v-for="category in uiCategories"
        :key="category.id"
        class="key-bindings-settings__category"
        :aria-label="`${category.label} key bindings`"
      >
        <GDivider :label="category.label" preset="quiet" class="key-bindings-settings__divider" />

        <div class="key-bindings-settings__list">
          <div
            v-for="binding in category.bindings"
            :key="binding.id"
            class="key-bindings-settings__row"
            :class="{
              'key-bindings-settings__row--pending': isBindingPending(binding.id),
            }"
          >
            <div class="key-bindings-settings__binding-copy">
              <GText as="p" preset="header" class="key-bindings-settings__binding-name">
                {{ binding.label }}
              </GText>
              <GText
                v-if="isBindingPending(binding.id)"
                as="p"
                preset="muted"
                class="key-bindings-settings__binding-warning"
              >
                Waiting for the backend to confirm this binding.
              </GText>
            </div>

            <GKeybindInput
              :model-value="displayedBindings[binding.id] ?? null"
              width="full"
              size="sm"
              preset="quiet"
              clearable
              :disabled="isBindingPending(binding.id)"
              :aria-label="`${binding.label} key binding`"
              @update:model-value="setBinding(binding.id, $event)"
            />
          </div>
        </div>
      </section>
    </template>

    <GModal
      v-model="showResetModal"
      width="md"
      title="Reset all key bindings"
      subtitle="This sends an immediate reset request to the game client."
      aria-label="Reset all key bindings confirmation"
    >
      <div class="key-bindings-settings__modal-copy">
        <GText as="p" preset="muted">
          The backend will apply the default bindings and return the actual accepted values for the
          whole list.
        </GText>
      </div>

      <template #footer>
        <div class="key-bindings-settings__modal-actions">
          <GButton preset="ghost" shape="soft" @click="closeResetModal">Keep current bindings</GButton>
          <GButton preset="danger" shape="soft" @click="resetAllBindings">Reset all now</GButton>
        </div>
      </template>
    </GModal>
  </section>
</template>

<style scoped>
.key-bindings-settings {
  display: grid;
  align-content: start;
  gap: 1rem;
  min-height: 100%;
}

.key-bindings-settings__header {
  display: grid;
  gap: 1rem;
}

.key-bindings-settings__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  padding: 0.9rem 1rem;
  border: 0.0625rem solid rgba(198, 255, 74, 0.12);
  background:
    linear-gradient(180deg, rgba(198, 255, 74, 0.04), transparent 88%),
    linear-gradient(180deg, rgba(13, 17, 16, 0.92), rgba(8, 10, 10, 0.94));
  box-shadow:
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.04),
    0 1rem 2rem rgba(0, 0, 0, 0.2);
}

.key-bindings-settings__status {
  margin: 0;
  color: rgba(186, 197, 178, 0.74);
}

.key-bindings-settings__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.65rem;
}

.key-bindings-settings__alert {
  margin-top: 0.1rem;
}

.key-bindings-settings__category {
  display: grid;
  gap: 0.9rem;
}

.key-bindings-settings__divider {
  margin-top: 0.2rem;
}

.key-bindings-settings__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem 0.85rem;
}

.key-bindings-settings__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(10.5rem, 12.75rem);
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 0.85rem;
  border: 0.0625rem solid rgba(198, 255, 74, 0.08);
  background:
    linear-gradient(180deg, rgba(18, 22, 21, 0.92), rgba(8, 11, 11, 0.94)),
    linear-gradient(90deg, rgba(198, 255, 74, 0.02), transparent 30%);
  box-shadow:
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.04),
    0 0.85rem 1.6rem rgba(0, 0, 0, 0.16);
}

.key-bindings-settings__row--pending {
  border-color: rgba(255, 197, 58, 0.28);
  background:
    linear-gradient(180deg, rgba(35, 29, 15, 0.94), rgba(11, 9, 7, 0.95)),
    linear-gradient(90deg, rgba(255, 197, 58, 0.08), transparent 34%);
  box-shadow:
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.05),
    inset 0 0 0 0.0625rem rgba(255, 197, 58, 0.08),
    0 0.85rem 1.6rem rgba(0, 0, 0, 0.16);
}

.key-bindings-settings__binding-name {
  margin: 0;
  color: rgba(244, 248, 236, 0.98);
  font-size: 0.92rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.2;
}

.key-bindings-settings__binding-copy {
  display: grid;
  gap: 0.28rem;
}

.key-bindings-settings__binding-warning {
  margin: 0;
  color: rgba(255, 219, 134, 0.84);
  font-size: 0.75rem;
  line-height: 1.35;
}

.key-bindings-settings__modal-copy {
  display: grid;
  gap: 0.75rem;
}

.key-bindings-settings__modal-copy :deep(p) {
  margin: 0;
}

.key-bindings-settings__modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (max-width: 56rem) {
  .key-bindings-settings__list {
    grid-template-columns: 1fr;
  }

  .key-bindings-settings__row {
    grid-template-columns: 1fr;
    align-items: start;
  }
}

@media (max-width: 48rem) {
  .key-bindings-settings__toolbar {
    align-items: stretch;
  }

  .key-bindings-settings__actions {
    justify-content: stretch;
    width: 100%;
  }

  .key-bindings-settings__actions :deep(.gbutton) {
    flex: 1 1 10rem;
  }

  .key-bindings-settings__modal-actions {
    flex-direction: column;
  }
}
</style>
