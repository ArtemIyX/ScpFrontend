<script setup lang="ts">
import { computed } from 'vue'

import GText from '../GText/GText.vue'
import { buildGChipClasses, type GChipEmits, type GChipProps } from './GChip'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GChipProps>(), {
  preset: 'quiet',
  variant: 'soft',
  size: 'md',
  interactive: false,
  selected: false,
  removable: false,
  disabled: false,
  as: 'span',
  type: 'button',
  removeLabel: 'Remove chip',
})

const emit = defineEmits<GChipEmits>()

const as = computed(() => {
  if (props.removable) {
    return 'div'
  }

  if (props.interactive) {
    return 'button'
  }

  return props.as
})
const isButton = computed(() => as.value === 'button')
const isFocusable = computed(() => props.interactive || props.removable)
const classes = computed(() =>
  buildGChipClasses({
    preset: props.preset,
    variant: props.variant,
    size: props.size,
    interactive: props.interactive || props.removable,
    selected: props.selected,
    removable: props.removable,
    disabled: props.disabled,
  }),
)

function onClick(event: MouseEvent): void {
  if (props.disabled) {
    return
  }

  emit('click', event)
}

function onKeydown(event: KeyboardEvent): void {
  if (props.disabled || !isFocusable.value) {
    return
  }

  emit('keydown', event)

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click', event as unknown as MouseEvent)
  }
}

function onRemove(event: MouseEvent): void {
  if (props.disabled) {
    return
  }

  event.stopPropagation()
  emit('remove', event)
}
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :type="isButton ? type : undefined"
    :disabled="isButton ? disabled : undefined"
    :role="isFocusable && !isButton ? 'button' : undefined"
    :tabindex="isFocusable && !isButton ? 0 : undefined"
    :aria-pressed="props.interactive ? selected || undefined : undefined"
    :aria-label="ariaLabel || text"
    :title="title"
    @click="onClick"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @keydown="onKeydown"
    @pointerenter="emit('pointerenter', $event)"
    @pointerleave="emit('pointerleave', $event)"
  >
    <span class="gchip__content">
      <span class="gchip__indicator" aria-hidden="true"></span>
      <GText as="span" preset="caps" class="gchip__text">
        <slot>{{ text }}</slot>
      </GText>
    </span>

    <button
      v-if="removable"
      type="button"
      class="gchip__remove"
      :aria-label="removeLabel"
      @click="onRemove"
    >
      <span class="gchip__remove-icon" aria-hidden="true"></span>
    </button>
  </component>
</template>

<style scoped src="./GChip.css"></style>
