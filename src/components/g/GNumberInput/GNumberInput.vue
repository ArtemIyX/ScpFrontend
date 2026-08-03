<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

import GText from '../GText/GText.vue'
import {
  buildGNumberInputClasses,
  clampNumber,
  normalizeNumber,
  parseNumberInput,
  type GNumberInputEmits,
  type GNumberInputProps,
} from './GNumberInput'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GNumberInputProps>(), {
  preset: 'surface',
  size: 'md',
  width: 'auto',
  background: false,
  mode: 'integer',
  step: 1,
  precision: 2,
  stepButtons: true,
  disabled: false,
  readonly: false,
  autofocus: false,
  showValue: true,
})

const attrs = useAttrs()
const emit = defineEmits<GNumberInputEmits>()
const isFocused = ref(false)

const hasValue = computed(() => props.modelValue !== null && props.modelValue !== undefined && !Number.isNaN(props.modelValue))

const classes = computed(() =>
  buildGNumberInputClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    background: props.background,
    disabled: props.disabled,
    readonly: props.readonly,
    focused: isFocused.value,
    hasValue: hasValue.value,
    hasError: Boolean(props.error),
    stepButtons: props.stepButtons,
    showValue: props.showValue,
    mode: props.mode,
  }),
)

const resolvedValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined || Number.isNaN(props.modelValue)) {
    return ''
  }

  const normalized = normalizeNumber(props.modelValue, props.mode, props.precision)
  return props.mode === 'integer' ? String(Math.trunc(normalized)) : String(normalized)
})

const valueLabel = computed(() => {
  if (!hasValue.value || props.modelValue === null || props.modelValue === undefined) {
    return 'Empty'
  }

  const normalized = normalizeNumber(props.modelValue, props.mode, props.precision)
  return `${normalized}${props.valueSuffix ?? ''}`
})

const inputMode = computed(() => (props.mode === 'integer' ? 'numeric' : 'decimal'))
const stepValue = computed(() => props.step ?? (props.mode === 'integer' ? 1 : 0.1))

function emitValue(value: number | null): void {
  emit('update:modelValue', value)
}

function updateFromString(value: string): void {
  const parsed = parseNumberInput(value, props.mode)

  if (parsed === null) {
    emitValue(null)
    return
  }

  const normalized = clampNumber(normalizeNumber(parsed, props.mode, props.precision), props.min, props.max)
  emitValue(normalized)
}

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement | null
  if (!target) {
    return
  }

  updateFromString(target.value)
  emit('input', event as InputEvent)
}

function onChange(event: Event): void {
  const target = event.target as HTMLInputElement | null
  if (target) {
    updateFromString(target.value)
  }

  emit('change', event)
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true
  emit('focus', event)
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false
  emit('blur', event)
}

function onKeydown(event: KeyboardEvent): void {
  emit('keydown', event)
}

function stepBy(direction: 1 | -1): void {
  if (props.disabled || props.readonly) {
    return
  }

  const base = hasValue.value && props.modelValue !== null && props.modelValue !== undefined ? props.modelValue : 0
  const next = clampNumber(
    normalizeNumber(base + direction * stepValue.value, props.mode, props.precision),
    props.min,
    props.max,
  )

  emitValue(next)
  if (direction > 0) {
    emit('increment', next)
    return
  }

  emit('decrement', next)
}
</script>

<template>
  <label :class="classes">
    <div class="gnumberinput__head">
      <GText v-if="label" :text="label" as="span" preset="header" class="gnumberinput__label" />

      <div v-if="showValue" class="gnumberinput__value">
        <slot name="value" :value="modelValue" :text="valueLabel">
          <GText :text="valueLabel" as="span" preset="caps" class="gnumberinput__value-text" />
        </slot>
      </div>
    </div>

    <div class="gnumberinput__field">
      <span v-if="$slots.prefix" class="gnumberinput__prefix">
        <slot name="prefix" />
      </span>

      <input
        v-bind="attrs"
        :id="id"
        :name="name"
        class="gnumberinput__input"
        type="number"
        :value="resolvedValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autofocus="autofocus"
        :inputmode="inputMode"
        :min="min"
        :max="max"
        :step="stepValue"
        :aria-label="ariaLabel"
        :aria-invalid="error ? 'true' : undefined"
        @input="onInput"
        @change="onChange"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />

      <span v-if="$slots.suffix" class="gnumberinput__suffix">
        <slot name="suffix" />
      </span>

      <span v-if="stepButtons" class="gnumberinput__steps" aria-hidden="false">
        <button
          type="button"
          class="gnumberinput__step"
          :disabled="disabled || readonly"
          aria-label="Increase value"
          @mousedown.prevent
          @click="stepBy(1)"
        >
          +
        </button>
        <button
          type="button"
          class="gnumberinput__step"
          :disabled="disabled || readonly"
          aria-label="Decrease value"
          @mousedown.prevent
          @click="stepBy(-1)"
        >
          -
        </button>
      </span>
    </div>

    <span class="gnumberinput__meta">
      <GText v-if="helper && !error" :text="helper" as="span" preset="muted" class="gnumberinput__helper" />
      <GText v-if="error" :text="error" as="span" preset="muted" class="gnumberinput__helper gnumberinput__helper--error" />
    </span>
  </label>
</template>

<style scoped src="./GNumberInput.css"></style>
