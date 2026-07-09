<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

import GText from '../GText/GText.vue'
import { buildGTextareaClasses, type GTextareaEmits, type GTextareaProps } from './GTextarea'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GTextareaProps>(), {
  preset: 'surface',
  size: 'md',
  width: 'auto',
  background: false,
  rows: 4,
  resize: 'vertical',
  disabled: false,
  readonly: false,
  autofocus: false,
  spellcheck: true,
  showCounter: true,
})

const attrs = useAttrs()
const emit = defineEmits<GTextareaEmits>()
const isFocused = ref(false)

const resolvedValue = computed(() => (props.modelValue ?? '').toString())
const hasValue = computed(() => resolvedValue.value.length > 0)
const counterText = computed(() => {
  const length = resolvedValue.value.length
  if (typeof props.maxlength === 'number' && Number.isFinite(props.maxlength)) {
    return `${length} / ${props.maxlength}`
  }

  return String(length)
})

const classes = computed(() =>
  buildGTextareaClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    background: props.background,
    disabled: props.disabled,
    readonly: props.readonly,
    focused: isFocused.value,
    hasValue: hasValue.value,
    hasError: Boolean(props.error),
    showCounter: props.showCounter,
  }),
)

const textareaStyle = computed(() => ({
  resize: props.resize,
}))

function updateValue(value: string): void {
  emit('update:modelValue', value)
}

function onInput(event: Event): void {
  const target = event.target as HTMLTextAreaElement | null
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
</script>

<template>
  <label :class="classes">
    <GText v-if="label" as="span" preset="header" class="gtextarea__label">
      {{ label }}
    </GText>

    <span class="gtextarea__field">
      <textarea
        v-bind="attrs"
        :id="id"
        :name="name"
        class="gtextarea__input"
        :value="resolvedValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :maxlength="maxlength"
        :minlength="minlength"
        :autofocus="autofocus"
        :spellcheck="spellcheck"
        :aria-label="ariaLabel"
        :aria-invalid="error ? 'true' : undefined"
        :style="textareaStyle"
        @input="onInput"
        @change="onChange"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />

      <span v-if="showCounter || $slots.counter" class="gtextarea__counter">
        <slot name="counter" :value="resolvedValue" :text="counterText">
          <GText v-if="showCounter" as="span" preset="caps" class="gtextarea__counter-text">
            {{ counterText }}
          </GText>
        </slot>
      </span>
    </span>

    <span class="gtextarea__meta">
      <GText v-if="helper && !error" as="span" preset="muted" class="gtextarea__helper">
        {{ helper }}
      </GText>
      <GText v-if="error" as="span" preset="muted" class="gtextarea__helper gtextarea__helper--error">
        {{ error }}
      </GText>
    </span>
  </label>
</template>

<style scoped src="./GTextarea.css"></style>
