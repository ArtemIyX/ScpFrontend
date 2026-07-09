<script setup lang="ts">
import { computed } from 'vue'

import { buildGTextClasses, type GTextProps } from './GText'

const props = withDefaults(defineProps<GTextProps>(), {
  preset: 'body',
  as: 'p',
})

const as = computed(() => props.as)
const text = computed(() => props.text)
const classes = computed(() => buildGTextClasses(props.preset))
</script>

<template>
  <component :is="as" :class="classes">
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped src="./GText.css"></style>
