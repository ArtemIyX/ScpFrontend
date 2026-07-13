<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { createScpWebSocketClient, getScpWebSocketClient } from '@/services'

type DebugLogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

type DebugLogEntry = {
  id: number
  level: DebugLogLevel
  text: string
  timestamp: string
}

type ConsoleMethodName = 'log' | 'info' | 'warn' | 'error' | 'debug'

const isDebugPanelOpen = ref(false)
const debugHost = ref('localhost')
const debugLogs = ref<DebugLogEntry[]>([])
const debugWindowWidth = ref(36)
const debugWindowHeight = ref(28)
let nextDebugLogId = 1
let restoreConsole: (() => void) | null = null

const socketStateLabel = computed(() => getScpWebSocketClient()?.connectionState ?? 'idle')

function toggleDebugPanel(): void {
  isDebugPanelOpen.value = !isDebugPanelOpen.value
}

function connectDebugSocket(): void {
  createScpWebSocketClient(debugHost.value)
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

function onDebugWindowResize(event: Event): void {
  const element = event.target as HTMLElement | null
  if (!element) {
    return
  }

  debugWindowWidth.value = element.offsetWidth / 16
  debugWindowHeight.value = element.offsetHeight / 16
}

onMounted(() => {
  restoreConsole = installConsoleCapture()
  pushDebugLog('info', ['Debug console ready.'])
})

onBeforeUnmount(() => {
  restoreConsole?.()
  restoreConsole = null
})
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
      class="debug-overlay__window-shell"
      :style="{
        width: `${debugWindowWidth}rem`,
        height: `${debugWindowHeight}rem`,
      }"
      @mouseup="onDebugWindowResize"
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
        @close="toggleDebugPanel"
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

          <div class="debug-overlay__log-frame">
            <GText preset="caps">Browser Console</GText>

            <GScroller class="debug-overlay__log-scroller">
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
            </GScroller>
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
  grid-template-rows: auto 1fr;
  gap: 1rem;
  height: 100%;
  min-height: 0;
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

.debug-overlay__log-frame {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0.75rem;
  min-height: 0;
}

.debug-overlay__log-scroller {
  height: 100%;
  min-height: 0;
  border: 0.0625rem solid rgba(210, 226, 214, 0.12);
  border-radius: 0.5rem;
  background: rgba(3, 6, 7, 0.72);
}

.debug-overlay__log-list {
  display: grid;
  gap: 0.5rem;
  padding: 0.875rem;
}

.debug-overlay__log-entry {
  padding: 0.5rem 0.625rem;
  border-left: 0.1875rem solid rgba(192, 205, 198, 0.22);
  background: rgba(255, 255, 255, 0.02);
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
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
