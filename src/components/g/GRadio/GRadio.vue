<script setup lang="ts">
import { computed, ref, useAttrs, useSlots, watch } from 'vue'

import GText from '../GText/GText.vue'
import { buildGRadioClasses, type GRadioEmits, type GRadioProps } from './GRadio'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GRadioProps>(), {
  preset: 'surface',
  size: 'md',
  width: 'auto',
  variant: 'circle',
  background: false,
  disabled: false,
})

const attrs = useAttrs()
const slots = useSlots()
const emit = defineEmits<GRadioEmits>()
const inputRef = ref<HTMLInputElement | null>(null)
const radioId = computed(() => props.id || `gradio-${Math.random().toString(36).slice(2, 10)}`)

const checked = computed(() => props.modelValue === props.value)

const classes = computed(() =>
  buildGRadioClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    variant: props.variant,
    background: props.background,
    disabled: props.disabled,
    checked: checked.value,
    hasError: Boolean(props.error),
  }),
)

watch(
  () => props.modelValue,
  () => {
    if (inputRef.value) {
      inputRef.value.checked = checked.value
    }
  },
  { immediate: true },
)

function updateValue(event: Event): void {
  const target = event.target as HTMLInputElement | null
  if (!target || !target.checked) {
    return
  }

  emit('update:modelValue', props.value ?? true)
  emit('change', event, props.value ?? true)
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
    <span class="gradio__control">
      <input
        ref="inputRef"
        v-bind="attrs"
        :id="radioId"
        :name="name"
        class="gradio__input"
        type="radio"
        :value="value ?? true"
        :checked="checked"
        :disabled="disabled"
        :aria-label="ariaLabel"
        :aria-invalid="error ? 'true' : undefined"
        @change="updateValue"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />

      <span class="gradio__box" aria-hidden="true">
        <span class="gradio__mark"></span>
      </span>
    </span>

    <span class="gradio__content">
      <GText v-if="$slots.default || label" :text="label" as="span" preset="header" class="gradio__label">
        <slot />
      </GText>

      <span class="gradio__meta">
        <GText v-if="helper && !error" :text="helper" as="span" preset="muted" class="gradio__helper" />
        <GText v-if="error" :text="error" as="span" preset="muted" class="gradio__helper gradio__helper--error" />
      </span>
    </span>
  </label>
</template>

<style scoped src="./GRadio.css"></style>
