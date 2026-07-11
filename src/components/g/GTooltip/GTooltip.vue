<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch, type CSSProperties } from 'vue'

import GText from '../GText/GText.vue'
import { buildGTooltipClasses, type GTooltipProps } from './GTooltip'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GTooltipProps>(), {
  preset: 'quiet',
  size: 'md',
  placement: 'top',
  disabled: false,
  delay: 1200,
})

const slots = useSlots()
const isVisible = ref(false)
const timer = ref<number | null>(null)
const anchorRef = ref<HTMLElement | null>(null)
const panelStyle = ref<CSSProperties>({})
const PX_PER_REM = 16

const classes = computed(() =>
  buildGTooltipClasses({
    preset: props.preset,
    size: props.size,
    placement: props.placement,
    disabled: props.disabled,
    visible: isVisible.value,
  }),
)

function clearTimer(): void {
  if (timer.value !== null) {
    window.clearTimeout(timer.value)
    timer.value = null
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function toRem(value: number): string {
  return `${value / PX_PER_REM}rem`
}

function updatePosition(): void {
  if (!isVisible.value || typeof window === 'undefined' || !anchorRef.value) {
    return
  }

  const anchorRect = anchorRef.value.getBoundingClientRect()
  const tooltipRect = panelRef.value?.getBoundingClientRect()
  const viewportPadding = 10
  const gap = 10
  const tooltipWidth = tooltipRect?.width ?? 384
  const tooltipHeight = tooltipRect?.height ?? 96
  const centerX = clamp(anchorRect.left + anchorRect.width / 2, viewportPadding, window.innerWidth - viewportPadding)

  let top = anchorRect.top - gap
  let transform = 'translate(-50%, -100%)'

  if (props.placement === 'bottom') {
    top = anchorRect.bottom + gap
    transform = 'translateX(-50%)'
  } else if (props.placement === 'left') {
    top = anchorRect.top + anchorRect.height / 2
    panelStyle.value = {
      position: 'fixed',
      top: toRem(clamp(top, viewportPadding, window.innerHeight - viewportPadding)),
      left: toRem(Math.max(viewportPadding, anchorRect.left - gap)),
      transform: 'translate(-100%, -50%)',
    }
    return
  } else if (props.placement === 'right') {
    top = anchorRect.top + anchorRect.height / 2
    panelStyle.value = {
      position: 'fixed',
      top: toRem(clamp(top, viewportPadding, window.innerHeight - viewportPadding)),
      left: toRem(Math.min(window.innerWidth - viewportPadding, anchorRect.right + gap)),
      transform: 'translateY(-50%)',
    }
    return
  }

  const preferredTop = anchorRect.top - gap - tooltipHeight
  const preferredBottom = anchorRect.bottom + gap + tooltipHeight
  const fitsAbove = preferredTop >= viewportPadding
  const fitsBelow = preferredBottom <= window.innerHeight - viewportPadding

  if (props.placement === 'bottom') {
    top = fitsBelow ? anchorRect.bottom + gap : anchorRect.top - gap
    transform = fitsBelow ? 'translateX(-50%)' : 'translate(-50%, -100%)'
  } else if (fitsAbove || !fitsBelow) {
    top = anchorRect.top - gap
    transform = 'translate(-50%, -100%)'
  } else {
    top = anchorRect.bottom + gap
    transform = 'translateX(-50%)'
  }

  const widthSafeHalf = tooltipWidth / 2
  const left = clamp(centerX, viewportPadding + widthSafeHalf, window.innerWidth - viewportPadding - widthSafeHalf)

  panelStyle.value = {
    position: 'fixed',
    top: toRem(clamp(top, viewportPadding, window.innerHeight - viewportPadding)),
    left: toRem(left),
    transform,
  }
}

function show(): void {
  if (props.disabled) {
    return
  }

  clearTimer()
  timer.value = window.setTimeout(() => {
    isVisible.value = true
    timer.value = null
    void nextTick(() => {
      updatePosition()
    })
  }, props.delay)
}

function hide(): void {
  clearTimer()
  isVisible.value = false
  panelStyle.value = {}
}

onBeforeUnmount(() => {
  clearTimer()
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
  }
})

onMounted(() => {
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
})

watch(
  () => props.disabled,
  () => {
    if (props.disabled) {
      hide()
    }
  },
)

const panelRef = ref<HTMLElement | null>(null)
</script>

<template>
  <span
    ref="anchorRef"
    class="gtooltip__anchor"
    :aria-label="ariaLabel"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />

    <Teleport to="body">
      <transition name="gtooltip-fade">
        <span v-if="!disabled && isVisible" ref="panelRef" :class="classes" :style="panelStyle" role="tooltip">
          <GText as="span" preset="body" class="gtooltip__text">
            <slot name="content">{{ text }}</slot>
          </GText>
        </span>
      </transition>
    </Teleport>
  </span>
</template>

<style scoped src="./GTooltip.css"></style>
