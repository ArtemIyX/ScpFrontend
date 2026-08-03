<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

import GText from '../GText/GText.vue'
import { buildGSwitchClasses, type GSwitchEmits, type GSwitchProps } from './GSwitch'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GSwitchProps>(), {
  preset: 'surface',
  size: 'md',
  width: 'auto',
  background: false,
  disabled: false,
  showState: true,
  onLabel: 'On',
  offLabel: 'Off',
})

const attrs = useAttrs()
const emit = defineEmits<GSwitchEmits>()
const isFocused = ref(false)

const checked = computed(() => Boolean(props.modelValue))
const classes = computed(() =>
  buildGSwitchClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    background: props.background,
    disabled: props.disabled,
    checked: checked.value,
    hasError: Boolean(props.error),
    showState: props.showState,
  }),
)

const stateLabel = computed(() => (checked.value ? props.onLabel : props.offLabel))

function updateValue(event: Event): void {
  const target = event.target as HTMLInputElement | null
  if (!target) {
    return
  }

  emit('update:modelValue', target.checked)
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
</script>

<template>
  <label :class="classes">
    <div class="gswitch__head">
      <GText v-if="label" :text="label" as="span" preset="header" class="gswitch__label" />

      <div v-if="showState" class="gswitch__state">
        <GText :text="stateLabel" as="span" preset="caps" class="gswitch__state-text" />
      </div>
    </div>

    <div class="gswitch__field">
      <span class="gswitch__control">
        <input
          v-bind="attrs"
          :id="id"
          :name="name"
          class="gswitch__input"
          type="checkbox"
          role="switch"
          :checked="checked"
          :disabled="disabled"
          :aria-label="ariaLabel"
          :aria-checked="checked ? 'true' : 'false'"
          :aria-invalid="error ? 'true' : undefined"
          @change="updateValue"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onKeydown"
        />

        <span class="gswitch__track" :class="{ 'gswitch__track--focused': isFocused }" aria-hidden="true">
          <span class="gswitch__thumb"></span>
        </span>
      </span>
    </div>

    <span class="gswitch__meta">
      <GText v-if="helper && !error" :text="helper" as="span" preset="muted" class="gswitch__helper" />
      <GText v-if="error" :text="error" as="span" preset="muted" class="gswitch__helper gswitch__helper--error" />
    </span>
  </label>
</template>

<style scoped src="./GSwitch.css"></style>
