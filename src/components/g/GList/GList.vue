<script setup lang="ts">
import { computed, useSlots } from 'vue'

import GText from '../GText/GText.vue'
import { buildGListClasses, type GListProps } from './GList'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GListProps>(), {
  preset: 'surface',
  marker: 'bullet',
  size: 'md',
  width: 'auto',
  background: false,
  compact: false,
})

const slots = useSlots()

const classes = computed(() =>
  buildGListClasses({
    preset: props.preset,
    marker: props.marker,
    size: props.size,
    width: props.width,
    background: props.background,
    compact: props.compact,
  }),
)

const as = computed(() => (props.marker === 'indexed' ? 'ol' : 'ul'))
</script>

<template>
  <section
    :class="classes"
    :aria-label="ariaLabel || label || title || 'List'"
    v-bind="$attrs"
  >
    <div v-if="label || helper" class="glist__header">
      <GText v-if="label" as="span" preset="header" class="glist__label">
        {{ label }}
      </GText>
      <GText v-if="helper" as="span" preset="muted" class="glist__helper">
        {{ helper }}
      </GText>
    </div>

    <component :is="as" class="glist__items">
      <slot v-if="slots.default" />
    </component>
  </section>
</template>

<style scoped src="./GList.css"></style>
