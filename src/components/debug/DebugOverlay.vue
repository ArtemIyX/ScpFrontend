<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import {
  messageTypeName,
  onScpWebSocketPacket,
  onScpWebSocketRuntimeState,
  type ScpPacketEvent,
  type ScpWebSocketRuntimeSnapshot,
} from '@/services'

import {
  expectedResponseType,
  removeMatchingWaitingEntry,
  type DebugWaitingEntry,
} from './debugpackets'

type DebugPacketEntry = {
  id: number
  messageTypeName: string
  timestamp: number
}

type ScrollFollowState = {
  value: boolean
}

const MAX_PACKET_ENTRIES = 500
const isDebugPanelOpen = ref(false)
const sentPackets = ref<DebugPacketEntry[]>([])
const receivedPackets = ref<DebugPacketEntry[]>([])
const waitingPackets = ref<DebugWaitingEntry[]>([])
const runtimeSnapshot = ref<ScpWebSocketRuntimeSnapshot>({
  socketUrl: null,
  connectionState: 'idle',
})
const windowShellRef = ref<HTMLElement | null>(null)
const sentViewportRef = ref<HTMLElement | null>(null)
const receivedViewportRef = ref<HTMLElement | null>(null)
const waitingViewportRef = ref<HTMLElement | null>(null)
const windowPosition = ref({ left: 16, top: 72 })
const sentFollow = ref(true)
const receivedFollow = ref(true)
const waitingFollow = ref(true)

let nextEntryId = 1
let unsubscribePacketEvents: (() => void) | null = null
let unsubscribeRuntimeState: (() => void) | null = null
let dragState: {
  pointerId: number
  startX: number
  startY: number
  startLeft: number
  startTop: number
} | null = null

const socketEndpoint = computed(() => {
  const url = runtimeSnapshot.value.socketUrl
  if (!url) {
    return { host: '—', port: '—' }
  }

  try {
    const parsed = new URL(url)
    return {
      host: parsed.hostname || '—',
      port: parsed.port || 'default',
    }
  } catch {
    return { host: url, port: '—' }
  }
})

const socketState = computed(() => {
  switch (runtimeSnapshot.value.connectionState) {
    case 'connecting':
      return { label: 'Connecting', color: 'yellow' }
    case 'open':
      return { label: 'Connected', color: 'green' }
    case 'closed':
      return { label: 'Disconnected', color: 'red' }
    case 'idle':
    default:
      return { label: 'Not connected', color: 'gray' }
  }
})

function appendPacketEntry(target: typeof sentPackets, event: ScpPacketEvent): void {
  target.value = [
    ...target.value.slice(-(MAX_PACKET_ENTRIES - 1)),
    {
      id: nextEntryId++,
      messageTypeName: event.messageTypeName,
      timestamp: event.timestamp,
    },
  ]
}

function handlePacket(event: ScpPacketEvent): void {
  if (event.direction === 'sent') {
    appendPacketEntry(sentPackets, event)

    const responseType = expectedResponseType(event.messageType)
    if (responseType !== null) {
      waitingPackets.value = [
        ...waitingPackets.value,
        {
          id: nextEntryId++,
          requestTypeName: event.messageTypeName,
          responseType,
          responseTypeName: messageTypeName(responseType),
          timestamp: event.timestamp,
        },
      ].slice(-MAX_PACKET_ENTRIES)
    }

    return
  }

  appendPacketEntry(receivedPackets, event)
  waitingPackets.value = removeMatchingWaitingEntry(waitingPackets.value, event.messageType)
}

function clearPacketLog(): void {
  sentPackets.value = []
  receivedPackets.value = []
  waitingPackets.value = []
}

function toggleDebugPanel(): void {
  isDebugPanelOpen.value = !isDebugPanelOpen.value
  if (isDebugPanelOpen.value) {
    requestAnimationFrame(clampWindowPosition)
  }
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum))
}

function clampWindowPosition(): void {
  const shell = windowShellRef.value
  if (!shell) {
    return
  }

  windowPosition.value = {
    left: clamp(windowPosition.value.left, 0, window.innerWidth - shell.offsetWidth),
    top: clamp(windowPosition.value.top, 0, window.innerHeight - shell.offsetHeight),
  }
}

function onWindowPointerDown(event: PointerEvent): void {
  const target = event.target
  if (!(target instanceof Element)) {
    return
  }

  if (!target.closest('.gwindow__header') || target.closest('button, input, textarea, select')) {
    return
  }

  dragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startLeft: windowPosition.value.left,
    startTop: windowPosition.value.top,
  }

  document.body.style.userSelect = 'none'
  window.addEventListener('pointermove', onWindowPointerMove)
  window.addEventListener('pointerup', stopWindowDrag)
  window.addEventListener('pointercancel', stopWindowDrag)
}

function onWindowPointerMove(event: PointerEvent): void {
  if (!dragState || event.pointerId !== dragState.pointerId) {
    return
  }

  const shell = windowShellRef.value
  if (!shell) {
    return
  }

  event.preventDefault()
  windowPosition.value = {
    left: clamp(
      dragState.startLeft + event.clientX - dragState.startX,
      0,
      window.innerWidth - shell.offsetWidth,
    ),
    top: clamp(
      dragState.startTop + event.clientY - dragState.startY,
      0,
      window.innerHeight - shell.offsetHeight,
    ),
  }
}

function stopWindowDrag(): void {
  dragState = null
  document.body.style.userSelect = ''
  window.removeEventListener('pointermove', onWindowPointerMove)
  window.removeEventListener('pointerup', stopWindowDrag)
  window.removeEventListener('pointercancel', stopWindowDrag)
}

function updateFollowState(viewport: HTMLElement, followState: ScrollFollowState): void {
  followState.value = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 32
}

function onSentScroll(event: Event): void {
  if (event.currentTarget instanceof HTMLElement) {
    updateFollowState(event.currentTarget, sentFollow)
  }
}

function onReceivedScroll(event: Event): void {
  if (event.currentTarget instanceof HTMLElement) {
    updateFollowState(event.currentTarget, receivedFollow)
  }
}

function onWaitingScroll(event: Event): void {
  if (event.currentTarget instanceof HTMLElement) {
    updateFollowState(event.currentTarget, waitingFollow)
  }
}

function scrollToBottom(viewport: HTMLElement | null, followState: ScrollFollowState): void {
  if (viewport && followState.value) {
    viewport.scrollTop = viewport.scrollHeight
  }
}

async function updateLogScrollPositions(): Promise<void> {
  await nextTick()
  scrollToBottom(sentViewportRef.value, sentFollow)
  scrollToBottom(receivedViewportRef.value, receivedFollow)
  scrollToBottom(waitingViewportRef.value, waitingFollow)
}

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString()
}

onMounted(() => {
  unsubscribePacketEvents = onScpWebSocketPacket(handlePacket)
  unsubscribeRuntimeState = onScpWebSocketRuntimeState((snapshot) => {
    runtimeSnapshot.value = snapshot
    if (snapshot.connectionState === 'closed' || snapshot.connectionState === 'idle') {
      waitingPackets.value = []
    }
  })
  window.addEventListener('resize', clampWindowPosition)
})

onBeforeUnmount(() => {
  unsubscribePacketEvents?.()
  unsubscribeRuntimeState?.()
  window.removeEventListener('resize', clampWindowPosition)
  stopWindowDrag()
})

watch(
  [
    () => sentPackets.value.length,
    () => receivedPackets.value.length,
    () => waitingPackets.value.length,
  ],
  updateLogScrollPositions,
)
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
      ref="windowShellRef"
      class="debug-overlay__window-shell"
      :style="{
        left: `${windowPosition.left}px`,
        top: `${windowPosition.top}px`,
      }"
      @pointerdown="onWindowPointerDown"
    >
      <GWindow
        class="debug-overlay__window"
        title="Runtime Packet Monitor"
        subtitle="Live protobuf traffic and pending responses."
        :status="socketState.label"
        strong
        closable
        width="full"
        height="full"
        @close="toggleDebugPanel"
      >
        <div class="debug-overlay__content">
          <div class="debug-overlay__toolbar">
            <div class="debug-overlay__connection">
              <span
                class="debug-overlay__status-dot"
                :class="`debug-overlay__status-dot--${socketState.color}`"
                aria-hidden="true"
              ></span>
              <GText preset="technical">
                {{ socketState.label }}
              </GText>
              <GText preset="technical" class="debug-overlay__endpoint">
                host={{ socketEndpoint.host }} port={{ socketEndpoint.port }}
              </GText>
            </div>

            <GButton preset="ghost" shape="chip" background @click="clearPacketLog">
              Clear
            </GButton>
          </div>

          <div class="debug-overlay__packet-grid">
            <section class="debug-overlay__packet-column">
              <header class="debug-overlay__column-header">
                <GText preset="caps">Sent packets</GText>
                <GText preset="technical" class="debug-overlay__count">
                  {{ sentPackets.length }}
                </GText>
              </header>
              <div
                ref="sentViewportRef"
                class="debug-overlay__packet-scroller"
                @scroll="onSentScroll"
              >
                <div v-if="sentPackets.length === 0" class="debug-overlay__empty">
                  <GText preset="technical">No sent packets yet.</GText>
                </div>
                <div
                  v-for="entry in sentPackets"
                  :key="entry.id"
                  class="debug-overlay__packet-entry debug-overlay__packet-entry--sent"
                >
                  <GText preset="technical" class="debug-overlay__packet-name">
                    {{ entry.messageTypeName }}
                  </GText>
                  <GText preset="technical" class="debug-overlay__packet-time">
                    {{ formatTimestamp(entry.timestamp) }}
                  </GText>
                </div>
              </div>
            </section>

            <section class="debug-overlay__packet-column">
              <header class="debug-overlay__column-header">
                <GText preset="caps">Received packets</GText>
                <GText preset="technical" class="debug-overlay__count">
                  {{ receivedPackets.length }}
                </GText>
              </header>
              <div
                ref="receivedViewportRef"
                class="debug-overlay__packet-scroller"
                @scroll="onReceivedScroll"
              >
                <div v-if="receivedPackets.length === 0" class="debug-overlay__empty">
                  <GText preset="technical">No received packets yet.</GText>
                </div>
                <div
                  v-for="entry in receivedPackets"
                  :key="entry.id"
                  class="debug-overlay__packet-entry debug-overlay__packet-entry--received"
                >
                  <GText preset="technical" class="debug-overlay__packet-name">
                    {{ entry.messageTypeName }}
                  </GText>
                  <GText preset="technical" class="debug-overlay__packet-time">
                    {{ formatTimestamp(entry.timestamp) }}
                  </GText>
                </div>
              </div>
            </section>

            <section class="debug-overlay__packet-column">
              <header class="debug-overlay__column-header">
                <GText preset="caps">Waiting for</GText>
                <GText preset="technical" class="debug-overlay__count">
                  {{ waitingPackets.length }}
                </GText>
              </header>
              <div
                ref="waitingViewportRef"
                class="debug-overlay__packet-scroller"
                @scroll="onWaitingScroll"
              >
                <div v-if="waitingPackets.length === 0" class="debug-overlay__empty">
                  <GText preset="technical">Nothing waiting.</GText>
                </div>
                <div
                  v-for="entry in waitingPackets"
                  :key="entry.id"
                  class="debug-overlay__packet-entry debug-overlay__packet-entry--waiting"
                >
                  <GText preset="technical" class="debug-overlay__packet-name">
                    {{ entry.responseTypeName }}
                  </GText>
                  <GText preset="technical" class="debug-overlay__packet-detail">
                    after {{ entry.requestTypeName }}
                  </GText>
                  <GText preset="technical" class="debug-overlay__packet-time">
                    {{ formatTimestamp(entry.timestamp) }}
                  </GText>
                </div>
              </div>
            </section>
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
  width: min(78rem, calc(100vw - 2rem));
  height: min(42rem, calc(100vh - 2rem));
  min-width: 42rem;
  min-height: 22rem;
  max-width: calc(100vw - 1rem);
  max-height: calc(100vh - 1rem);
  overflow: hidden;
  resize: both;
  pointer-events: auto;
}

.debug-overlay__window {
  width: 100%;
  height: 100%;
  background:
    linear-gradient(180deg, rgba(15, 20, 18, 0.97), rgba(5, 8, 8, 0.99)),
    radial-gradient(circle at top left, rgba(198, 255, 74, 0.08), transparent 35%);
}

.debug-overlay__window :deep(.gwindow__header) {
  cursor: move;
  user-select: none;
}

.debug-overlay__window :deep(.gwindow__header button) {
  cursor: pointer;
}

.debug-overlay__window :deep(.gwindow__body) {
  display: grid;
  height: 100%;
  min-height: 0;
}

.debug-overlay__content {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 0.875rem;
  min-height: 0;
}

.debug-overlay__toolbar,
.debug-overlay__connection,
.debug-overlay__column-header {
  display: flex;
  align-items: center;
}

.debug-overlay__toolbar {
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
}

.debug-overlay__connection {
  min-width: 0;
  gap: 0.5rem;
}

.debug-overlay__endpoint {
  min-width: 0;
  overflow: hidden;
  color: rgba(210, 226, 214, 0.72);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.debug-overlay__status-dot {
  width: 0.7rem;
  height: 0.7rem;
  flex: 0 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.36);
  border-radius: 50%;
  box-shadow: 0 0 0.6rem currentColor;
}

.debug-overlay__status-dot--gray {
  color: rgba(155, 166, 160, 0.8);
  background: rgba(155, 166, 160, 0.8);
}

.debug-overlay__status-dot--yellow {
  color: rgba(255, 210, 107, 0.95);
  background: rgba(255, 210, 107, 0.95);
}

.debug-overlay__status-dot--green {
  color: rgba(154, 238, 104, 0.98);
  background: rgba(154, 238, 104, 0.98);
}

.debug-overlay__status-dot--red {
  color: rgba(255, 118, 118, 0.98);
  background: rgba(255, 118, 118, 0.98);
}

.debug-overlay__packet-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  min-height: 0;
}

.debug-overlay__packet-column {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 0.5rem;
  min-width: 0;
  min-height: 0;
  padding: 0.625rem;
  border: 1px solid rgba(210, 226, 214, 0.12);
  border-radius: 0.5rem;
  background: rgba(3, 6, 7, 0.58);
}

.debug-overlay__column-header {
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0 0.125rem;
}

.debug-overlay__count {
  color: rgba(210, 226, 214, 0.58);
}

.debug-overlay__packet-scroller {
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-color: rgba(198, 255, 74, 0.45) rgba(255, 255, 255, 0.04);
  scrollbar-width: thin;
}

.debug-overlay__packet-scroller::-webkit-scrollbar {
  width: 0.5rem;
}

.debug-overlay__packet-scroller::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
}

.debug-overlay__packet-scroller::-webkit-scrollbar-thumb {
  background: rgba(198, 255, 74, 0.35);
  border-radius: 62.4375rem;
}

.debug-overlay__empty {
  display: grid;
  min-height: 100%;
  place-items: center;
  padding: 1rem;
  color: rgba(210, 226, 214, 0.5);
  text-align: center;
}

.debug-overlay__packet-entry {
  display: grid;
  gap: 0.2rem;
  margin-bottom: 0.25rem;
  padding: 0.45rem 0.5rem;
  border-left: 0.125rem solid rgba(192, 205, 198, 0.22);
  border-radius: 0.25rem;
  background: rgba(255, 255, 255, 0.018);
}

.debug-overlay__packet-entry--sent {
  border-left-color: rgba(123, 198, 255, 0.8);
}

.debug-overlay__packet-entry--received {
  border-left-color: rgba(154, 238, 104, 0.82);
}

.debug-overlay__packet-entry--waiting {
  border-left-color: rgba(255, 210, 107, 0.9);
}

.debug-overlay__packet-name {
  overflow-wrap: anywhere;
  color: rgba(240, 244, 238, 0.96);
}

.debug-overlay__packet-detail,
.debug-overlay__packet-time {
  color: rgba(210, 226, 214, 0.56);
  font-size: 0.7rem;
}

@media (max-width: 56rem) {
  .debug-overlay__window-shell {
    min-width: 30rem;
  }

  .debug-overlay__packet-grid {
    grid-template-columns: repeat(3, minmax(10rem, 1fr));
    overflow-x: auto;
  }
}
</style>
