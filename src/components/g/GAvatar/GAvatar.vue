<script setup lang="ts">
import { computed } from 'vue'

import { avatarStatusLabel, buildGAvatarClasses, deriveAvatarInitials, type GAvatarProps } from './GAvatar'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GAvatarProps>(), {
  size: 'md',
  preset: 'quiet',
  shape: 'circle',
  status: 'none',
  decorative: false,
})

const hasSrc = computed(() => Boolean(props.src))
const initials = computed(() => props.initials || deriveAvatarInitials(props.name, props.alt))
const hasInitials = computed(() => Boolean(initials.value))

const classes = computed(() =>
  buildGAvatarClasses({
    preset: props.preset,
    shape: props.shape,
    size: props.size,
    hasSrc: hasSrc.value,
    hasInitials: hasInitials.value,
    status: props.status,
  }),
)

const style = computed(() => {
  if (props.size === 'sm' || props.size === 'md' || props.size === 'lg') {
    return undefined
  }

  return { '--gavatar-size': props.size }
})

const ariaHidden = computed(() => (props.decorative ? 'true' : undefined))
const role = computed(() => (props.decorative ? undefined : 'img'))
const ariaLabel = computed(() => {
  if (props.decorative) {
    return undefined
  }

  return props.ariaLabel || props.alt || props.name || props.title || initials.value
})
const imageAlt = computed(() => (props.decorative ? '' : props.alt || props.name || props.ariaLabel || 'Avatar'))
const statusText = computed(() => avatarStatusLabel(props.status))
</script>

<template>
  <span
    :class="classes"
    :style="style"
    :role="role"
    :aria-hidden="ariaHidden"
    :aria-label="ariaLabel"
    :title="title"
  >
    <span v-if="$slots.default" class="gavatar__slot">
      <slot />
    </span>

    <img v-else-if="src" class="gavatar__image" :src="src" :alt="imageAlt" draggable="false" />

    <span v-else class="gavatar__fallback" aria-hidden="true">{{ initials }}</span>

    <span v-if="status !== 'none'" class="gavatar__status" :aria-label="statusText || statusLabel || status">
      <span class="gavatar__status-dot"></span>
    </span>
  </span>
</template>

<style scoped src="./GAvatar.css"></style>
