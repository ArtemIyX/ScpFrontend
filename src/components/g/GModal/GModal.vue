<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'

import GButton from '../GButton/GButton.vue'
import GText from '../GText/GText.vue'
import { buildGModalClasses, type GModalEmits, type GModalProps } from './GModal'

const props = withDefaults(defineProps<GModalProps>(), {
  modelValue: false,
  padding: 'md',
  width: 'lg',
  height: 'auto',
  strong: true,
  closable: true,
  backdropClosable: true,
  escapeClosable: true,
  showCloseButton: true,
  closeLabel: 'Close modal',
  as: 'section',
})

const emit = defineEmits<GModalEmits>()

const isOpen = computed(() => Boolean(props.modelValue))
const as = computed(() => props.as)
const classes = computed(() =>
  buildGModalClasses({
    padding: props.padding,
    width: props.width,
    height: props.height,
    strong: props.strong,
  }),
)

function requestClose(reason: 'button' | 'backdrop' | 'escape' = 'button'): void {
  if (!props.closable) {
    return
  }

  emit('update:modelValue', false)
  emit('close', reason)
}

function onBackdropClick(event: MouseEvent): void {
  emit('backdropClick', event)
  if (props.backdropClosable) {
    requestClose('backdrop')
  }
}

function onKeydown(event: KeyboardEvent): void {
  emit('keydown', event)

  if (event.key === 'Escape') {
    emit('escape', event)
    if (props.escapeClosable) {
      event.preventDefault()
      requestClose('escape')
    }
  }
}

function onDocumentKeydown(event: KeyboardEvent): void {
  if (!isOpen.value) {
    return
  }

  onKeydown(event)
}

function lockBodyScroll(locked: boolean): void {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = locked ? 'hidden' : ''
}

watch(
  isOpen,
  (value) => {
    lockBodyScroll(value)
    if (value) {
      emit('open')
      document.addEventListener('keydown', onDocumentKeydown)
      return
    }

    document.removeEventListener('keydown', onDocumentKeydown)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  lockBodyScroll(false)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>

<template>
  <div v-if="isOpen" class="gmodal__backdrop" @click.self="onBackdropClick">
    <component
      :is="as"
      :class="classes"
      role="dialog"
      aria-modal="true"
      :aria-label="ariaLabel"
      :aria-describedby="ariaDescribedby"
    >
      <header
        v-if="$slots.header || title || subtitle || status || (showCloseButton && closable)"
        class="gmodal__header"
      >
        <slot name="header" :close="requestClose" :is-open="isOpen">
          <div class="gmodal__heading">
            <GText v-if="title" as="span" preset="title" class="gmodal__title">
              {{ title }}
            </GText>
            <GText v-if="subtitle" as="span" preset="muted" class="gmodal__subtitle">
              {{ subtitle }}
            </GText>
          </div>

          <div class="gmodal__chrome">
            <GText v-if="status" as="span" preset="caps" class="gmodal__status">
              {{ status }}
            </GText>

            <GButton
              v-if="showCloseButton && closable"
              preset="ghost"
              shape="chip"
              icon-only
              :aria-label="closeLabel"
              @click="requestClose('button')"
            >
              <template #icon>
                <span class="gmodal__close-icon" aria-hidden="true"></span>
              </template>
            </GButton>
          </div>
        </slot>
      </header>

      <div class="gmodal__body">
        <slot :close="requestClose" :is-open="isOpen" />
      </div>

      <footer v-if="$slots.footer" class="gmodal__footer">
        <slot name="footer" :close="requestClose" :is-open="isOpen" />
      </footer>
    </component>
  </div>
</template>

<style scoped src="./GModal.css"></style>
