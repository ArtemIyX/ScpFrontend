<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useSlots, watch } from 'vue'

import GText from '../GText/GText.vue'
import { buildGTooltipClasses, type GTooltipProps } from './GTooltip'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GTooltipProps>(), {
  preset: 'quiet',
  size: 'md',
  placement: 'top',
  disabled: false,
  delay: 120,
})

const slots = useSlots()
const isVisible = ref(false)
const timer = ref<number | null>(null)

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

function show(): void {
  if (props.disabled) {
    return
  }

  clearTimer()
  timer.value = window.setTimeout(() => {
    isVisible.value = true
    timer.value = null
  }, props.delay)
}

function hide(): void {
  clearTimer()
  isVisible.value = false
}

onBeforeUnmount(() => {
  clearTimer()
})

watch(
  () => props.disabled,
  () => {
    if (props.disabled) {
      hide()
    }
  },
)
</script>

<template>
  <span
    class="gtooltip__anchor"
    :aria-label="ariaLabel"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />

    <transition name="gtooltip-fade">
      <span v-if="!disabled && isVisible" :class="classes" role="tooltip">
        <GText as="span" preset="body" class="gtooltip__text">
          <slot name="content">{{ text }}</slot>
        </GText>
      </span>
    </transition>
  </span>
</template>

<style scoped src="./GTooltip.css"></style>
