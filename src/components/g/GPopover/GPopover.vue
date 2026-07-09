<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useSlots, watch } from 'vue'

import GButton from '../GButton/GButton.vue'
import GIcon from '../GIcon/GIcon.vue'
import GText from '../GText/GText.vue'
import { buildGPopoverClasses, type GPopoverEmits, type GPopoverProps } from './GPopover'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GPopoverProps>(), {
  modelValue: false,
  preset: 'quiet',
  variant: 'soft',
  size: 'md',
  placement: 'bottom',
  trigger: 'click',
  closable: false,
  outsideClosable: true,
  escapeClosable: true,
  showCloseButton: true,
  closeLabel: 'Dismiss popover',
})

const emit = defineEmits<GPopoverEmits>()
const slots = useSlots()
const rootRef = ref<HTMLElement | null>(null)

const isOpen = computed(() => Boolean(props.modelValue))
const classes = computed(() =>
  buildGPopoverClasses({
    preset: props.preset,
    variant: props.variant,
    size: props.size,
    placement: props.placement,
    open: isOpen.value,
    closable: props.closable,
    hasIcon: Boolean(props.icon || props.iconSrc || slots.icon),
  }),
)

function setOpen(next: boolean): void {
  if (next === isOpen.value) {
    return
  }

  emit('update:modelValue', next)
  if (next) {
    emit('open')
  } else {
    emit('close')
  }
}

function openPopover(): void {
  setOpen(true)
}

function closePopover(reason?: 'button' | 'outside' | 'escape'): void {
  if (!props.closable && reason === 'button') {
    return
  }

  emit('update:modelValue', false)
  emit('close', reason)
}

function togglePopover(): void {
  if (props.trigger !== 'click') {
    return
  }

  setOpen(!isOpen.value)
}

function onTriggerKeydown(event: KeyboardEvent): void {
  if (props.trigger !== 'click') {
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    togglePopover()
  }
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!isOpen.value || !props.outsideClosable) {
    return
  }

  const target = event.target as Node | null
  if (target && rootRef.value && !rootRef.value.contains(target)) {
    closePopover('outside')
  }
}

function onDocumentKeydown(event: KeyboardEvent): void {
  if (!isOpen.value) {
    return
  }

  emit('keydown', event)
  if (event.key === 'Escape' && props.escapeClosable) {
    event.preventDefault()
    closePopover('escape')
  }
}

function onFocus(event: FocusEvent): void {
  emit('focus', event)
}

function onBlur(event: FocusEvent): void {
  emit('blur', event)
}

function onClick(event: MouseEvent): void {
  emit('click', event)
  if (props.trigger === 'click') {
    togglePopover()
  }
}

watch(
  isOpen,
  (value) => {
    if (typeof document === 'undefined') {
      return
    }

    if (value) {
      document.addEventListener('pointerdown', onDocumentPointerDown, true)
      document.addEventListener('keydown', onDocumentKeydown)
      return
    }

    document.removeEventListener('pointerdown', onDocumentPointerDown, true)
    document.removeEventListener('keydown', onDocumentKeydown)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeof document === 'undefined') {
    return
  }

  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>

<template>
  <span ref="rootRef" :class="classes" @focusin="onFocus" @focusout="onBlur">
    <span class="gpopover__trigger" @keydown="onTriggerKeydown" @click="onClick">
      <slot name="trigger" :open="openPopover" :close="closePopover" :toggle="togglePopover" :is-open="isOpen">
        <slot name="default-trigger" />
      </slot>
    </span>

    <transition name="gpopover-fade">
      <section
        v-if="isOpen"
        class="gpopover__panel"
        @click.stop
        role="dialog"
        aria-modal="false"
        :aria-label="ariaLabel || title || message"
        :aria-describedby="ariaDescribedby"
      >
        <div class="gpopover__accent" aria-hidden="true"></div>

        <div class="gpopover__shell">
          <div v-if="slots.icon || icon || iconSrc" class="gpopover__icon" aria-hidden="true">
            <slot name="icon">
              <GIcon v-if="iconSrc" :src="iconSrc" preset="quiet" />
              <GIcon v-else-if="icon" :name="icon" preset="quiet" />
            </slot>
          </div>

          <div class="gpopover__content">
            <header v-if="slots.header || title || closable" class="gpopover__header">
              <slot name="header" :close="closePopover">
                <div class="gpopover__heading">
                  <GText v-if="title" as="span" preset="header" class="gpopover__title">
                    {{ title }}
                  </GText>
                </div>

                <div class="gpopover__chrome">
                  <GButton
                    v-if="showCloseButton && closable"
                    preset="ghost"
                    shape="chip"
                    icon-only
                    :aria-label="closeLabel"
                    @click.stop="closePopover('button')"
                  >
                    <template #icon>
                      <span class="gpopover__close-icon" aria-hidden="true"></span>
                    </template>
                  </GButton>
                </div>
              </slot>
            </header>

            <div class="gpopover__message">
              <slot>{{ message }}</slot>
            </div>

            <footer v-if="slots.footer" class="gpopover__footer">
              <slot name="footer" :close="closePopover" />
            </footer>
          </div>
        </div>
      </section>
    </transition>
  </span>
</template>

<style scoped src="./GPopover.css"></style>
