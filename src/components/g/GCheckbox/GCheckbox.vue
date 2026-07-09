<script setup lang="ts">
import { computed, ref, useAttrs, useSlots, watch } from 'vue'

import GText from '../GText/GText.vue'
import { buildGCheckboxClasses, type GCheckboxEmits, type GCheckboxProps } from './GCheckbox'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GCheckboxProps>(), {
  preset: 'surface',
  size: 'md',
  width: 'auto',
  background: false,
  disabled: false,
  indeterminate: false,
})

const attrs = useAttrs()
const slots = useSlots()
const emit = defineEmits<GCheckboxEmits>()
const inputRef = ref<HTMLInputElement | null>(null)
const checkboxId = computed(() => props.id || `gcheckbox-${Math.random().toString(36).slice(2, 10)}`)

const checked = computed(() => Boolean(props.modelValue))

const classes = computed(() =>
  buildGCheckboxClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    background: props.background,
    disabled: props.disabled,
    checked: checked.value,
    indeterminate: props.indeterminate,
    hasError: Boolean(props.error),
  }),
)

function syncIndeterminate(): void {
  if (inputRef.value) {
    inputRef.value.indeterminate = props.indeterminate
  }
}

watch(() => props.indeterminate, syncIndeterminate, { immediate: true })

function updateValue(event: Event): void {
  const target = event.target as HTMLInputElement | null
  if (!target) {
    return
  }

  emit('update:modelValue', target.checked)
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
    <span class="gcheckbox__control">
      <input
        ref="inputRef"
        v-bind="attrs"
        :id="checkboxId"
        :name="name"
        class="gcheckbox__input"
        type="checkbox"
        :checked="checked"
        :disabled="disabled"
        :aria-label="ariaLabel"
        :aria-invalid="error ? 'true' : undefined"
        @change="updateValue"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />

      <span class="gcheckbox__box" aria-hidden="true">
        <span class="gcheckbox__mark"></span>
      </span>
    </span>

    <span class="gcheckbox__content">
      <GText v-if="$slots.default || label" as="span" preset="header" class="gcheckbox__label">
        <slot>{{ label }}</slot>
      </GText>

      <span class="gcheckbox__meta">
        <GText v-if="helper && !error" as="span" preset="muted" class="gcheckbox__helper">
          {{ helper }}
        </GText>
        <GText v-if="error" as="span" preset="muted" class="gcheckbox__helper gcheckbox__helper--error">
          {{ error }}
        </GText>
      </span>
    </span>
  </label>
</template>

<style scoped src="./GCheckbox.css"></style>
