<script setup lang="ts">
import { computed } from 'vue'

import GButton from '../GButton/GButton.vue'
import GText from '../GText/GText.vue'
import { buildGWindowClasses, type GWindowEmits, type GWindowProps } from './GWindow'

const props = withDefaults(defineProps<GWindowProps>(), {
  padding: 'md',
  width: 'auto',
  height: 'auto',
  strong: false,
  closable: false,
  as: 'section',
  closeLabel: 'Close window',
})

const emit = defineEmits<GWindowEmits>()

const as = computed(() => props.as)
const classes = computed(() =>
  buildGWindowClasses({
    padding: props.padding,
    width: props.width,
    height: props.height,
    strong: props.strong,
  }),
)
</script>

<template>
  <component :is="as" :class="classes">
    <header v-if="$slots.header || title || subtitle || status || closable" class="gwindow__header">
      <slot name="header">
        <div class="gwindow__heading">
          <GText v-if="title" as="span" preset="title" class="gwindow__title">
            {{ title }}
          </GText>
          <GText v-if="subtitle" as="span" preset="muted" class="gwindow__subtitle">
            {{ subtitle }}
          </GText>
        </div>

        <div class="gwindow__chrome">
          <GText v-if="status" as="span" preset="caps" class="gwindow__status">
            {{ status }}
          </GText>

          <GButton
            v-if="closable"
            preset="ghost"
            shape="chip"
            icon-only
            :aria-label="closeLabel"
            @click="emit('close', $event)"
          >
            <template #icon>
              <span class="gwindow__close-icon" aria-hidden="true"></span>
            </template>
          </GButton>
        </div>
      </slot>
    </header>

    <div class="gwindow__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="gwindow__footer">
      <slot name="footer" />
    </footer>
  </component>
</template>

<style scoped src="./GWindow.css"></style>
