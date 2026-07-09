<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue'

import GText from '../GText/GText.vue'
import { buildGInputClasses, type GInputEmits, type GInputProps } from './GInput'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GInputProps>(), {
  preset: 'surface',
  size: 'md',
  width: 'auto',
  background: false,
  type: 'text',
  disabled: false,
  readonly: false,
  clearable: false,
  autofocus: false,
  spellcheck: true,
})

const attrs = useAttrs()
const slots = useSlots()
const emit = defineEmits<GInputEmits>()
const isFocused = ref(false)

const hasValue = computed(() => {
  const value = props.modelValue
  return value !== null && value !== undefined && String(value).length > 0
})

const classes = computed(() =>
  buildGInputClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    background: props.background,
    disabled: props.disabled,
    readonly: props.readonly,
    focused: isFocused.value,
    hasValue: hasValue.value,
    hasError: Boolean(props.error),
    clearable: props.clearable,
    hasPrefix: Boolean(slots.prefix),
    hasSuffix: Boolean(slots.suffix),
  }),
)

const resolvedValue = computed(() => (props.modelValue ?? '').toString())

function updateValue(value: string): void {
  emit('update:modelValue', value)
}

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement | null
  if (!target) {
    return
  }

  updateValue(target.value)
  emit('input', event as InputEvent)
}

function onChange(event: Event): void {
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

  if (event.key === 'Enter') {
    emit('enter', event)
  }
}

function onClear(): void {
  if (props.disabled || props.readonly) {
    return
  }

  updateValue('')
  emit('clear')
}
</script>

<template>
  <label :class="classes">
    <GText v-if="label" as="span" preset="header" class="ginput__label">
      {{ label }}
    </GText>

    <span class="ginput__field">
      <span v-if="$slots.prefix" class="ginput__prefix">
        <slot name="prefix" />
      </span>

      <input
        v-bind="attrs"
        :id="id"
        :name="name"
        :type="type"
        class="ginput__input"
        :value="resolvedValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :maxlength="maxlength"
        :minlength="minlength"
        :min="min"
        :max="max"
        :step="step"
        :autofocus="autofocus"
        :spellcheck="spellcheck"
        :aria-label="ariaLabel"
        :aria-invalid="error ? 'true' : undefined"
        @input="onInput"
        @change="onChange"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />

      <span v-if="$slots.suffix" class="ginput__suffix">
        <slot name="suffix" />
      </span>

      <button
        v-if="clearable && hasValue && !disabled && !readonly"
        type="button"
        class="ginput__clear"
        aria-label="Clear input"
        @click="onClear"
      >
        ×
      </button>
    </span>

    <span class="ginput__meta">
      <GText v-if="helper && !error" as="span" preset="muted" class="ginput__helper">
        {{ helper }}
      </GText>
      <GText v-if="error" as="span" preset="muted" class="ginput__helper ginput__helper--error">
        {{ error }}
      </GText>
    </span>
  </label>
</template>

<style scoped src="./GInput.css"></style>
