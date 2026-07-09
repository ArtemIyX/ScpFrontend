<script setup lang="ts">
import { computed } from 'vue'

import GText from '../GText/GText.vue'
import { buildGToolbarClasses, type GToolbarProps } from './GToolbar'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GToolbarProps>(), {
  preset: 'quiet',
  size: 'md',
  width: 'auto',
  align: 'start',
  wrap: true,
  background: false,
  as: 'div',
})

const as = computed(() => props.as)
const classes = computed(() =>
  buildGToolbarClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    align: props.align,
    wrap: props.wrap,
    background: props.background,
  }),
)
</script>

<template>
  <component :is="as" :class="classes" :aria-label="ariaLabel">
    <header v-if="$slots.header || title || subtitle || status" class="gtoolbar__header">
      <slot name="header">
        <div class="gtoolbar__heading">
          <GText v-if="title" as="span" preset="header" class="gtoolbar__title">
            {{ title }}
          </GText>
          <GText v-if="subtitle" as="span" preset="muted" class="gtoolbar__subtitle">
            {{ subtitle }}
          </GText>
        </div>

        <GText v-if="status" as="span" preset="caps" class="gtoolbar__status">
          {{ status }}
        </GText>
      </slot>
    </header>

    <div class="gtoolbar__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="gtoolbar__footer">
      <slot name="footer" />
    </footer>
  </component>
</template>

<style scoped src="./GToolbar.css"></style>
