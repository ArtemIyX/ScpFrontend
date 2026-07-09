<script setup lang="ts">
import { computed } from 'vue'

import GText from '../GText/GText.vue'
import { buildGTileClasses, type GTileProps } from './GTile'

const props = withDefaults(defineProps<GTileProps>(), {
  preset: 'surface',
  size: 'md',
  width: 'auto',
  icon: false,
  as: 'div',
})

const classes = computed(() =>
  buildGTileClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    icon: props.icon,
  }),
)
</script>

<template>
  <component :is="as" :class="classes" :aria-label="ariaLabel" :title="title">
    <header class="gtile__head">
      <div class="gtile__heading">
        <span v-if="$slots.icon || icon" class="gtile__icon" aria-hidden="true">
          <slot name="icon">
            <span class="gtile__icon-mark"></span>
          </slot>
        </span>

        <div class="gtile__label-wrap">
          <GText v-if="label" as="span" preset="caps" class="gtile__label">
            {{ label }}
          </GText>
          <GText v-if="status" as="span" preset="muted" class="gtile__status">
            {{ status }}
          </GText>
        </div>
      </div>

      <slot name="header" />
    </header>

    <div class="gtile__body">
      <slot name="value">
        <GText v-if="value" as="span" preset="title" class="gtile__value">
          {{ value }}
        </GText>
      </slot>

      <GText v-if="subtitle" as="span" preset="muted" class="gtile__subtitle">
        {{ subtitle }}
      </GText>

      <slot />
    </div>

    <footer v-if="$slots.footer" class="gtile__footer">
      <slot name="footer" />
    </footer>
  </component>
</template>

<style scoped src="./GTile.css"></style>
