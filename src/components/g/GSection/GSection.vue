<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import GText from '../GText/GText.vue'
import { buildGSectionClasses, type GSectionProps } from './GSection'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GSectionProps>(), {
  preset: 'surface',
  size: 'md',
  width: 'auto',
  background: false,
  titleAs: 'h3',
})

const attrs = useAttrs()

const classes = computed(() =>
  buildGSectionClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    background: props.background,
  }),
)
</script>

<template>
  <section v-bind="attrs" :class="classes" :aria-label="ariaLabel">
    <header class="gsection__head">
      <div class="gsection__head-text">
        <component :is="titleAs" v-if="title" class="gsection__title">
          <GText as="span" preset="header">
            {{ title }}
          </GText>
        </component>
        <GText v-if="subtitle" as="p" preset="muted" class="gsection__subtitle">
          {{ subtitle }}
        </GText>
      </div>

      <GText v-if="status" as="span" preset="caps" class="gsection__status">
        {{ status }}
      </GText>
    </header>

    <div class="gsection__body">
      <slot />
    </div>

    <div v-if="$slots.footer" class="gsection__footer">
      <slot name="footer" />
    </div>
  </section>
</template>

<style scoped src="./GSection.css"></style>
