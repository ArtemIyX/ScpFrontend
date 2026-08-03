<script setup lang="ts">
import { computed } from 'vue'

import GText from '../GText/GText.vue'
import { buildGBadgeClasses, type GBadgeEmits, type GBadgeProps } from './GBadge'

const props = withDefaults(defineProps<GBadgeProps>(), {
  preset: 'neutral',
  variant: 'soft',
  size: 'md',
  dot: false,
  interactive: false,
  as: 'span',
  type: 'button',
  disabled: false,
})

const emit = defineEmits<GBadgeEmits>()

const as = computed(() => (props.interactive ? 'button' : props.as))
const classes = computed(() =>
  buildGBadgeClasses({
    preset: props.preset,
    variant: props.variant,
    size: props.size,
    dot: props.dot,
    interactive: props.interactive,
    disabled: props.disabled,
  }),
)

function onClick(event: MouseEvent): void {
  if (props.disabled || !props.interactive) {
    return
  }

  emit('click', event)
}
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :type="props.interactive ? type : undefined"
    :disabled="props.interactive ? disabled : undefined"
    :aria-label="ariaLabel"
    :title="title"
    @click="onClick"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @keydown="emit('keydown', $event)"
    @pointerenter="emit('pointerenter', $event)"
    @pointerleave="emit('pointerleave', $event)"
  >
    <span v-if="dot" class="gbadge__dot" aria-hidden="true"></span>
    <GText :text="text" :table="table" :text-key="textKey" as="span" preset="caps" class="gbadge__text">
      <slot>{{ text }}</slot>
    </GText>
  </component>
</template>

<style scoped src="./GBadge.css"></style>
