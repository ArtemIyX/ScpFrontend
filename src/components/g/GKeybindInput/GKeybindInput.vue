<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

import GText from '../GText/GText.vue'
import {
  buildGKeybindInputClasses,
  formatKeybind,
  type GKeybindInputEmits,
  type GKeybindInputProps,
} from './GKeybindInput'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GKeybindInputProps>(), {
  preset: 'surface',
  size: 'md',
  width: 'auto',
  background: false,
  disabled: false,
  readonly: false,
  clearable: false,
  prompt: 'Press a key',
  cancelOnEscape: true,
})

const attrs = useAttrs()
const emit = defineEmits<GKeybindInputEmits>()
const isFocused = ref(false)
const isCapturing = ref(false)
const triggerRef = ref<HTMLButtonElement | null>(null)

const hasValue = computed(() => Boolean(props.modelValue && props.modelValue.trim().length > 0))

const classes = computed(() =>
  buildGKeybindInputClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    background: props.background,
    disabled: props.disabled,
    readonly: props.readonly,
    focused: isFocused.value,
    capturing: isCapturing.value,
    hasValue: hasValue.value,
    hasError: Boolean(props.error),
    clearable: props.clearable,
  }),
)

const displayValue = computed(() => props.modelValue || props.placeholder || 'Unbound')

function emitValue(value: string | null): void {
  emit('update:modelValue', value)
  emit('change', value)
}

function stopCapture(value: string | null): void {
  isCapturing.value = false
  emit('capture-end', value)
}

function clearValue(): void {
  if (props.disabled || props.readonly) {
    return
  }

  emitValue(null)
  emit('clear')
  triggerRef.value?.focus()
}

function startCapture(): void {
  if (props.disabled || props.readonly) {
    return
  }

  isCapturing.value = true
  emit('capture-start')
}

function onTriggerClick(): void {
  if (isCapturing.value) {
    stopCapture(props.modelValue ?? null)
    return
  }

  startCapture()
}

function onKeydown(event: KeyboardEvent): void {
  emit('keydown', event)

  if (props.disabled || props.readonly) {
    return
  }

  if (!isCapturing.value) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      startCapture()
    }
    return
  }

  event.preventDefault()
  event.stopPropagation()

  if (event.key === 'Escape' && props.cancelOnEscape) {
    stopCapture(props.modelValue ?? null)
    return
  }

  if (event.key === 'Backspace' || event.key === 'Delete') {
    emitValue(null)
    stopCapture(null)
    emit('clear')
    return
  }

  const combo = formatKeybind(event)
  if (!combo) {
    return
  }

  emitValue(combo)
  stopCapture(combo)
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true
  emit('focus', event)
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false
  if (isCapturing.value) {
    stopCapture(props.modelValue ?? null)
  }
  emit('blur', event)
}

function onWindowPointerDown(event: MouseEvent): void {
  if (!isCapturing.value) {
    return
  }

  const target = event.target as Node | null
  if (target && !triggerRef.value?.contains(target)) {
    stopCapture(props.modelValue ?? null)
  }
}

onMounted(() => {
  window.addEventListener('pointerdown', onWindowPointerDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', onWindowPointerDown)
})

watch(
  () => props.disabled,
  () => {
    if (props.disabled && isCapturing.value) {
      stopCapture(props.modelValue ?? null)
    }
  },
)
</script>

<template>
  <label :class="classes">
    <GText v-if="label" as="span" preset="header" class="gkeybindinput__label">
      {{ label }}
    </GText>

    <button
      ref="triggerRef"
      v-bind="attrs"
      type="button"
      class="gkeybindinput__trigger"
      :id="id"
      :name="name"
      :disabled="disabled"
      :aria-label="ariaLabel || label"
      :aria-invalid="error ? 'true' : undefined"
      :title="title"
      @click="onTriggerClick"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
    >
      <span class="gkeybindinput__value" :class="{ 'gkeybindinput__value--placeholder': !hasValue }">
        {{ isCapturing ? prompt : displayValue }}
      </span>

      <span class="gkeybindinput__state" aria-hidden="true">
        {{ isCapturing ? 'Listening' : hasValue ? 'Assigned' : 'Empty' }}
      </span>
    </button>

    <div class="gkeybindinput__meta">
      <GText v-if="helper && !error" as="span" preset="muted" class="gkeybindinput__helper">
        {{ helper }}
      </GText>
      <GText v-if="error" as="span" preset="muted" class="gkeybindinput__helper gkeybindinput__helper--error">
        {{ error }}
      </GText>

      <div v-if="clearable" class="gkeybindinput__actions">
        <button
          type="button"
          class="gkeybindinput__clear"
          :disabled="disabled || readonly || !hasValue"
          @mousedown.prevent
          @click="clearValue"
        >
          Clear
        </button>
      </div>
    </div>
  </label>
</template>

<style scoped src="./GKeybindInput.css"></style>
