<script setup lang="ts">
import { computed, ref } from 'vue'

const isActionDisabled = ref(true)

const presetButtons = [
  { preset: 'surface', label: 'Surface' },
  { preset: 'accent', label: 'Accent' },
  { preset: 'danger', label: 'Danger' },
  { preset: 'warning', label: 'Warning' },
  { preset: 'purple', label: 'Purple' },
  { preset: 'ghost', label: 'Ghost' },
  { preset: 'quiet', label: 'Quiet' },
] as const

const sizeButtons = [
  { size: 'sm', label: 'Small' },
  { size: 'md', label: 'Medium' },
  { size: 'lg', label: 'Large' },
] as const

const shapeButtons = [
  { shape: 'soft', label: 'Soft' },
  { shape: 'block', label: 'Block' },
  { shape: 'chip', label: 'Chip' },
] as const

const disabledLabel = computed(() => (isActionDisabled.value ? 'Disabled' : 'Enabled'))

function toggleDisabled(): void {
  isActionDisabled.value = !isActionDisabled.value
}
</script>

<template>
  <div class="debug-shell">
    <div class="debug-frame debug-frame--fonts">
      <header class="debug-header ui-panel ui-panel--strong">
        <GText preset="header">Component showcases</GText>
        <GText preset="body">
          GText and GButton are the main building blocks for the in-game UI surface.
        </GText>
      </header>

      <GScroller class="game-scroll">
        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GButton</p>
              <p class="debug-meta">
                Presets, sizes, shapes, icon placement, icon-only mode, busy state, and a live
                disabled prop.
              </p>
            </div>
          </div>

          <div class="button-stack">
            <div class="button-row">
              <GButton preset="accent" size="lg" :disabled="isActionDisabled" @click="toggleDisabled">
                {{ disabledLabel }} launch
              </GButton>

              <GButton preset="ghost" @click="toggleDisabled">
                Toggle disabled
              </GButton>
            </div>

            <div class="button-grid">
              <GButton
                v-for="item in presetButtons"
                :key="item.preset"
                :preset="item.preset"
                text="Preset"
              >
                {{ item.label }} preset
              </GButton>
            </div>

            <div class="button-grid">
              <GButton preset="surface" background>Background tone</GButton>
              <GButton preset="purple" background>Background anomaly</GButton>
              <GButton preset="warning" background>Background warning</GButton>
            </div>

            <div class="button-grid">
              <GButton
                v-for="item in sizeButtons"
                :key="item.size"
                preset="surface"
                :size="item.size"
                text="Sized"
              >
                {{ item.label }} size
              </GButton>
            </div>

            <div class="button-grid">
              <GButton
                v-for="item in shapeButtons"
                :key="item.shape"
                preset="surface"
                :shape="item.shape"
              >
                {{ item.label }}
              </GButton>
            </div>

            <div class="button-grid">
              <GButton preset="surface">
                <template #icon-left>
                  <span class="demo-icon demo-icon--arrow" aria-hidden="true"></span>
                </template>
                Left icon
              </GButton>

              <GButton preset="surface">
                Right icon
                <template #icon-right>
                  <span class="demo-icon demo-icon--arrow" aria-hidden="true"></span>
                </template>
              </GButton>

              <GButton
                preset="ghost"
                shape="chip"
                icon-only
                aria-label="Close overlay"
              >
                <template #icon>
                  <span class="demo-icon demo-icon--close" aria-hidden="true"></span>
                </template>
              </GButton>

              <GButton preset="quiet" width="full" busy>Saving state</GButton>

              <GButton preset="danger" width="full" disabled>Unavailable</GButton>
            </div>
          </div>
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GText</p>
              <p class="debug-meta">Slot usage and preset text roles for UI and story text.</p>
            </div>
          </div>

          <GText preset="title">
            Containment Archive / Архив изоляции / Архів ізоляції
          </GText>
          <GText preset="body">
            Body text stays plain and calm for descriptions, notes, and system messages.
            Это текст для описаний и заметок. Це текст для описів і нотаток.
          </GText>
          <GText preset="caps">Warning / Тревога / Тривога</GText>
          <GText preset="handwrite">
            I left a note near the door. Не входить без допуска. Не заходити без доступу.
          </GText>
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GText technical</p>
              <p class="debug-meta">Text prop usage for logs, protocol blocks, and debug output.</p>
            </div>
          </div>

          <GText preset="header" text="Facility status, squad list, lobby name, pause heading" />
          <GText
            preset="technical"
            text="message UiEvent {\n  string localized_text_id = 1;\n  string websocket_state = 2;\n  uint32 protocol_version = 3;\n}\n\n// DEBUG: connected | payload_ready | ru-RU"
          />
          <GText
            preset="muted"
            text="This component keeps the API small now so buttons and combo boxes can follow the same pattern later."
          />
        </section>
      </GScroller>
    </div>
  </div>
</template>

<style scoped>
.game-scroll {
  display: block;
  height: 100%;
  min-height: 0;
}

.button-stack {
  display: grid;
  gap: 0.875rem;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 0.75rem;
}

.demo-icon {
  position: relative;
  display: inline-block;
  width: 0.875rem;
  height: 0.875rem;
  color: currentColor;
  flex: 0 0 auto;
}

.demo-icon--arrow {
  border-top: 0.125rem solid currentColor;
  border-right: 0.125rem solid currentColor;
  transform: rotate(45deg);
}

.demo-icon--close::before,
.demo-icon--close::after {
  content: '';
  position: absolute;
  inset: 50% auto auto 50%;
  width: 1rem;
  height: 0.125rem;
  background: currentColor;
  transform-origin: center;
}

.demo-icon--close::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.demo-icon--close::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>
