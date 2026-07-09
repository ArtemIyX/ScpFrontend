<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'

import GText from '../GText/GText.vue'
import type { GRailEmits, GRailItem, GRailProps, GRailValue } from './GRail'
import { buildGRailClasses } from './GRail'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GRailProps>(), {
  items: () => [],
  preset: 'surface',
  size: 'md',
  width: 'auto',
  align: 'start',
  background: false,
  disabled: false,
})

const attrs = useAttrs()
const emit = defineEmits<GRailEmits>()
const railRef = ref<HTMLElement | null>(null)
const activeIndex = ref(-1)

const classes = computed(() =>
  buildGRailClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    align: props.align,
    background: props.background,
    disabled: props.disabled,
    hasError: Boolean(props.error),
  }),
)

function firstEnabledIndex(): number {
  return props.items.findIndex((item) => !item.disabled)
}

function setActiveByValue(value: GRailValue | null | undefined): void {
  const index = props.items.findIndex((item) => item.value === value && !item.disabled)
  activeIndex.value = index >= 0 ? index : firstEnabledIndex()
}

function focusActiveItem(): void {
  const button = railRef.value?.querySelector<HTMLButtonElement>(
    `[data-grail-index="${activeIndex.value}"]`,
  )
  button?.focus()
}

function selectItem(index: number): void {
  const item = props.items[index]
  if (!item || item.disabled || props.disabled) {
    return
  }

  activeIndex.value = index
  emit('update:modelValue', item.value)
  emit('change', item.value, item)
  emit('select', item)
}

function moveActive(direction: 1 | -1): void {
  if (props.items.length === 0) {
    return
  }

  let index = activeIndex.value
  if (index < 0) {
    index = firstEnabledIndex()
  }

  for (let step = 0; step < props.items.length; step += 1) {
    index = (index + direction + props.items.length) % props.items.length
    const item = props.items[index]
    if (item && !item.disabled) {
      activeIndex.value = index
      emit('update:modelValue', item.value)
      emit('change', item.value, item)
      emit('select', item)
      return
    }
  }
}

function onKeydown(event: KeyboardEvent): void {
  emit('keydown', event)

  if (props.disabled || props.items.length === 0) {
    return
  }

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      moveActive(1)
      focusActiveItem()
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      moveActive(-1)
      focusActiveItem()
      break
    case 'Home':
      event.preventDefault()
      activeIndex.value = firstEnabledIndex()
      focusActiveItem()
      break
    case 'End':
      event.preventDefault()
      for (let index = props.items.length - 1; index >= 0; index -= 1) {
        if (!props.items[index]?.disabled) {
          activeIndex.value = index
          focusActiveItem()
          break
        }
      }
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (activeIndex.value >= 0) {
        selectItem(activeIndex.value)
      }
      break
  }
}

watch(
  () => [props.modelValue, props.items],
  () => {
    setActiveByValue(props.modelValue)
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <label v-bind="attrs" :class="classes">
    <GText v-if="label" as="span" preset="header" class="grail__label">
      {{ label }}
    </GText>

    <div
      ref="railRef"
      class="grail__rail"
      role="radiogroup"
      :aria-label="ariaLabel || label"
      :title="title"
      @keydown="onKeydown"
    >
      <button
        v-for="(item, index) in items"
        :key="`${item.value}`"
        type="button"
        class="grail__item"
        :class="{
          'grail__item--active': index === activeIndex,
          'grail__item--selected': item.value === modelValue,
          'grail__item--disabled': disabled || item.disabled,
        }"
        role="radio"
        :aria-checked="item.value === modelValue ? 'true' : 'false'"
        :aria-disabled="disabled || item.disabled ? 'true' : undefined"
        :aria-label="item.title || ariaLabel"
        :data-grail-index="index"
        :disabled="disabled || item.disabled"
        :tabindex="disabled || item.disabled ? -1 : item.value === modelValue || index === activeIndex || (activeIndex < 0 && index === firstEnabledIndex()) ? 0 : -1"
        @click="selectItem(index)"
        @focus="activeIndex = index"
      >
        <slot name="item" :item="item" :selected="item.value === modelValue" :active="index === activeIndex">
          <span class="grail__item-body">
            <span class="grail__item-head">
              <span class="grail__title-row">
                <span class="grail__item-title">{{ item.title }}</span>
                <span v-if="item.recommended" class="grail__badge">Recommended</span>
              </span>
              <span v-if="item.meta" class="grail__item-meta">{{ item.meta }}</span>
            </span>
            <span v-if="item.subtitle" class="grail__item-subtitle">{{ item.subtitle }}</span>
          </span>
        </slot>
      </button>
    </div>

    <span class="grail__meta-row">
      <GText v-if="helper && !error" as="span" preset="muted" class="grail__helper">
        {{ helper }}
      </GText>
      <GText v-if="error" as="span" preset="muted" class="grail__helper grail__helper--error">
        {{ error }}
      </GText>
    </span>
  </label>
</template>

<style scoped src="./GRail.css"></style>
