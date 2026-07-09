<script setup lang="ts">
import { computed, useSlots } from 'vue'

import GIcon from '../GIcon/GIcon.vue'
import GText from '../GText/GText.vue'
import { buildGStatClasses, type GStatProps } from './GStat'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GStatProps>(), {
  preset: 'quiet',
  variant: 'soft',
  size: 'md',
  width: 'auto',
  background: false,
  as: 'div',
})

const slots = useSlots()

const classes = computed(() =>
  buildGStatClasses({
    preset: props.preset,
    variant: props.variant,
    size: props.size,
    width: props.width,
    background: props.background,
    hasIcon: Boolean(props.icon || props.iconSrc || slots.icon),
  }),
)
</script>

<template>
  <component :is="as" :class="classes" :aria-label="ariaLabel || label" :title="title">
    <div v-if="slots.icon || icon || iconSrc" class="gstat__icon" aria-hidden="true">
      <slot name="icon">
        <GIcon v-if="iconSrc" :src="iconSrc" preset="quiet" />
        <GIcon v-else-if="icon" :name="icon" preset="quiet" />
      </slot>
    </div>

    <div class="gstat__content">
      <GText v-if="label" as="span" preset="caps" class="gstat__label">
        {{ label }}
      </GText>

      <GText v-if="value !== undefined" as="span" preset="header" class="gstat__value">
        {{ value }}
      </GText>

      <GText v-if="detail" as="span" preset="muted" class="gstat__detail">
        {{ detail }}
      </GText>

      <slot />
    </div>
  </component>
</template>

<style scoped src="./GStat.css"></style>
