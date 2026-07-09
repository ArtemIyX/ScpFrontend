<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, watch } from 'vue'

import GScroller from '../GScroller/GScroller.vue'
import GText from '../GText/GText.vue'
import {
  buildGMenuListClasses,
  isMenuListItem,
  isMenuListSeparator,
  type GMenuListEmits,
  type GMenuListEntry,
  type GMenuListItem,
  type GMenuListProps,
} from './GMenuList'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<GMenuListProps>(), {
  items: () => [],
  preset: 'surface',
  size: 'md',
  width: 'auto',
  maxHeight: '18rem',
  background: false,
  disabled: false,
  readonly: false,
})

const attrs = useAttrs()
const emit = defineEmits<GMenuListEmits>()
const rootRef = ref<HTMLElement | null>(null)
const activeIndex = ref(-1)
const listId = `gmenulist-${Math.random().toString(36).slice(2, 10)}`

const classes = computed(() =>
  buildGMenuListClasses({
    preset: props.preset,
    size: props.size,
    width: props.width,
    background: props.background,
    disabled: props.disabled,
    readonly: props.readonly,
  }),
)

const activeItem = computed(() => {
  if (activeIndex.value < 0) {
    return null
  }

  const entry = props.items[activeIndex.value]
  return entry && isMenuListItem(entry) ? entry : null
})

function isSelected(entry: GMenuListItem): boolean {
  return entry.value === props.modelValue || Boolean(entry.selected)
}

function firstEnabledIndex(): number {
  return props.items.findIndex((entry) => isMenuListItem(entry) && !entry.disabled)
}

function syncActiveIndex(): void {
  const selectedIndex = props.items.findIndex((entry) => isMenuListItem(entry) && isSelected(entry))
  if (selectedIndex >= 0) {
    activeIndex.value = selectedIndex
    return
  }

  activeIndex.value = firstEnabledIndex()
}

function setActiveIndex(index: number): void {
  if (index < 0 || index >= props.items.length) {
    return
  }

  const entry = props.items[index]
  if (!entry || isMenuListSeparator(entry) || entry.disabled) {
    return
  }

  activeIndex.value = index
  void nextTick(() => {
    rootRef.value
      ?.querySelector<HTMLElement>(`[data-gmenulist-index="${index}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  })
}

function moveActive(step: number): void {
  if (props.items.length === 0) {
    return
  }

  let index = activeIndex.value
  for (let attempts = 0; attempts < props.items.length; attempts += 1) {
    index = index < 0 ? (step > 0 ? 0 : props.items.length - 1) : index + step
    if (index < 0) {
      index = props.items.length - 1
    }
    if (index >= props.items.length) {
      index = 0
    }

    const entry = props.items[index]
    if (entry && isMenuListItem(entry) && !entry.disabled) {
      setActiveIndex(index)
      return
    }
  }
}

function selectItem(item: GMenuListItem): void {
  if (props.disabled || props.readonly || item.disabled) {
    return
  }

  emit('update:modelValue', item.value)
  emit('select', item)
}

function onItemClick(item: GMenuListItem): void {
  emit('itemClick', item)
  selectItem(item)
}

function onKeydown(event: KeyboardEvent): void {
  emit('keydown', event)

  if (props.disabled || props.readonly) {
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      moveActive(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      moveActive(-1)
      break
    case 'Home':
      event.preventDefault()
      setActiveIndex(firstEnabledIndex())
      break
    case 'End':
      event.preventDefault()
      for (let index = props.items.length - 1; index >= 0; index -= 1) {
        const entry = props.items[index]
        if (entry && isMenuListItem(entry) && !entry.disabled) {
          setActiveIndex(index)
          break
        }
      }
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (activeItem.value) {
        selectItem(activeItem.value)
      }
      break
  }
}

function onFocus(event: FocusEvent): void {
  emit('focus', event)
}

function onBlur(event: FocusEvent): void {
  emit('blur', event)
}

watch(
  () => [props.items, props.modelValue],
  () => {
    syncActiveIndex()
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <section
    :class="classes"
    :style="{ '--gmenulist-max-height': maxHeight }"
    ref="rootRef"
    role="listbox"
    :aria-label="ariaLabel || label || title || 'Menu list'"
    :aria-disabled="disabled ? 'true' : undefined"
    :tabindex="disabled ? -1 : 0"
    v-bind="attrs"
    @keydown="onKeydown"
    @focus="onFocus"
    @blur="onBlur"
  >
    <div v-if="label || helper" class="gmenulist__header">
      <GText v-if="label" as="span" preset="header" class="gmenulist__label">
        {{ label }}
      </GText>
      <GText v-if="helper" as="span" preset="muted" class="gmenulist__helper">
        {{ helper }}
      </GText>
    </div>

    <div class="gmenulist__frame">
      <GScroller class="gmenulist__scroller" :track="true">
        <div class="gmenulist__list">
          <template v-for="(entry, index) in items" :key="index">
            <div v-if="isMenuListSeparator(entry)" class="gmenulist__separator" role="separator">
              <span v-if="entry.label">{{ entry.label }}</span>
            </div>

            <button
              v-else
              :data-gmenulist-index="index"
              type="button"
              class="gmenulist__item"
              :class="[
                `gmenulist__item--${entry.tone || 'default'}`,
                {
                  'gmenulist__item--active': index === activeIndex,
                  'gmenulist__item--selected': isSelected(entry),
                  'gmenulist__item--disabled': entry.disabled,
                },
              ]"
              role="option"
              :aria-selected="isSelected(entry) ? 'true' : 'false'"
              :disabled="disabled || readonly || entry.disabled"
              @mousemove="setActiveIndex(index)"
              @mousedown.prevent
              @click="onItemClick(entry)"
            >
              <slot name="item" :item="entry" :index="index" :selected="isSelected(entry)" :active="index === activeIndex">
                <span class="gmenulist__item-main">
                  <span class="gmenulist__item-topline">
                    <span class="gmenulist__item-label">{{ entry.label }}</span>
                    <span v-if="entry.meta" class="gmenulist__item-meta">{{ entry.meta }}</span>
                  </span>

                  <span v-if="entry.description" class="gmenulist__item-description">
                    {{ entry.description }}
                  </span>
                </span>

                <span class="gmenulist__item-trailing">
                  <span v-if="entry.badge" class="gmenulist__item-badge">
                    {{ entry.badge }}
                  </span>
                  <span v-if="entry.shortcut" class="gmenulist__item-shortcut">
                    {{ entry.shortcut }}
                  </span>
                </span>
              </slot>
            </button>
          </template>
        </div>
      </GScroller>
    </div>
  </section>
</template>

<style scoped src="./GMenuList.css"></style>
