<script setup lang="ts">
import { computed } from 'vue'

import { buildGIconClasses, type GIconProps } from './GIcon'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GIconProps>(), {
  name: 'info',
  size: 'md',
  preset: 'neutral',
  decorative: true,
  spin: false,
})

const classes = computed(() =>
  buildGIconClasses({
    name: props.name,
    hasSrc: Boolean(props.src),
    size: props.size,
    preset: props.preset,
    spin: props.spin,
  }),
)

const style = computed(() => {
  if (props.size === 'sm' || props.size === 'md' || props.size === 'lg') {
    return undefined
  }

  return { '--gicon-size': props.size }
})

const ariaHidden = computed(() => (props.decorative ? 'true' : undefined))
const role = computed(() => (props.decorative ? undefined : 'img'))
const ariaLabel = computed(() => (props.decorative ? undefined : props.ariaLabel || props.title || props.name))
const imageAlt = computed(() => (props.decorative ? '' : props.ariaLabel || props.title || props.name))
</script>

<template>
  <span
    :class="classes"
    :style="style"
    :role="role"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :title="title"
  >
    <span v-if="$slots.default" class="gicon__slot">
      <slot />
    </span>
    <img v-else-if="src" class="gicon__image" :src="src" :alt="imageAlt" draggable="false" />
    <span v-else class="gicon__glyph" aria-hidden="true"></span>
  </span>
</template>

<style scoped src="./GIcon.css"></style>
