<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import type { GComboOption } from '@/components/g/GCombo/GCombo'
import {
  RequestGetCurrentCulture,
  RequestGetSupportedCultures,
  RequestSetCulture,
  type ResponseCurrentCulture,
  type ResponseSupportedCultures,
} from '@/proto/gen/local'
import { MessageType } from '@/proto/gen/scp_webui'
import { getScpWebSocketClient } from '@/services'

const language = ref<string | number | null>(null)
const languageOptions = ref<GComboOption[]>([])

let unsubscribeCurrentCulture: (() => void) | null = null
let unsubscribeSupportedCultures: (() => void) | null = null
let unsubscribeCultureChanged: (() => void) | null = null
let unsubscribeState: (() => void) | null = null

function requestCultureSettings(): void {
  const client = getScpWebSocketClient()

  if (!client || client.connectionState !== 'open') {
    return
  }

  client.sendTypedMessage(
    MessageType.REQUEST_GET_SUPPORTED_CULTURES,
    { empty: 0 },
    RequestGetSupportedCultures,
  )
  client.sendTypedMessage(
    MessageType.REQUEST_GET_CURRENT_CULTURE,
    { empty: 0 },
    RequestGetCurrentCulture,
  )
}

function applySupportedCultures(message: ResponseSupportedCultures): void {
  languageOptions.value = message.cultures.map((culture) => ({
    value: culture.code,
    label: culture.name,
  }))
}

function applyCurrentCulture(message: ResponseCurrentCulture): void {
  language.value = message.cultureCode
}

function applyCultureChange(value: string | number | null): void {
  if (typeof value !== 'string') {
    return
  }

  const client = getScpWebSocketClient()
  if (!client || client.connectionState !== 'open') {
    return
  }

  client.sendTypedMessage(MessageType.REQUEST_SET_CULTURE, { code: value }, RequestSetCulture)
}

onMounted(() => {
  const client = getScpWebSocketClient()

  if (!client) {
    return
  }

  unsubscribeSupportedCultures = client.onTypedMessage(
    MessageType.RESPONSE_SUPPORTED_CULTURES,
    applySupportedCultures,
  )
  unsubscribeCurrentCulture = client.onTypedMessage(
    MessageType.RESPONSE_CURRENT_CULTURE,
    applyCurrentCulture,
  )
  unsubscribeCultureChanged = client.onTypedMessage(MessageType.MESSAGE_CULTURE_CHANGED, (message) => {
    if (message.payload) {
      language.value = message.payload.code
    }
  })
  unsubscribeState = client.onStateChange((state) => {
    if (state === 'open') {
      requestCultureSettings()
    }
  })

  requestCultureSettings()
})

onUnmounted(() => {
  unsubscribeCurrentCulture?.()
  unsubscribeSupportedCultures?.()
  unsubscribeCultureChanged?.()
  unsubscribeState?.()
})
</script>

<template>
  <section class="settings-tab-view" aria-label="Gameplay settings">
    <h1 class="settings-tab-view__title">Gameplay</h1>

    <GField label="Language" width="full" class="settings-tab-view__language-field">
      <GCombo
        v-model="language"
        :options="languageOptions"
        width="full"
        preset="quiet"
        aria-label="Language"
        @change="applyCultureChange"
      />
    </GField>
  </section>
</template>

<style scoped>
.settings-tab-view {
  display: grid;
  align-content: start;
  min-height: 100%;
}

.settings-tab-view__title {
  margin: 0;
  color: rgba(240, 244, 238, 0.96);
  font-family: var(--ui-body-font);
  font-size: clamp(1.9rem, 3vw, 2.5rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-shadow: 0 0 1.2rem rgba(198, 255, 74, 0.12);
}

.settings-tab-view__language-field {
  margin-top: 2rem;
  max-width: 28rem;
}
</style>
