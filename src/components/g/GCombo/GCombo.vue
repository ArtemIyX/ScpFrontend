<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

import GText from '../GText/GText.vue'
import type { GComboEmits, GComboOption, GComboProps } from './GCombo'
import { buildGComboClasses } from './GCombo'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GComboProps>(), {
  options: () => [],
  preset: 'surface',
  size: 'md',
  width: 'auto',
  align: 'start',
  background: false,
  disabled: false,
  readonly: false,
  clearable: false,
})

const attrs = useAttrs()
const emit = defineEmits<GComboEmits>()
const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)
const listboxId = `gcombo-listbox-${Math.random().toString(36).slice(2, 10)}`
const isOpen = ref(false)
const activeIndex = ref(-1)
const openDirection = ref<'down' | 'up'>('down')

const hasValue = computed(() => props.modelValue !== null && props.modelValue !== undefined)

const selectedOption = computed<GComboOption | null>(() => {
  if (!hasValue.value) {
    return null
  }

  return props.options.find((option) => option.value === props.modelValue) ?? null
})

const selectedLabel = computed(() => selectedOption.value?.label ?? '')

const classes = computed(() =>
  buildGComboClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    align: props.align,
    background: props.background,
    disabled: props.disabled,
    readonly: props.readonly,
    open: isOpen.value,
    hasValue: hasValue.value,
    hasError: Boolean(props.error),
    clearable: props.clearable,
  }),
)

function setActiveByValue(value: string | number | null | undefined): void {
  const index = props.options.findIndex((option) => option.value === value)
  activeIndex.value = index >= 0 ? index : Math.max(props.options.findIndex((option) => !option.disabled), 0)
}

function updateOpenDirection(): void {
  const trigger = triggerRef.value
  if (!trigger) {
    openDirection.value = 'down'
    return
  }

  const rect = trigger.getBoundingClientRect()
  const estimatedMenuHeight = Math.min(
    288,
    Math.max(144, props.options.length * 64 + 16),
  )
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top

  openDirection.value =
    spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow ? 'up' : 'down'
}

function openMenu(): void {
  if (props.disabled || props.readonly || props.options.length === 0) {
    return
  }

  if (!isOpen.value) {
    emit('open')
  }

  isOpen.value = true
  setActiveByValue(props.modelValue)
  updateOpenDirection()

  nextTick(() => {
    const option = rootRef.value?.querySelector<HTMLElement>(`[data-gcombo-option-index="${activeIndex.value}"]`)
    option?.scrollIntoView({ block: 'nearest' })
  })
}

function closeMenu(): void {
  if (!isOpen.value) {
    return
  }

  isOpen.value = false
  emit('close')
}

function toggleMenu(): void {
  if (isOpen.value) {
    closeMenu()
    return
  }

  openMenu()
}

function selectOption(option: GComboOption): void {
  if (option.disabled || props.disabled || props.readonly) {
    return
  }

  emit('update:modelValue', option.value)
  emit('change', option.value, option)
  emit('select', option)
  closeMenu()
}

function clearValue(): void {
  if (props.disabled || props.readonly) {
    return
  }

  emit('update:modelValue', null)
  emit('change', null, null)
  emit('clear')
  closeMenu()
}

function onTriggerKeydown(event: KeyboardEvent): void {
  emit('keydown', event)

  if (props.disabled || props.readonly) {
    return
  }

  if (!isOpen.value && (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    openMenu()
    return
  }

  if (!isOpen.value) {
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu()
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    const next = props.options.findIndex((option, index) => index > activeIndex.value && !option.disabled)
    activeIndex.value = next >= 0 ? next : activeIndex.value
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    for (let index = activeIndex.value - 1; index >= 0; index -= 1) {
      if (!props.options[index]?.disabled) {
        activeIndex.value = index
        break
      }
    }
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    activeIndex.value = props.options.findIndex((option) => !option.disabled)
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    for (let index = props.options.length - 1; index >= 0; index -= 1) {
      if (!props.options[index]?.disabled) {
        activeIndex.value = index
        break
      }
    }
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    const option = props.options[activeIndex.value]
    if (option) {
      selectOption(option)
    }
  }
}

function onFocus(event: FocusEvent): void {
  emit('focus', event)
}

function onBlur(event: FocusEvent): void {
  window.setTimeout(() => {
    const active = document.activeElement as Node | null
    if (!rootRef.value?.contains(active)) {
      closeMenu()
    }
  }, 0)

  emit('blur', event)
}

function onPointerDownOutside(event: MouseEvent): void {
  if (!rootRef.value) {
    return
  }

  const target = event.target as Node | null
  if (target && !rootRef.value.contains(target)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onPointerDownOutside)
  window.addEventListener('resize', updateOpenDirection)
  window.addEventListener('scroll', updateOpenDirection, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onPointerDownOutside)
  window.removeEventListener('resize', updateOpenDirection)
  window.removeEventListener('scroll', updateOpenDirection, true)
})

watch(
  () => props.modelValue,
  () => {
    setActiveByValue(props.modelValue)
  },
  { immediate: true },
)
</script>

<template>
  <label :class="classes" ref="rootRef">
    <GText v-if="label" as="span" preset="header" class="gcombo__label">
      {{ label }}
    </GText>

    <div class="gcombo__shell">
      <button
        ref="triggerRef"
        v-bind="attrs"
        :id="id"
        :name="name"
        type="button"
        class="gcombo__trigger"
        :aria-label="ariaLabel"
        :aria-haspopup="'listbox'"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="listboxId"
        :aria-invalid="error ? 'true' : undefined"
        :title="title"
        :disabled="disabled"
        @click="toggleMenu"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onTriggerKeydown"
      >
        <span class="gcombo__value" :class="{ 'gcombo__value--placeholder': !hasValue }">
          {{ hasValue ? selectedLabel : placeholder || 'Select value' }}
        </span>

        <span class="gcombo__meta">
          <span class="gcombo__chevron" aria-hidden="true"></span>
        </span>
      </button>

      <button
        v-if="clearable && hasValue && !disabled && !readonly"
        type="button"
        class="gcombo__clear"
        aria-label="Clear selection"
        @mousedown.prevent
        @click.stop="clearValue"
      >
        ×
      </button>

      <transition name="gcombo-pop">
        <div
          v-if="isOpen"
          :id="listboxId"
          class="gcombo__menu"
          :class="{ 'gcombo__menu--up': openDirection === 'up' }"
          role="listbox"
        >
          <button
            v-for="(option, index) in options"
            :key="option.value"
            type="button"
            class="gcombo__option"
            :class="{
              'gcombo__option--active': index === activeIndex,
              'gcombo__option--selected': option.value === modelValue,
              'gcombo__option--disabled': option.disabled,
            }"
            role="option"
            :aria-selected="option.value === modelValue ? 'true' : 'false'"
            :data-gcombo-option-index="index"
            :disabled="option.disabled"
            @mousedown.prevent
            @mousemove="activeIndex = index"
            @click="selectOption(option)"
          >
            <span class="gcombo__option-label">{{ option.label }}</span>
            <span v-if="option.description" class="gcombo__option-description">
              {{ option.description }}
            </span>
          </button>
        </div>
      </transition>
    </div>

    <span class="gcombo__meta-row">
      <GText v-if="helper && !error" as="span" preset="muted" class="gcombo__helper">
        {{ helper }}
      </GText>
      <GText v-if="error" as="span" preset="muted" class="gcombo__helper gcombo__helper--error">
        {{ error }}
      </GText>
    </span>
  </label>
</template>

<style scoped src="./GCombo.css"></style>
