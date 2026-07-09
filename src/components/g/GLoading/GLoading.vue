<script setup lang="ts">
import { computed, useSlots } from 'vue'

import GText from '../GText/GText.vue'
import { buildGLoadingClasses, type GLoadingProps } from './GLoading'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GLoadingProps>(), {
  preset: 'surface',
  size: 'md',
  width: 'auto',
  background: false,
  centered: false,
  active: true,
})

const slots = useSlots()

const classes = computed(() =>
  buildGLoadingClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    background: props.background,
    centered: props.centered,
    active: props.active,
  }),
)
</script>

<template>
  <section
    :class="classes"
    role="status"
    aria-live="polite"
    :aria-busy="active ? 'true' : 'false'"
    :aria-label="ariaLabel || label || title || 'Loading content'"
    v-bind="$attrs"
  >
    <div class="gloading__spinner" aria-hidden="true">
      <span class="gloading__spinner-ring"></span>
      <span class="gloading__spinner-core"></span>
    </div>

    <div class="gloading__body">
      <div v-if="label || helper" class="gloading__header">
        <GText v-if="label" as="span" preset="header" class="gloading__label">
          {{ label }}
        </GText>
        <GText v-if="helper" as="span" preset="muted" class="gloading__helper">
          {{ helper }}
        </GText>
      </div>

      <div class="gloading__content">
        <slot>
          <div class="gloading__skeleton" aria-hidden="true">
            <span class="gloading__line gloading__line--wide"></span>
            <span class="gloading__line"></span>
            <span class="gloading__line gloading__line--short"></span>
          </div>
        </slot>
      </div>

      <GText v-if="!slots.default" preset="caps" class="gloading__status">
        Loading
      </GText>
    </div>
  </section>
</template>

<style scoped src="./GLoading.css"></style>
