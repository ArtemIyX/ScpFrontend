<script setup lang="ts">
import { computed } from 'vue'

import GText from '../GText/GText.vue'
import { buildGPanelClasses, type GPanelProps } from './GPanel'

const props = withDefaults(defineProps<GPanelProps>(), {
  padding: 'md',
  width: 'auto',
  strong: false,
  as: 'section',
})

const as = computed(() => props.as)
const classes = computed(() =>
  buildGPanelClasses({
    padding: props.padding,
    width: props.width,
    strong: props.strong,
  }),
)
</script>

<template>
  <component :is="as" :class="classes">
    <header v-if="$slots.header || title || subtitle" class="gpanel__header">
      <slot name="header">
        <div class="gpanel__heading">
          <GText v-if="title" as="span" preset="header" class="gpanel__title">
            {{ title }}
          </GText>
          <GText v-if="subtitle" as="span" preset="muted" class="gpanel__subtitle">
            {{ subtitle }}
          </GText>
        </div>
      </slot>
    </header>

    <div class="gpanel__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="gpanel__footer">
      <slot name="footer" />
    </footer>
  </component>
</template>

<style scoped src="./GPanel.css"></style>
