<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'

import GText from '../GText/GText.vue'
import type { GTabsEmits, GTabsItem, GTabsProps } from './GTabs'
import { buildGTabsClasses } from './GTabs'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GTabsProps>(), {
  tabs: () => [],
  preset: 'surface',
  size: 'md',
  width: 'auto',
  align: 'start',
  background: false,
  disabled: false,
})

const attrs = useAttrs()
const emit = defineEmits<GTabsEmits>()
const tablistRef = ref<HTMLElement | null>(null)
const activeIndex = ref(-1)

const hasActive = computed(() => activeIndex.value >= 0 && activeIndex.value < props.tabs.length)
const activeTab = computed<GTabsItem | null>(() => props.tabs[activeIndex.value] ?? null)

const classes = computed(() =>
  buildGTabsClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    align: props.align,
    background: props.background,
    disabled: props.disabled,
  }),
)

function firstEnabledIndex(): number {
  return props.tabs.findIndex((tab) => !tab.disabled)
}

function setActiveByValue(value: string | number | null | undefined): void {
  const index = props.tabs.findIndex((tab) => tab.value === value && !tab.disabled)
  activeIndex.value = index >= 0 ? index : firstEnabledIndex()
}

function setActive(index: number): void {
  const tab = props.tabs[index]
  if (!tab || tab.disabled || props.disabled) {
    return
  }

  activeIndex.value = index
  emit('update:modelValue', tab.value)
  emit('change', tab.value, tab)
  emit('select', tab)
}

function moveActive(direction: 1 | -1): void {
  if (props.tabs.length === 0) {
    return
  }

  let index = activeIndex.value
  if (index < 0) {
    index = firstEnabledIndex()
  }

  for (let step = 0; step < props.tabs.length; step += 1) {
    index = (index + direction + props.tabs.length) % props.tabs.length
    const tab = props.tabs[index]
    if (tab && !tab.disabled) {
      activeIndex.value = index
      emit('update:modelValue', tab.value)
      emit('change', tab.value, tab)
      emit('select', tab)
      return
    }
  }
}

function focusActiveTab(): void {
  const button = tablistRef.value?.querySelector<HTMLButtonElement>(`[data-gtabs-index="${activeIndex.value}"]`)
  button?.focus()
}

function onKeydown(event: KeyboardEvent): void {
  emit('keydown', event)
  if (props.disabled || props.tabs.length === 0) {
    return
  }

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      moveActive(1)
      focusActiveTab()
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      moveActive(-1)
      focusActiveTab()
      break
    case 'Home':
      event.preventDefault()
      activeIndex.value = firstEnabledIndex()
      focusActiveTab()
      break
    case 'End':
      event.preventDefault()
      for (let index = props.tabs.length - 1; index >= 0; index -= 1) {
        if (!props.tabs[index]?.disabled) {
          activeIndex.value = index
          focusActiveTab()
          break
        }
      }
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (hasActive.value) {
        const tab = props.tabs[activeIndex.value]
        if (tab && !tab.disabled) {
          emit('update:modelValue', tab.value)
          emit('change', tab.value, tab)
          emit('select', tab)
        }
      }
      break
  }
}

watch(
  () => props.modelValue,
  () => {
    setActiveByValue(props.modelValue)
  },
  { immediate: true },
)
</script>

<template>
  <div :class="classes" v-bind="attrs">
    <div
      ref="tablistRef"
      class="gtabs__list"
      role="tablist"
      :aria-label="ariaLabel"
      :title="title"
      @keydown="onKeydown"
    >
      <button
        v-for="(tab, index) in tabs"
        :key="tab.value"
        type="button"
        class="gtabs__tab"
        :class="{
          'gtabs__tab--active': tab.value === modelValue || index === activeIndex,
          'gtabs__tab--disabled': tab.disabled,
        }"
        :data-gtabs-index="index"
        role="tab"
        :aria-selected="tab.value === modelValue ? 'true' : 'false'"
        :aria-disabled="tab.disabled ? 'true' : undefined"
        :disabled="disabled || tab.disabled"
        @click="setActive(index)"
        @focus="activeIndex = index"
      >
        <span class="gtabs__tab-body">
          <GText as="span" preset="header" class="gtabs__label">{{ tab.label }}</GText>
          <span v-if="tab.description" class="gtabs__description">{{ tab.description }}</span>
        </span>

        <span v-if="tab.count !== undefined" class="gtabs__count">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <div class="gtabs__panel" role="tabpanel">
      <slot :active-tab="activeTab" :active-index="activeIndex" />
    </div>
  </div>
</template>

<style scoped src="./GTabs.css"></style>
