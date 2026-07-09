<script setup lang="ts">
import { computed } from 'vue'

import { buildGLabelClasses, type GLabelProps } from './GLabel'

const props = withDefaults(defineProps<GLabelProps>(), {
  preset: 'quiet',
  size: 'md',
  kind: 'field',
  as: 'span',
})

const classes = computed(() =>
  buildGLabelClasses({
    preset: props.preset,
    size: props.size,
    kind: props.kind,
  }),
)
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :title="title"
    :aria-label="ariaLabel"
  >
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped src="./GLabel.css"></style>
