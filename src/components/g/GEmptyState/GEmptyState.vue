<script setup lang="ts">
import { computed, useSlots } from 'vue'

import GButton from '../GButton/GButton.vue'
import GIcon from '../GIcon/GIcon.vue'
import GText from '../GText/GText.vue'
import { buildGEmptyStateClasses, type GEmptyStateProps } from './GEmptyState'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GEmptyStateProps>(), {
  preset: 'quiet',
  size: 'md',
  width: 'auto',
  background: false,
  centered: true,
})

const slots = useSlots()

const classes = computed(() =>
  buildGEmptyStateClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    background: props.background,
    centered: props.centered,
    hasIcon: Boolean(props.icon || props.iconSrc || slots.icon),
  }),
)

const iconSize = computed(() => props.iconSize || (props.size === 'lg' ? '2.5rem' : props.size === 'sm' ? '1.75rem' : '2rem'))
const iconPreset = computed(() => (props.preset === 'surface' ? 'quiet' : props.preset))
</script>

<template>
  <section
    :class="classes"
    :aria-label="ariaLabel || title || 'Empty state'"
    v-bind="$attrs"
  >
    <div v-if="$slots.icon || icon || iconSrc" class="gemptystate__icon" aria-hidden="true">
      <slot name="icon">
        <GIcon v-if="iconSrc" :src="iconSrc" :size="iconSize" :preset="iconPreset" />
        <GIcon v-else-if="icon" :name="icon" :size="iconSize" :preset="iconPreset" />
      </slot>
    </div>

    <div class="gemptystate__body">
      <div v-if="title || description || helper || $slots.body" class="gemptystate__copy">
        <GText v-if="title" as="span" preset="header" class="gemptystate__title">
          {{ title }}
        </GText>
        <GText v-if="description" as="span" preset="body" class="gemptystate__description">
          {{ description }}
        </GText>
        <GText v-if="helper" as="span" preset="muted" class="gemptystate__helper">
          {{ helper }}
        </GText>
        <slot name="body" />
      </div>

      <div v-if="$slots.footer" class="gemptystate__footer">
        <slot name="footer" />
      </div>

      <div v-else-if="$slots.actions" class="gemptystate__footer">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>

<style scoped src="./GEmptyState.css"></style>
