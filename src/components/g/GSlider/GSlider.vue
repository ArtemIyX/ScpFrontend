<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'

import GText from '../GText/GText.vue'
import { buildGSliderClasses, type GSliderEmits, type GSliderProps } from './GSlider'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GSliderProps>(), {
  preset: 'surface',
  size: 'md',
  width: 'auto',
  background: false,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  showValue: true,
})

const attrs = useAttrs()
const slots = useSlots()
const emit = defineEmits<GSliderEmits>()

const inputRef = ref<HTMLInputElement | null>(null)
const sliderId = computed(() => props.id || `gslider-${Math.random().toString(36).slice(2, 10)}`)

const numericValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined || Number.isNaN(props.modelValue)) {
    return props.min
  }

  return props.modelValue
})

const percent = computed(() => {
  const range = props.max - props.min
  if (range <= 0) {
    return 0
  }

  return Math.min(100, Math.max(0, ((numericValue.value - props.min) / range) * 100))
})

const classes = computed(() =>
  buildGSliderClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    background: props.background,
    disabled: props.disabled,
    hasError: Boolean(props.error),
    showValue: props.showValue,
  }),
)

const valueLabel = computed(() => `${numericValue.value}${props.valueSuffix ?? ''}`)

const trackStyle = computed(() => ({
  '--gslider-progress': `${percent.value}%`,
}))

function updateValue(event: Event): void {
  const target = event.target as HTMLInputElement | null
  if (!target) {
    return
  }

  emit('update:modelValue', Number(target.value))
  emit('input', event)
}

function onChange(event: Event): void {
  emit('change', event)
}

function onFocus(event: FocusEvent): void {
  emit('focus', event)
}

function onBlur(event: FocusEvent): void {
  emit('blur', event)
}

function onKeydown(event: KeyboardEvent): void {
  emit('keydown', event)
}
</script>

<template>
  <label :class="classes">
    <div class="gslider__head">
      <GText v-if="label || labelKey" :text="label" :table="table" :text-key="labelKey" as="span" preset="header" class="gslider__label" />

      <div v-if="showValue" class="gslider__value">
        <slot name="value" :value="numericValue" :text="valueLabel">
          <GText :text="valueLabel" as="span" preset="caps" class="gslider__value-text" />
        </slot>
      </div>
    </div>

    <div class="gslider__field">
      <span v-if="$slots.prefix" class="gslider__prefix">
        <slot name="prefix" />
      </span>

      <input
        ref="inputRef"
        v-bind="attrs"
        :id="sliderId"
        :name="name"
        class="gslider__input"
        type="range"
        :value="numericValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :aria-label="ariaLabel"
        :aria-invalid="error ? 'true' : undefined"
        :style="trackStyle"
        @input="updateValue"
        @change="onChange"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />

      <span v-if="$slots.suffix" class="gslider__suffix">
        <slot name="suffix" />
      </span>
    </div>

    <span class="gslider__meta">
      <GText v-if="helper || helperKey" :text="helper" :table="table" :text-key="helperKey" as="span" preset="muted" class="gslider__helper" />
      <GText v-if="error" :text="error" as="span" preset="muted" class="gslider__helper gslider__helper--error" />
    </span>
  </label>
</template>

<style scoped src="./GSlider.css"></style>
