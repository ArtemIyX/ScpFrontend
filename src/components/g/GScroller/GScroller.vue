<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

import { type GScrollerProps } from './GScroller'

const props = withDefaults(defineProps<GScrollerProps>(), {
  direction: 'vertical',
  track: true,
})

const viewportRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const thumbRef = ref<HTMLElement | null>(null)

const scrollTop = ref(0)
const viewportHeight = ref(0)
const contentHeight = ref(0)
const dragging = ref(false)
const dragStartY = ref(0)
const dragStartScroll = ref(0)
let resizeObserver: ResizeObserver | null = null

const maxScroll = computed(() => Math.max(0, contentHeight.value - viewportHeight.value))
const thumbHeight = computed(() => {
  if (maxScroll.value <= 0) {
    return 0
  }

  const ratio = viewportHeight.value / contentHeight.value
  return Math.max(32, Math.round((trackHeight.value || viewportHeight.value) * ratio))
})

const thumbOffset = computed(() => {
  if (maxScroll.value <= 0) {
    return 0
  }

  const trackSpace = Math.max(0, (trackHeight.value || viewportHeight.value) - thumbHeight.value)
  return Math.round((scrollTop.value / maxScroll.value) * trackSpace)
})

const trackHeight = computed(() => {
  const track = trackRef.value
  return track?.clientHeight ?? 0
})

function clampScroll(value: number): number {
  return Math.min(maxScroll.value, Math.max(0, value))
}

function syncMeasurements(): void {
  const viewport = viewportRef.value
  const content = contentRef.value

  if (!viewport || !content) {
    return
  }

  viewportHeight.value = viewport.clientHeight
  contentHeight.value = content.scrollHeight
  scrollTop.value = clampScroll(scrollTop.value)
}

function applyScroll(value: number): void {
  const viewport = viewportRef.value
  const nextScroll = clampScroll(value)

  scrollTop.value = nextScroll
  if (viewport) {
    viewport.scrollTop = nextScroll
  }
}

function onScroll(): void {
  const viewport = viewportRef.value
  if (!viewport) {
    return
  }

  scrollTop.value = viewport.scrollTop
}

function onWheel(event: WheelEvent): void {
  if (props.direction !== 'vertical') {
    return
  }

  if (maxScroll.value <= 0) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  applyScroll(scrollTop.value + event.deltaY)
}

function startDrag(event: PointerEvent): void {
  if (maxScroll.value <= 0) {
    return
  }

  dragging.value = true
  dragStartY.value = event.clientY
  dragStartScroll.value = scrollTop.value
  thumbRef.value?.setPointerCapture(event.pointerId)
}

function onDrag(event: PointerEvent): void {
  if (!dragging.value) {
    return
  }

  event.preventDefault()
  const trackSpace = Math.max(1, (trackHeight.value || viewportHeight.value) - thumbHeight.value)
  const delta = event.clientY - dragStartY.value
  const ratio = maxScroll.value / trackSpace
  applyScroll(dragStartScroll.value + delta * ratio)
}

function stopDrag(event?: PointerEvent): void {
  if (!dragging.value) {
    return
  }

  dragging.value = false

  if (event && thumbRef.value?.hasPointerCapture(event.pointerId)) {
    thumbRef.value.releasePointerCapture(event.pointerId)
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (maxScroll.value <= 0) {
    return
  }

  const page = Math.max(64, Math.round(viewportHeight.value * 0.85))

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      applyScroll(scrollTop.value + 48)
      break
    case 'ArrowUp':
      event.preventDefault()
      applyScroll(scrollTop.value - 48)
      break
    case 'PageDown':
      event.preventDefault()
      applyScroll(scrollTop.value + page)
      break
    case 'PageUp':
      event.preventDefault()
      applyScroll(scrollTop.value - page)
      break
    case 'Home':
      event.preventDefault()
      applyScroll(0)
      break
    case 'End':
      event.preventDefault()
      applyScroll(maxScroll.value)
      break
  }
}

onMounted(() => {
  void nextTick(() => {
    syncMeasurements()
  })
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => syncMeasurements())
    if (viewportRef.value) {
      resizeObserver.observe(viewportRef.value)
    }
    if (contentRef.value) {
      resizeObserver.observe(contentRef.value)
    }
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})
</script>

<template>
  <div
    class="gscroller"
    :class="{ 'gscroller--no-track': !track }"
    tabindex="0"
    @wheel="onWheel"
    @keydown="onKeydown"
  >
    <div ref="viewportRef" class="gscroller__viewport" @scroll="onScroll">
      <div ref="contentRef" class="gscroller__content">
        <slot />
      </div>
    </div>

    <div v-if="track && maxScroll > 0" ref="trackRef" class="gscroller__track">
      <div
        ref="thumbRef"
        class="gscroller__thumb"
        :style="{ height: `${thumbHeight}px`, transform: `translate3d(0, ${thumbOffset}px, 0)` }"
        @pointerdown="startDrag"
        @pointermove="onDrag"
        @pointerup="stopDrag"
        @pointercancel="stopDrag"
        @lostpointercapture="stopDrag"
      ></div>
    </div>
  </div>
</template>

<style scoped src="./GScroller.css"></style>
