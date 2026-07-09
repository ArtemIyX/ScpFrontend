<script setup lang="ts">
import { computed } from 'vue'

import GText from '../GText/GText.vue'
import { buildGCardClasses, type GCardProps } from './GCard'

const props = withDefaults(defineProps<GCardProps>(), {
  preset: 'surface',
  size: 'md',
  width: 'auto',
  strong: false,
  as: 'section',
})

const classes = computed(() =>
  buildGCardClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    strong: props.strong,
  }),
)
</script>

<template>
  <component :is="as" :class="classes" :aria-label="ariaLabel" :title="titleAttr">
    <header v-if="$slots.header || title || subtitle || meta" class="gcard__header">
      <slot name="header">
        <div class="gcard__heading">
          <GText v-if="title" as="span" preset="header" class="gcard__title">
            {{ title }}
          </GText>
          <GText v-if="subtitle" as="span" preset="muted" class="gcard__subtitle">
            {{ subtitle }}
          </GText>
        </div>

        <GText v-if="meta" as="span" preset="caps" class="gcard__meta">
          {{ meta }}
        </GText>
      </slot>
    </header>

    <div v-if="$slots.media" class="gcard__media">
      <slot name="media" />
    </div>

    <div class="gcard__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="gcard__footer">
      <slot name="footer" />
    </footer>
  </component>
</template>

<style scoped src="./GCard.css"></style>
