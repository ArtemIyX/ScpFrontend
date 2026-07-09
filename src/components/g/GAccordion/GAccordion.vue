<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'

import GBadge from '../GBadge/GBadge.vue'
import GIcon from '../GIcon/GIcon.vue'
import GText from '../GText/GText.vue'
import { buildGAccordionClasses, type GAccordionEmits, type GAccordionItem, type GAccordionProps, type GAccordionValue } from './GAccordion'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GAccordionProps>(), {
  items: () => [],
  multiple: false,
  preset: 'quiet',
  variant: 'soft',
  size: 'md',
  width: 'auto',
  background: false,
  flush: false,
})

const attrs = useAttrs()
const emit = defineEmits<GAccordionEmits>()
const openValues = ref<GAccordionValue[]>([])

const classes = computed(() =>
  buildGAccordionClasses({
    preset: props.preset,
    variant: props.variant,
    size: props.size,
    width: props.width,
    background: props.background,
    flush: props.flush,
  }),
)

function normalizeValue(value: GAccordionProps['modelValue']): GAccordionValue[] {
  if (Array.isArray(value)) {
    return value
  }

  if (value === null || value === undefined) {
    return []
  }

  return [value]
}

function syncFromModelValue(): void {
  openValues.value = normalizeValue(props.modelValue)
}

function isOpen(item: GAccordionItem): boolean {
  return openValues.value.includes(item.value)
}

function emitModelValue(): void {
  const value = props.multiple ? openValues.value.slice() : openValues.value[0] ?? null
  emit('update:modelValue', value)
  const firstItem = openValues.value.length > 0 ? props.items.find((item) => item.value === openValues.value[0]) ?? null : null
  emit('change', value, firstItem)
}

function toggleItem(item: GAccordionItem): void {
  if (item.disabled) {
    return
  }

  const currentlyOpen = isOpen(item)

  if (props.multiple) {
    openValues.value = currentlyOpen
      ? openValues.value.filter((value) => value !== item.value)
      : [...openValues.value, item.value]
  } else {
    openValues.value = currentlyOpen ? [] : [item.value]
  }

  emitModelValue()
  if (currentlyOpen) {
    emit('close', item)
  } else {
    emit('open', item)
  }
}

function onKeydown(event: KeyboardEvent): void {
  emit('keydown', event)
}

watch(
  () => props.modelValue,
  () => syncFromModelValue(),
  { immediate: true, deep: true },
)
</script>

<template>
  <div :class="classes" v-bind="attrs">
    <div class="gaccordion__list" role="presentation">
      <article
        v-for="item in items"
        :key="item.value"
        class="gaccordion__item"
        :class="{
          'gaccordion__item--open': isOpen(item),
          'gaccordion__item--disabled': item.disabled,
        }"
      >
        <button
          type="button"
          class="gaccordion__trigger"
          :aria-expanded="isOpen(item) ? 'true' : 'false'"
          :aria-disabled="item.disabled ? 'true' : undefined"
          @click="toggleItem(item)"
          @keydown="onKeydown"
        >
          <span class="gaccordion__trigger-main">
            <span v-if="item.icon || item.iconSrc" class="gaccordion__icon" aria-hidden="true">
              <GIcon v-if="item.iconSrc" :src="item.iconSrc" preset="quiet" />
              <GIcon v-else :name="item.icon" preset="quiet" />
            </span>

            <span class="gaccordion__trigger-text">
              <GText as="span" preset="header" class="gaccordion__title">
                {{ item.title }}
              </GText>
              <GText v-if="item.subtitle" as="span" preset="muted" class="gaccordion__subtitle">
                {{ item.subtitle }}
              </GText>
            </span>
          </span>

          <span class="gaccordion__trigger-aside">
            <GBadge v-if="item.badge !== undefined" preset="quiet" variant="outline">
              {{ item.badge }}
            </GBadge>
            <span class="gaccordion__chevron" aria-hidden="true"></span>
          </span>
        </button>

        <transition name="gaccordion-fade">
          <div v-if="isOpen(item)" class="gaccordion__panel">
            <slot name="item" :item="item" :open="true" :close="() => toggleItem(item)">
              <div class="gaccordion__body">
                <GText v-if="item.note" preset="body">
                  {{ item.note }}
                </GText>
                <slot name="content" :item="item" :open="true" :close="() => toggleItem(item)" />
              </div>
            </slot>
          </div>
        </transition>
      </article>
    </div>
  </div>
</template>

<style scoped src="./GAccordion.css"></style>
