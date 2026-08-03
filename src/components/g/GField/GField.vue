<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import GText from '../GText/GText.vue'
import { buildGFieldClasses, type GFieldProps } from './GField'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GFieldProps>(), {
  preset: 'surface',
  size: 'md',
  width: 'auto',
  align: 'start',
  layout: 'stack',
  background: false,
})

const attrs = useAttrs()

const classes = computed(() =>
  buildGFieldClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    align: props.align,
    layout: props.layout,
    background: props.background,
    hasError: Boolean(props.error),
  }),
)
</script>

<template>
  <section v-bind="attrs" :class="classes" :aria-label="ariaLabel" :title="title">
    <div class="gfield__head">
      <GText v-if="label || labelKey" :text="label" :table="table" :text-key="labelKey" as="span" preset="header" class="gfield__label" />

      <slot name="head" />
    </div>

    <div class="gfield__body">
      <slot />
    </div>

    <div class="gfield__meta">
      <GText v-if="(helper || helperKey) && !error" :text="helper" :table="table" :text-key="helperKey" as="span" preset="muted" class="gfield__helper" />
      <GText v-if="error || errorKey" :text="error" :table="table" :text-key="errorKey" as="span" preset="muted" class="gfield__helper gfield__helper--error" />
      <slot name="meta" />
    </div>
  </section>
</template>

<style scoped src="./GField.css"></style>
