<script setup lang="ts">
import { computed } from 'vue'

import GButton from '../GButton/GButton.vue'
import GText from '../GText/GText.vue'
import { buildGToastClasses, type GToastEmits, type GToastProps } from './GToast'

const props = withDefaults(defineProps<GToastProps>(), {
  preset: 'quiet',
  variant: 'soft',
  size: 'md',
  closable: false,
  showCloseButton: true,
  closeLabel: 'Dismiss toast',
  as: 'article',
  role: 'status',
})

const emit = defineEmits<GToastEmits>()

const as = computed(() => props.as)
const classes = computed(() =>
  buildGToastClasses({
    preset: props.preset,
    variant: props.variant,
    size: props.size,
    closable: props.closable,
  }),
)

const hasHeader = computed(() => Boolean(props.title || props.status || props.closable || false))
const liveRole = computed(() => props.role)

function onClose(): void {
  if (!props.closable) {
    return
  }

  emit('close', 'button')
}
</script>

<template>
  <component
    :is="as"
    :class="classes"
    :role="liveRole"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @keydown="emit('keydown', $event)"
    @pointerenter="emit('pointerenter', $event)"
    @pointerleave="emit('pointerleave', $event)"
  >
    <div class="gtoast__accent" aria-hidden="true"></div>

    <div class="gtoast__shell">
      <div v-if="$slots.icon" class="gtoast__icon" aria-hidden="true">
        <slot name="icon" />
      </div>

      <div class="gtoast__content">
        <header v-if="$slots.header || hasHeader" class="gtoast__header">
          <slot name="header" :close="onClose">
            <div class="gtoast__heading">
              <GText v-if="title" as="span" preset="header" class="gtoast__title">
                {{ title }}
              </GText>
              <GText v-if="status" as="span" preset="caps" class="gtoast__status">
                {{ status }}
              </GText>
            </div>

            <div class="gtoast__chrome">
              <GButton
                v-if="showCloseButton && closable"
                preset="ghost"
                shape="chip"
                icon-only
                :aria-label="closeLabel"
                @click="onClose"
              >
                <template #icon>
                  <span class="gtoast__close-icon" aria-hidden="true"></span>
                </template>
              </GButton>
            </div>
          </slot>
        </header>

        <div class="gtoast__message">
          <slot>{{ message }}</slot>
        </div>

        <footer v-if="$slots.footer" class="gtoast__footer">
          <slot name="footer" :close="onClose" />
        </footer>
      </div>
    </div>
  </component>
</template>

<style scoped src="./GToast.css"></style>
