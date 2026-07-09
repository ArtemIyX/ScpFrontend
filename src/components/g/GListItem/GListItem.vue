<script setup lang="ts">
import { computed } from 'vue'

import GText from '../GText/GText.vue'
import { buildGListItemClasses, type GListItemProps } from './GListItem'

const props = withDefaults(defineProps<GListItemProps>(), {
  tone: 'default',
  selected: false,
  disabled: false,
})

const classes = computed(() =>
  buildGListItemClasses({
    tone: props.tone,
    selected: props.selected,
    disabled: props.disabled,
  }),
)
</script>

<template>
  <li :class="classes">
    <div class="glistitem__main">
      <GText v-if="text" preset="body" as="span" class="glistitem__text">
        {{ text }}
      </GText>
      <slot />
    </div>

    <GText v-if="secondary" preset="muted" as="span" class="glistitem__secondary">
      {{ secondary }}
    </GText>
  </li>
</template>

<style scoped src="./GListItem.css"></style>
