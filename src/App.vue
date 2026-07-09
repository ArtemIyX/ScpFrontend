<script setup lang="ts">
const groups = [
  {
    title: 'Neutral',
    items: [
      'ui-black',
      'ui-white',
      'ui-neutral-0',
      'ui-neutral-50',
      'ui-neutral-100',
      'ui-neutral-200',
      'ui-neutral-300',
      'ui-neutral-400',
      'ui-neutral-500',
      'ui-neutral-600',
      'ui-neutral-700',
      'ui-neutral-800',
      'ui-neutral-900',
      'ui-neutral-950',
    ],
  },
  {
    title: 'Surface',
    items: ['ui-surface-0', 'ui-surface-1', 'ui-surface-2', 'ui-surface-3', 'ui-surface-4'],
  },
  {
    title: 'Lime',
    items: [
      'ui-accent-lime-50',
      'ui-accent-lime-100',
      'ui-accent-lime-200',
      'ui-accent-lime-300',
      'ui-accent-lime-400',
      'ui-accent-lime-500',
      'ui-accent-lime-600',
      'ui-accent-lime-700',
      'ui-accent-lime-800',
      'ui-accent-lime-900',
    ],
  },
  {
    title: 'Cyan',
    items: [
      'ui-accent-cyan-50',
      'ui-accent-cyan-100',
      'ui-accent-cyan-200',
      'ui-accent-cyan-300',
      'ui-accent-cyan-400',
      'ui-accent-cyan-500',
      'ui-accent-cyan-600',
      'ui-accent-cyan-700',
      'ui-accent-cyan-800',
      'ui-accent-cyan-900',
    ],
  },
  {
    title: 'Blue',
    items: [
      'ui-accent-blue-50',
      'ui-accent-blue-100',
      'ui-accent-blue-200',
      'ui-accent-blue-300',
      'ui-accent-blue-400',
      'ui-accent-blue-500',
      'ui-accent-blue-600',
      'ui-accent-blue-700',
      'ui-accent-blue-800',
      'ui-accent-blue-900',
    ],
  },
  {
    title: 'Violet',
    items: [
      'ui-accent-violet-50',
      'ui-accent-violet-100',
      'ui-accent-violet-200',
      'ui-accent-violet-300',
      'ui-accent-violet-400',
      'ui-accent-violet-500',
      'ui-accent-violet-600',
      'ui-accent-violet-700',
      'ui-accent-violet-800',
      'ui-accent-violet-900',
    ],
  },
  {
    title: 'Pink',
    items: [
      'ui-accent-pink-50',
      'ui-accent-pink-100',
      'ui-accent-pink-200',
      'ui-accent-pink-300',
      'ui-accent-pink-400',
      'ui-accent-pink-500',
      'ui-accent-pink-600',
      'ui-accent-pink-700',
      'ui-accent-pink-800',
      'ui-accent-pink-900',
    ],
  },
  {
    title: 'Success',
    items: [
      'ui-status-success-50',
      'ui-status-success-100',
      'ui-status-success-200',
      'ui-status-success-300',
      'ui-status-success-400',
      'ui-status-success-500',
      'ui-status-success-600',
      'ui-status-success-700',
      'ui-status-success-800',
      'ui-status-success-900',
    ],
  },
  {
    title: 'Warning',
    items: [
      'ui-status-warning-50',
      'ui-status-warning-100',
      'ui-status-warning-200',
      'ui-status-warning-300',
      'ui-status-warning-400',
      'ui-status-warning-500',
      'ui-status-warning-600',
      'ui-status-warning-700',
      'ui-status-warning-800',
      'ui-status-warning-900',
    ],
  },
  {
    title: 'Danger',
    items: [
      'ui-status-danger-50',
      'ui-status-danger-100',
      'ui-status-danger-200',
      'ui-status-danger-300',
      'ui-status-danger-400',
      'ui-status-danger-500',
      'ui-status-danger-600',
      'ui-status-danger-700',
      'ui-status-danger-800',
      'ui-status-danger-900',
    ],
  },
] as const
</script>

<template>
  <div class="ui-shell debug-shell">
    <div class="debug-frame">
      <header class="debug-header ui-panel ui-panel--strong">
        <p class="ui-heading">Debug palette</p>
        <p class="ui-copy">
          Transparent by default. This screen exists to expose every core CSS variable and shade.
        </p>
      </header>

      <main class="debug-grid ui-scroll">
        <section class="debug-card ui-panel" v-for="group in groups" :key="group.title">
          <div class="debug-card-head">
            <p class="ui-heading">{{ group.title }}</p>
            <p class="debug-meta">{{ group.items.length }} shades</p>
          </div>
          <div class="debug-swatch-grid">
            <div v-for="name in group.items" :key="name" class="debug-swatch">
              <div class="debug-color" :style="{ backgroundColor: `var(--${name})` }"></div>
              <div class="debug-labels">
                <span class="debug-var">{{ name }}</span>
                <span class="debug-token">var(--{{ name }})</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer class="debug-footer ui-panel">
        <div>
          <p class="ui-heading">Global tokens</p>
          <p class="ui-copy">Background stays transparent. All other surfaces come from token CSS.</p>
        </div>
        <div class="debug-footer-samples">
          <span class="debug-chip" style="--chip-color: var(--ui-fill-accent)">accent fill</span>
          <span class="debug-chip" style="--chip-color: var(--ui-fill-warning)">warning fill</span>
          <span class="debug-chip" style="--chip-color: var(--ui-fill-danger)">danger fill</span>
          <span class="debug-chip" style="--chip-color: var(--ui-fill-info)">info fill</span>
          <span class="debug-chip" style="--chip-color: var(--ui-fill-success)">success fill</span>
        </div>
      </footer>
    </div>
  </div>
</template>
