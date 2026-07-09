<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import GIcon from '../GIcon/GIcon.vue'
import GText from '../GText/GText.vue'
import { buildGBreadcrumbsClasses, type GBreadcrumbItem, type GBreadcrumbsEmits, type GBreadcrumbsProps } from './GBreadcrumbs'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GBreadcrumbsProps>(), {
  items: () => [],
  preset: 'quiet',
  size: 'md',
  width: 'auto',
  separator: 'chevron',
  background: false,
  truncate: false,
})

const attrs = useAttrs()
const emit = defineEmits<GBreadcrumbsEmits>()

const classes = computed(() =>
  buildGBreadcrumbsClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    background: props.background,
    truncate: props.truncate,
  }),
)

function isCurrent(item: GBreadcrumbItem): boolean {
  return Boolean(item.current)
}

function isClickable(item: GBreadcrumbItem): boolean {
  return !item.disabled && !isCurrent(item) && Boolean(item.href)
}

function onItemClick(event: MouseEvent, item: GBreadcrumbItem, index: number): void {
  if (!isClickable(item)) {
    event.preventDefault()
    return
  }

  emit('click', event, item, index)
  emit('select', item, index)
}
</script>

<template>
  <nav :class="classes" :aria-label="ariaLabel || 'Breadcrumbs'" v-bind="attrs">
    <ol class="gbreadcrumbs__list">
      <li v-for="(item, index) in items" :key="item.value ?? `${item.label}-${index}`" class="gbreadcrumbs__item">
        <span v-if="index > 0" class="gbreadcrumbs__separator" aria-hidden="true">
          <span v-if="separator === 'slash'">/</span>
          <span v-else-if="separator === 'dot'">•</span>
          <span v-else class="gbreadcrumbs__separator-icon"></span>
        </span>

        <component
          :is="item.href && !isCurrent(item) ? 'a' : 'span'"
          class="gbreadcrumbs__link"
          :class="{
            'gbreadcrumbs__link--current': isCurrent(item),
            'gbreadcrumbs__link--disabled': item.disabled,
            'gbreadcrumbs__link--clickable': isClickable(item),
          }"
          :href="isClickable(item) ? item.href : undefined"
          :target="isClickable(item) ? item.target : undefined"
          :rel="isClickable(item) ? item.rel : undefined"
          :aria-current="isCurrent(item) ? 'page' : undefined"
          :aria-disabled="item.disabled ? 'true' : undefined"
          :aria-label="item.ariaLabel || item.label"
          @click="onItemClick($event, item, index)"
        >
          <span v-if="item.icon || item.iconSrc" class="gbreadcrumbs__icon" aria-hidden="true">
            <GIcon v-if="item.iconSrc" :src="item.iconSrc" preset="quiet" size="sm" />
            <GIcon v-else :name="item.icon" preset="quiet" size="sm" />
          </span>

          <span class="gbreadcrumbs__label-wrap">
            <GText as="span" preset="body" class="gbreadcrumbs__label">
              {{ item.label }}
            </GText>
            <GText v-if="item.meta" as="span" preset="caps" class="gbreadcrumbs__meta">
              {{ item.meta }}
            </GText>
          </span>
        </component>
      </li>
    </ol>
  </nav>
</template>

<style scoped src="./GBreadcrumbs.css"></style>
