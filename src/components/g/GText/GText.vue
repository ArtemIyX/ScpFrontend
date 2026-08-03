<script setup lang="ts">
import { computed, useSlots } from 'vue'

import { useLocalizedText } from '@/localization'

import { buildGTextClasses, type GTextProps } from './GText'

const props = withDefaults(defineProps<GTextProps>(), {
  preset: 'body',
  as: 'p',
})

const slots = useSlots()
const as = computed(() => props.as)
const localize = useLocalizedText()
const slotText = computed(() => {
  const content = slots.default?.()
  return content?.length === 1 && typeof content[0]?.children === 'string' ? content[0].children : undefined
})
const text = computed(() =>
  localize(
    props.text ?? slotText.value,
    props.textKey ? { table: props.table, key: props.textKey } : undefined,
  ),
)
const classes = computed(() => buildGTextClasses(props.preset))
</script>

<template>
  <component :is="as" :class="classes">
    <template v-if="text !== undefined">{{ text }}</template>
    <slot v-else />
  </component>
</template>

<style scoped src="./GText.css"></style>
