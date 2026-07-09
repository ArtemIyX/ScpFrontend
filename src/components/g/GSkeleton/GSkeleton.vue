<script setup lang="ts">
import { computed, useSlots } from 'vue'

import GText from '../GText/GText.vue'
import { buildGSkeletonClasses, type GSkeletonProps } from './GSkeleton'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GSkeletonProps>(), {
  loading: true,
  preset: 'quiet',
  size: 'md',
  width: 'auto',
  shape: 'block',
  lines: 3,
  background: false,
  titleWidth: '56%',
  circleSize: '3rem',
  active: true,
})

const slots = useSlots()

const classes = computed(() =>
  buildGSkeletonClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    shape: props.shape,
    background: props.background,
    loading: props.loading,
    active: props.active,
  }),
)

const lineCount = computed(() => Math.max(1, Math.floor(props.lines)))
</script>

<template>
  <section
    :class="classes"
    :aria-busy="loading ? 'true' : 'false'"
    :aria-label="ariaLabel || title || 'Loading content'"
    v-bind="$attrs"
  >
    <div class="gskeleton__content" :class="{ 'gskeleton__content--hidden': loading }">
      <slot />
    </div>

    <div v-if="loading" class="gskeleton__placeholder" aria-hidden="true">
      <div v-if="slots.avatar" class="gskeleton__avatar">
        <slot name="avatar" />
      </div>
      <span v-else-if="shape === 'circle'" class="gskeleton__circle"></span>

      <div class="gskeleton__lines">
        <slot name="skeleton">
          <span
            v-for="index in lineCount"
            :key="index"
            class="gskeleton__line"
            :class="[
              index === 1 ? 'gskeleton__line--title' : '',
              index === lineCount ? 'gskeleton__line--tail' : '',
            ]"
            :style="index === 1 ? { width: titleWidth } : undefined"
          ></span>
        </slot>
      </div>
    </div>

    <GText v-else-if="slots.fallback" preset="muted" as="span" class="gskeleton__fallback">
      <slot name="fallback" />
    </GText>
  </section>
</template>

<style scoped src="./GSkeleton.css"></style>
