<script setup lang="ts">
import { computed } from 'vue'

import GText from '../GText/GText.vue'
import { buildGDividerClasses, type GDividerProps } from './GDivider'

const props = withDefaults(defineProps<GDividerProps>(), {
  preset: 'surface',
  size: 'md',
  orientation: 'horizontal',
  inset: false,
})

const classes = computed(() =>
  buildGDividerClasses({
    preset: props.preset,
    size: props.size,
    orientation: props.orientation,
    inset: props.inset,
  }),
)
</script>

<template>
  <div :class="classes" role="separator" :aria-label="ariaLabel || label">
    <span class="gdivider__line"></span>
    <GText v-if="label" as="span" preset="caps" class="gdivider__label">
      {{ label }}
    </GText>
    <span class="gdivider__line"></span>
  </div>
</template>

<style scoped src="./GDivider.css"></style>
