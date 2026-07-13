<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { createScpWebSocketClient, getScpWebSocketClient } from '@/services'
import { MessageType, PingMessage } from '@/proto/gen/scp_webui'

type DebugLogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

type DebugLogEntry = {
  id: number
  level: DebugLogLevel
  text: string
  timestamp: string
}

type ConsoleMethodName = 'log' | 'info' | 'warn' | 'error' | 'debug'

const isDebugPanelOpen = ref(false)
const debugHost = ref('localhost:18181')
const debugLogs = ref<DebugLogEntry[]>([])
const debugWindowWidth = ref(36)
const debugWindowHeight = ref(28)
const debugWindowShellRef = ref<HTMLElement | null>(null)
const debugLogViewportRef = ref<HTMLElement | null>(null)
const activePacketTab = ref('ping')
const pingCode = ref('1')
let nextDebugLogId = 1
let restoreConsole: (() => void) | null = null
let debugResizeObserver: ResizeObserver | null = null

const socketStateLabel = computed(() => getScpWebSocketClient()?.connectionState ?? 'idle')
const packetTabs = [
  {
    value: 'ping',
    label: 'Ping',
    description: 'Send a heartbeat packet.',
  },
] as const

function toggleDebugPanel(): void {
  if (isDebugPanelOpen.value) {
    onDebugPanelClose()
  }

  isDebugPanelOpen.value = !isDebugPanelOpen.value

  if (isDebugPanelOpen.value) {
    requestAnimationFrame(() => {
      onDebugPanelOpen()
    })
  }
}

function connectDebugSocket(): void {
  createScpWebSocketClient(debugHost.value)
}

function sendPingPacket(): void {
  const client = getScpWebSocketClient()
  if (!client) {
    console.warn('[scp-websocket] cannot send ping before socket creation')
    return
  }

  const code = Number.parseInt(pingCode.value, 10)

  client.sendTypedMessage(
    MessageType.MESSAGE_PING,
    {
      clientTimeMs: Date.now().toString(),
      code: Number.isFinite(code) ? code : 0,
    },
    PingMessage,
  )

  console.info('[scp-websocket] ping sent', {
    clientTimeMs: Date.now().toString(),
    code: Number.isFinite(code) ? code : 0,
  })
}

function pushDebugLog(level: DebugLogLevel, args: unknown[]): void {
  const entry: DebugLogEntry = {
    id: nextDebugLogId++,
    level,
    text: args.map((arg) => formatConsoleArg(arg)).join(' '),
    timestamp: new Date().toLocaleTimeString(),
  }

  debugLogs.value = [...debugLogs.value.slice(-199), entry]
}

function formatConsoleArg(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (value instanceof Error) {
    return value.stack ?? value.message
  }

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function installConsoleCapture(): () => void {
  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
  }

  const methods: ConsoleMethodName[] = ['log', 'info', 'warn', 'error', 'debug']

  for (const method of methods) {
    console[method] = (...args: unknown[]) => {
      pushDebugLog(method, args)
      originalConsole[method](...args)
    }
  }

  return () => {
    console.log = originalConsole.log
    console.info = originalConsole.info
    console.warn = originalConsole.warn
    console.error = originalConsole.error
    console.debug = originalConsole.debug
  }
}

function syncDebugWindowSize(element: HTMLElement | null): void {
  if (!element) {
    return
  }

  debugWindowWidth.value = element.offsetWidth / 16
  debugWindowHeight.value = element.offsetHeight / 16
}

onMounted(() => {
  restoreConsole = installConsoleCapture()
  pushDebugLog('info', ['Debug console ready.'])

  if (typeof ResizeObserver !== 'undefined') {
    debugResizeObserver = new ResizeObserver(() => {
      syncDebugWindowSize(debugWindowShellRef.value)
    })
  }
})

onBeforeUnmount(() => {
  restoreConsole?.()
  restoreConsole = null
  debugResizeObserver?.disconnect()
  debugResizeObserver = null
})

watch(
  () => debugLogs.value.length,
  async () => {
    await nextTick()

    const viewport = debugLogViewportRef.value
    if (!viewport) {
      return
    }

    viewport.scrollTop = viewport.scrollHeight
  },
)

function onDebugPanelOpen(): void {
  syncDebugWindowSize(debugWindowShellRef.value)

  if (debugResizeObserver && debugWindowShellRef.value) {
    debugResizeObserver.disconnect()
    debugResizeObserver.observe(debugWindowShellRef.value)
  }
}

function onDebugPanelClose(): void {
  debugResizeObserver?.disconnect()
}
</script>

<template>
  <div class="debug-overlay">
    <GButton
      class="debug-overlay__toggle"
      preset="warning"
      shape="chip"
      background
      @click="toggleDebugPanel"
    >
      Debug
    </GButton>

    <div
      v-if="isDebugPanelOpen"
      ref="debugWindowShellRef"
      class="debug-overlay__window-shell"
      :style="{
        width: `${debugWindowWidth}rem`,
        height: `${debugWindowHeight}rem`,
      }"
    >
      <GWindow
        class="debug-overlay__window"
        title="Runtime Debug"
        subtitle="Socket setup and browser console output."
        status="Overlay"
        strong
        closable
        width="full"
        height="full"
        @close="
          () => {
            onDebugPanelClose()
            toggleDebugPanel()
          }
        "
      >
        <div class="debug-overlay__content">
          <div class="debug-overlay__controls">
            <GInput
              v-model="debugHost"
              label="Host"
              helper="Unreal can override this through window.create_socket(host)."
              width="full"
              background
            />

            <div class="debug-overlay__actions">
              <GButton preset="accent" background @click="connectDebugSocket">Connect</GButton>
              <GText preset="technical" class="debug-overlay__status">
                socket_state = {{ socketStateLabel }}
              </GText>
            </div>
          </div>

          <div class="debug-overlay__packet-frame">
            <GText preset="caps">Packets</GText>

            <GTabs
              v-model="activePacketTab"
              :tabs="packetTabs"
              preset="quiet"
              width="full"
              background
              aria-label="Debug packet tabs"
            >
              <template #default>
                <div v-if="activePacketTab === 'ping'" class="debug-overlay__packet-panel">
                  <div class="debug-overlay__packet-fields">
                    <GInput
                      v-model="pingCode"
                      label="Ping Code"
                      helper="Uint32 test value for MESSAGE_PING."
                      type="number"
                      min="0"
                      width="full"
                      background
                    />
                  </div>

                  <div class="debug-overlay__packet-actions">
                    <GButton preset="accent" background @click="sendPingPacket">Send Ping</GButton>
                    <GText preset="technical">message_type = MESSAGE_PING</GText>
                  </div>
                </div>
              </template>
            </GTabs>
          </div>

          <div class="debug-overlay__log-frame">
            <GText preset="caps">Browser Console</GText>

            <div ref="debugLogViewportRef" class="debug-overlay__log-scroller">
              <div class="debug-overlay__log-list">
                <div
                  v-for="entry in debugLogs"
                  :key="entry.id"
                  class="debug-overlay__log-entry"
                  :class="`debug-overlay__log-entry--${entry.level}`"
                >
                  <GText preset="technical" class="debug-overlay__log-line">
                    [{{ entry.timestamp }}] {{ entry.level.toUpperCase() }} {{ entry.text }}
                  </GText>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GWindow>
    </div>
  </div>
</template>

<style scoped>
.debug-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 5000;
}

.debug-overlay__toggle {
  position: absolute;
  top: 1rem;
  left: 1rem;
  pointer-events: auto;
}

.debug-overlay__window-shell {
  position: absolute;
  top: 50%;
  left: 1rem;
  min-width: 24rem;
  min-height: 18rem;
  max-width: min(90vw, 56rem);
  max-height: 85vh;
  transform: translateY(-50%);
  pointer-events: auto;
  resize: both;
  overflow: hidden;
}

.debug-overlay__window {
  width: 100%;
  height: 100%;
  background:
    linear-gradient(180deg, rgba(15, 20, 18, 0.96), rgba(5, 8, 8, 0.98)),
    radial-gradient(circle at top left, rgba(198, 255, 74, 0.08), transparent 35%);
}

.debug-overlay__window :deep(.gwindow__body) {
  height: 100%;
  min-height: 0;
}

.debug-overlay__content {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 1rem;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.debug-overlay__controls {
  display: grid;
  gap: 0.875rem;
}

.debug-overlay__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.debug-overlay__status {
  opacity: 0.82;
}

.debug-overlay__packet-frame {
  display: grid;
  gap: 0.5rem;
  min-height: 0;
}

.debug-overlay__packet-panel {
  display: grid;
  gap: 0.75rem;
}

.debug-overlay__packet-fields {
  display: grid;
  gap: 0.75rem;
}

.debug-overlay__packet-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.debug-overlay__log-frame {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 0.5rem;
  min-height: 0;
  overflow: hidden;
}

.debug-overlay__log-scroller {
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  border: 0.0625rem solid rgba(210, 226, 214, 0.12);
  border-radius: 0.5rem;
  background: rgba(3, 6, 7, 0.72);
  scrollbar-width: thin;
  scrollbar-color: rgba(198, 255, 74, 0.45) rgba(255, 255, 255, 0.04);
  overscroll-behavior: contain;
}

.debug-overlay__log-scroller::-webkit-scrollbar {
  width: 0.625rem;
}

.debug-overlay__log-scroller::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
}

.debug-overlay__log-scroller::-webkit-scrollbar-thumb {
  background: rgba(198, 255, 74, 0.35);
  border-radius: 62.4375rem;
}

.debug-overlay__log-list {
  display: grid;
  align-content: start;
  gap: 0.25rem;
  padding: 0.5rem;
}

.debug-overlay__log-entry {
  padding: 0.3125rem 0.5rem;
  border-left: 0.125rem solid rgba(192, 205, 198, 0.22);
  background: rgba(255, 255, 255, 0.018);
  border-radius: 0.25rem;
}

.debug-overlay__log-entry--info {
  border-left-color: rgba(123, 198, 255, 0.72);
}

.debug-overlay__log-entry--warn {
  border-left-color: rgba(255, 210, 107, 0.9);
}

.debug-overlay__log-entry--error {
  border-left-color: rgba(255, 118, 118, 0.92);
}

.debug-overlay__log-entry--debug {
  border-left-color: rgba(198, 255, 74, 0.72);
}

.debug-overlay__log-line {
  display: block;
  font-size: 0.75rem;
  line-height: 1.25;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
