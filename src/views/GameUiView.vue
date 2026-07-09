<script setup lang="ts">
import { computed, ref } from 'vue'

const isActionDisabled = ref(true)
const nickname = ref('Operative 17')
const query = ref('containment log')
const clearanceCode = ref('')
const region = ref('eu-west')
const role = ref('medic')
const difficulty = ref('standard')
const activeTab = ref('menu')

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

const regionOptions = [
  { value: 'us-east', label: 'US East', description: 'Low ping for East Coast rooms.' },
  { value: 'eu-west', label: 'EU West', description: 'Default for the current demo.' },
  { value: 'asia', label: 'Asia', description: 'Useful for international lobbies.' },
] as const

const roleOptions = [
  { value: 'medic', label: 'Medic', description: 'Supports the team and revives allies.' },
  { value: 'guard', label: 'Guard', description: 'Handles doors, security, and escort tasks.' },
  { value: 'researcher', label: 'Researcher', description: 'Works with notes, samples, and terminals.' },
] as const

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'standard', label: 'Standard' },
  { value: 'hard', label: 'Hard' },
  { value: 'nightmare', label: 'Nightmare', description: 'Locked behind the scary stories.' },
] as const

const screenTabs = [
  { value: 'menu', label: 'Menu', description: 'Main navigation and quick actions.' },
  { value: 'lobby', label: 'Lobby', description: 'Players, settings, and ready state.' },
  { value: 'hud', label: 'HUD', description: 'Live in-game overlays and signals.' },
  { value: 'pause', label: 'Pause', description: 'Mid-session controls and resume.' },
] as const

const disabledLabel = computed(() => (isActionDisabled.value ? 'Disabled' : 'Enabled'))
const queryStatus = computed(() =>
  query.value.trim().length > 0
    ? 'Search input is active for logs, players, or object names.'
    : 'Search is empty.',
)

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
          GText, GButton, and GInput are the main building blocks for the in-game UI surface.
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
            Body text stays plain and calm for descriptions, notes, and system messages. Это
            текст для описаний и заметок. Це текст для описів і нотаток.
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

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GInput</p>
              <p class="debug-meta">
                Model binding, helper/error states, clear button, and prefix slots for in-game
                forms.
              </p>
            </div>
          </div>

          <div class="input-stack">
            <GInput
              v-model="nickname"
              label="Nickname"
              helper="Used for lobby, HUD tags, and 3D overhead names."
              placeholder="Enter player nickname"
              preset="surface"
              width="full"
              clearable
            />

            <GInput
              v-model="query"
              label="Search logs"
              helper="Search by object name, room, or local note."
              placeholder="Search containment log"
              preset="quiet"
              width="full"
              type="search"
            >
              <template #prefix>
                <span class="demo-icon demo-icon--search" aria-hidden="true"></span>
              </template>
            </GInput>

            <GInput
              v-model="clearanceCode"
              label="Clearance code"
              error="Access denied. Code must be six digits."
              placeholder="000000"
              preset="warning"
              width="full"
              inputmode="numeric"
            />

            <GInput
              model-value="Read only field"
              label="Locked field"
              helper="Disabled inputs can still show state without taking focus."
              preset="ghost"
              width="full"
              disabled
            />
          </div>

          <GText preset="muted" class="input-status" :text="queryStatus" />
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GCombo</p>
              <p class="debug-meta">
                Dropdown selection for region, role, and game mode with keyboard support.
              </p>
            </div>
          </div>

          <div class="input-stack">
            <GCombo
              v-model="region"
              label="Region"
              helper="Used by lobby matchmaking and reconnect flow."
              :options="regionOptions"
              preset="surface"
              width="full"
              clearable
            />

            <GCombo
              v-model="role"
              label="Role"
              helper="No clear button here, just a clean select for the same pattern."
              :options="roleOptions"
              preset="quiet"
              width="full"
            />

            <GCombo
              v-model="difficulty"
              label="Difficulty"
              error="Nightmare mode is not available in the current build."
              :options="difficultyOptions"
              preset="warning"
              width="full"
              clearable
            />
          </div>
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GTabs</p>
              <p class="debug-meta">
                Page switching for menu, lobby, HUD, and pause screens inside the game UI.
              </p>
            </div>
          </div>

          <GTabs v-model="activeTab" :tabs="screenTabs" preset="quiet" width="full">
            <template #default="{ activeTab: currentTab }">
              <div class="tabs-panel">
                <GText preset="header">
                  {{ currentTab?.label }}
                </GText>
                <GText preset="body">
                  {{ currentTab?.description }}
                </GText>

                <div class="tabs-grid">
                  <GButton preset="surface" background>
                    {{ currentTab?.value === 'menu' ? 'Start Session' : 'Return to Menu' }}
                  </GButton>
                  <GButton preset="ghost">
                    {{ currentTab?.value === 'pause' ? 'Resume Game' : 'Open Pause' }}
                  </GButton>
                  <GButton preset="purple" width="full">
                    {{ currentTab?.value === 'hud' ? 'HUD Live' : 'HUD Preview' }}
                  </GButton>
                </div>
              </div>
            </template>
          </GTabs>
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

.input-stack {
  display: grid;
  gap: 1rem;
}

.input-status {
  margin-top: 1rem;
}

.tabs-panel {
  display: grid;
  gap: 0.75rem;
}

.tabs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
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

.demo-icon--search {
  width: 0.8125rem;
  height: 0.8125rem;
  border: 0.125rem solid currentColor;
  border-radius: 50%;
}

.demo-icon--search::after {
  content: '';
  position: absolute;
  right: -0.25rem;
  bottom: -0.0625rem;
  width: 0.375rem;
  height: 0.125rem;
  background: currentColor;
  transform: rotate(45deg);
  transform-origin: right center;
}
</style>
