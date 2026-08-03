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
const focusIndex = ref(-1)

const selectedIndex = computed(() =>
  props.tabs.findIndex((tab) => tab.value === props.modelValue && !tab.disabled),
)
const hasActive = computed(() => focusIndex.value >= 0 && focusIndex.value < props.tabs.length)
const activeTab = computed<GTabsItem | null>(() => props.tabs[selectedIndex.value] ?? null)

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
  focusIndex.value = index >= 0 ? index : firstEnabledIndex()
}

function setActive(index: number): void {
  const tab = props.tabs[index]
  if (!tab || tab.disabled || props.disabled) {
    return
  }

  focusIndex.value = index
  emit('update:modelValue', tab.value)
  emit('change', tab.value, tab)
  emit('select', tab)
}

function moveActive(direction: 1 | -1): void {
  if (props.tabs.length === 0) {
    return
  }

  let index = focusIndex.value
  if (index < 0) {
    index = firstEnabledIndex()
  }

  for (let step = 0; step < props.tabs.length; step += 1) {
    index = (index + direction + props.tabs.length) % props.tabs.length
    const tab = props.tabs[index]
    if (tab && !tab.disabled) {
      focusIndex.value = index
      emit('update:modelValue', tab.value)
      emit('change', tab.value, tab)
      emit('select', tab)
      return
    }
  }
}

function focusActiveTab(): void {
  const button = tablistRef.value?.querySelector<HTMLButtonElement>(`[data-gtabs-index="${focusIndex.value}"]`)
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
      focusIndex.value = firstEnabledIndex()
      focusActiveTab()
      break
    case 'End':
      event.preventDefault()
      for (let index = props.tabs.length - 1; index >= 0; index -= 1) {
        if (!props.tabs[index]?.disabled) {
          focusIndex.value = index
          focusActiveTab()
          break
        }
      }
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (hasActive.value) {
        const tab = props.tabs[focusIndex.value]
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
          'gtabs__tab--active': tab.value === modelValue,
          'gtabs__tab--disabled': tab.disabled,
        }"
        :data-gtabs-index="index"
        role="tab"
        :aria-selected="tab.value === modelValue ? 'true' : 'false'"
        :aria-disabled="tab.disabled ? 'true' : undefined"
        :disabled="disabled || tab.disabled"
        @click="setActive(index)"
        @focus="focusIndex = index"
      >
        <span class="gtabs__tab-body">
          <GText :text="tab.label" as="span" preset="header" class="gtabs__label" />
          <GText v-if="tab.description" :text="tab.description" as="span" preset="muted" class="gtabs__description" />
        </span>

        <span v-if="tab.count !== undefined" class="gtabs__count">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <div class="gtabs__panel" role="tabpanel">
      <slot :active-tab="activeTab" :active-index="selectedIndex" />
    </div>
  </div>
</template>

<style scoped src="./GTabs.css"></style>
