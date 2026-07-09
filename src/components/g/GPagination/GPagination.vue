<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import GButton from '../GButton/GButton.vue'
import GText from '../GText/GText.vue'
import { buildGPaginationClasses, type GPaginationEmits, type GPaginationItem, type GPaginationProps } from './GPagination'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GPaginationProps>(), {
  modelValue: 1,
  pageCount: 1,
  boundaryCount: 1,
  siblingCount: 1,
  showFirstLast: true,
  showPrevNext: true,
  disabled: false,
  preset: 'quiet',
  size: 'md',
  width: 'auto',
  background: false,
  firstLabel: 'First page',
  lastLabel: 'Last page',
  previousLabel: 'Previous page',
  nextLabel: 'Next page',
})

const attrs = useAttrs()
const emit = defineEmits<GPaginationEmits>()

const classes = computed(() =>
  buildGPaginationClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    background: props.background,
    disabled: props.disabled,
  }),
)

const currentPage = computed(() => clampPage(props.modelValue ?? 1))

function clampPage(page: number): number {
  if (props.pageCount <= 0) {
    return 1
  }

  return Math.min(Math.max(Math.trunc(page), 1), props.pageCount)
}

function goTo(page: number): void {
  if (props.disabled || props.pageCount <= 0) {
    return
  }

  const nextPage = clampPage(page)
  if (nextPage === currentPage.value) {
    return
  }

  emit('update:modelValue', nextPage)
  emit('change', nextPage)
}

function goPrevious(): void {
  if (currentPage.value <= 1 || props.disabled) {
    return
  }

  const page = currentPage.value - 1
  goTo(page)
  emit('previous', page)
}

function goNext(): void {
  if (currentPage.value >= props.pageCount || props.disabled) {
    return
  }

  const page = currentPage.value + 1
  goTo(page)
  emit('next', page)
}

function goFirst(): void {
  if (props.disabled) {
    return
  }

  goTo(1)
  emit('first', 1)
}

function goLast(): void {
  if (props.disabled) {
    return
  }

  const page = Math.max(props.pageCount, 1)
  goTo(page)
  emit('last', page)
}

function buildPageItems(): GPaginationItem[] {
  const total = Math.max(props.pageCount, 0)
  if (total <= 0) {
    return []
  }

  const current = currentPage.value
  const selected = new Set<number>()

  for (let page = 1; page <= total; page += 1) {
    const inBoundary = page <= props.boundaryCount || page > total - props.boundaryCount
    const inSibling = page >= current - props.siblingCount && page <= current + props.siblingCount
    if (inBoundary || inSibling) {
      selected.add(page)
    }
  }

  const pages = Array.from(selected).sort((a, b) => a - b)
  const items: GPaginationItem[] = []

  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index]
    if (page === undefined) {
      continue
    }
    const previous = pages[index - 1]
    if (previous !== undefined && page - previous > 1) {
      items.push({
        label: '…',
        ellipsis: true,
        disabled: true,
      })
    }

    items.push({
      value: page,
      label: `${page}`,
      current: page === current,
    })
  }

  return items
}

const pageItems = computed(() => buildPageItems())

function onKeydown(event: KeyboardEvent): void {
  emit('keydown', event)
}
</script>

<template>
  <nav :class="classes" :aria-label="ariaLabel || 'Pagination'" v-bind="attrs">
    <div class="gpagination__shell" @keydown="onKeydown">
      <GButton
        v-if="showFirstLast"
        preset="ghost"
        size="sm"
        shape="chip"
        icon-only
        :disabled="disabled || currentPage <= 1"
        :aria-label="firstLabel"
        @click="goFirst"
      >
        <span class="gpagination__chevron gpagination__chevron--first" aria-hidden="true"></span>
      </GButton>

      <GButton
        v-if="showPrevNext"
        preset="ghost"
        size="sm"
        shape="chip"
        icon-only
        :disabled="disabled || currentPage <= 1"
        :aria-label="previousLabel"
        @click="goPrevious"
      >
        <span class="gpagination__chevron gpagination__chevron--prev" aria-hidden="true"></span>
      </GButton>

      <ol class="gpagination__list">
        <li v-for="(item, index) in pageItems" :key="`${item.label}-${index}`" class="gpagination__item">
          <span v-if="item.ellipsis" class="gpagination__ellipsis" aria-hidden="true">{{ item.label }}</span>

          <template v-else>
            <slot name="item" :item="item" :page="item.value" :active="item.current" :go-to="goTo">
              <button
                type="button"
                class="gpagination__page"
                :class="{ 'gpagination__page--active': item.current }"
                :disabled="disabled"
                :aria-current="item.current ? 'page' : undefined"
                @click="goTo(item.value || 1)"
              >
                <GText as="span" preset="header" class="gpagination__label">
                  {{ item.label }}
                </GText>
              </button>
            </slot>
          </template>
        </li>
      </ol>

      <GButton
        v-if="showPrevNext"
        preset="ghost"
        size="sm"
        shape="chip"
        icon-only
        :disabled="disabled || currentPage >= Math.max(pageCount, 1)"
        :aria-label="nextLabel"
        @click="goNext"
      >
        <span class="gpagination__chevron gpagination__chevron--next" aria-hidden="true"></span>
      </GButton>

      <GButton
        v-if="showFirstLast"
        preset="ghost"
        size="sm"
        shape="chip"
        icon-only
        :disabled="disabled || currentPage >= Math.max(pageCount, 1)"
        :aria-label="lastLabel"
        @click="goLast"
      >
        <span class="gpagination__chevron gpagination__chevron--last" aria-hidden="true"></span>
      </GButton>
    </div>
  </nav>
</template>

<style scoped src="./GPagination.css"></style>
