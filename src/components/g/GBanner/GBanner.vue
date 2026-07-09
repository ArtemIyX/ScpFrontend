<script setup lang="ts">
import { computed, useSlots } from 'vue'

import GButton from '../GButton/GButton.vue'
import GIcon from '../GIcon/GIcon.vue'
import GText from '../GText/GText.vue'
import { buildGBannerClasses, type GBannerEmits, type GBannerProps } from './GBanner'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GBannerProps>(), {
  preset: 'quiet',
  variant: 'soft',
  size: 'md',
  width: 'auto',
  closable: false,
  showCloseButton: true,
  closeLabel: 'Dismiss banner',
  as: 'section',
})

const emit = defineEmits<GBannerEmits>()
const slots = useSlots()

const as = computed(() => props.as)
const classes = computed(() =>
  buildGBannerClasses({
    preset: props.preset,
    variant: props.variant,
    size: props.size,
    width: props.width,
    closable: props.closable,
    hasIcon: Boolean(props.icon || props.iconSrc || slots.icon),
  }),
)

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
    :aria-label="ariaLabel || title || message"
    :title="titleAttr"
    @click="emit('click', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @keydown="emit('keydown', $event)"
  >
    <div class="gbanner__accent" aria-hidden="true"></div>

    <div class="gbanner__shell">
      <div v-if="slots.icon || icon || iconSrc" class="gbanner__icon" aria-hidden="true">
        <slot name="icon">
          <GIcon v-if="iconSrc" :src="iconSrc" preset="quiet" />
          <GIcon v-else-if="icon" :name="icon" preset="quiet" />
        </slot>
      </div>

      <div class="gbanner__content">
        <header v-if="slots.header || title || closable" class="gbanner__header">
          <slot name="header" :close="onClose">
            <div class="gbanner__heading">
              <GText v-if="title" as="span" preset="header" class="gbanner__title">
                {{ title }}
              </GText>
            </div>

            <div class="gbanner__chrome">
              <GButton
                v-if="showCloseButton && closable"
                preset="ghost"
                shape="chip"
                icon-only
                :aria-label="closeLabel"
                @click="onClose"
              >
                <template #icon>
                  <span class="gbanner__close-icon" aria-hidden="true"></span>
                </template>
              </GButton>
            </div>
          </slot>
        </header>

        <div class="gbanner__message">
          <slot>{{ message }}</slot>
        </div>

        <footer v-if="slots.footer" class="gbanner__footer">
          <slot name="footer" :close="onClose" />
        </footer>
      </div>
    </div>
  </component>
</template>

<style scoped src="./GBanner.css"></style>
