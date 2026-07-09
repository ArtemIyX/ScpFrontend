<script setup lang="ts">
import { computed } from 'vue'

import GText from '../GText/GText.vue'
import { buildGButtonClasses, type GButtonEmits, type GButtonProps } from './GButton'

const props = withDefaults(defineProps<GButtonProps>(), {
  preset: 'surface',
  size: 'md',
  shape: 'soft',
  width: 'auto',
  background: false,
  type: 'button',
  iconOnly: false,
  busy: false,
  disabled: false,
  pressed: false,
})

const emit = defineEmits<GButtonEmits>()

const classes = computed(() => buildGButtonClasses(props))
const isDisabled = computed(() => props.disabled || props.busy)
const isPressed = computed(() => props.pressed)
const resolvedAriaLabel = computed(() => props.ariaLabel ?? props.text ?? undefined)

function onClick(event: MouseEvent): void {
  if (isDisabled.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="isDisabled"
    :aria-busy="busy || undefined"
    :aria-pressed="isPressed || undefined"
    :aria-label="iconOnly ? resolvedAriaLabel : undefined"
    :title="title"
    @click="onClick"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @pointerenter="emit('pointerenter', $event)"
    @pointerleave="emit('pointerleave', $event)"
    @keydown="emit('keydown', $event)"
  >
    <span class="gbutton__content">
      <template v-if="iconOnly">
        <span class="gbutton__icon gbutton__icon--only">
          <template v-if="$slots.icon">
            <slot name="icon" />
          </template>
          <template v-else-if="$slots['icon-left']">
            <slot name="icon-left" />
          </template>
          <template v-else-if="$slots['icon-right']">
            <slot name="icon-right" />
          </template>
        </span>
      </template>
      <template v-else>
        <span v-if="$slots['icon-left']" class="gbutton__icon gbutton__icon--left">
          <slot name="icon-left" />
        </span>

        <GText as="span" preset="header" class="gbutton__label">
          <slot>{{ text }}</slot>
        </GText>

        <span v-if="$slots['icon-right']" class="gbutton__icon gbutton__icon--right">
          <slot name="icon-right" />
        </span>
      </template>

      <span v-if="busy" class="gbutton__spinner" aria-hidden="true"></span>
    </span>
  </button>
</template>

<style scoped src="./GButton.css"></style>
