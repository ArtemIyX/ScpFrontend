<script setup lang="ts">
import { computed, ref } from 'vue'

const isActionDisabled = ref(true)
const nickname = ref('Operative 17')
const query = ref('containment log')
const briefingNote = ref('Report to decontamination and then meet the team in the lower corridor.')
const radioLog = ref('Door sealed. Lights down. Waiting for the next checkpoint.')
const clearanceCode = ref('')
const masterVolume = ref(72)
const sensitivity = ref(42)
const threatLevel = ref(18)
const progressLoad = ref(64)
const progressScan = ref(31)
const progressRing = ref(88)
const itemCount = ref(12)
const splitAmount = ref(2.5)
const soundEnabled = ref(true)
const subtitlesEnabled = ref(true)
const playerNamesEnabled = ref(false)
const motionBlurEnabled = ref(false)
const nightVisionEnabled = ref(true)
const autoLootEnabled = ref(false)
const voiceChatEnabled = ref(true)
const missionStyle = ref<'stealth' | 'assault' | 'panic'>('stealth')
const feedStyle = ref<'circle' | 'square' | 'lever'>('square')
const powerState = ref<'on' | 'off'>('on')
const region = ref('eu-west')
const role = ref('medic')
const difficulty = ref('standard')
const graphicsQuality = ref<'low' | 'medium' | 'high' | 'epic' | 'cinematic'>('high')
const activeTab = ref('menu')
const modalOpen = ref(false)
const modalMode = ref<'standard' | 'no-button' | 'locked'>('standard')
const modalEvent = ref('No modal events yet.')

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

const graphicsQualityOptions = [
  { value: 'low', title: 'Low', subtitle: 'Best performance', meta: 'Fast' },
  { value: 'medium', title: 'Medium', subtitle: 'Balanced defaults', meta: 'Stable' },
  { value: 'high', title: 'High', subtitle: 'Recommended preset', meta: 'Recommended', recommended: true, preset: 'accent' },
  { value: 'epic', title: 'Epic', subtitle: 'Sharper lighting and textures', meta: 'Heavy', preset: 'purple' },
  { value: 'cinematic', title: 'Cinematic', subtitle: 'Maximum visual quality', meta: 'Largest load', preset: 'warning' },
] as const

const screenTabs = [
  { value: 'menu', label: 'Menu', description: 'Main navigation and quick actions.' },
  { value: 'lobby', label: 'Lobby', description: 'Players, settings, and ready state.' },
  { value: 'hud', label: 'HUD', description: 'Live in-game overlays and signals.' },
  { value: 'pause', label: 'Pause', description: 'Mid-session controls and resume.' },
] as const

const panelStats = [
  { label: 'Players Ready', value: '6 / 8' },
  { label: 'Containment', value: 'Stable' },
  { label: 'Protocol', value: 'Live' },
] as const

type BadgeItem = {
  text: string
  preset: 'neutral' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
  variant?: 'solid' | 'soft' | 'outline'
  dot?: boolean
}

const badgeItems: BadgeItem[] = [
  { text: 'Ready', preset: 'accent', dot: true },
  { text: 'Alert', preset: 'warning', dot: true },
  { text: 'Danger', preset: 'danger', dot: true },
  { text: 'Paused', preset: 'purple', variant: 'outline' },
  { text: 'Offline', preset: 'ghost', variant: 'outline' },
  { text: 'Live', preset: 'neutral', variant: 'solid' },
] as const

const windowActions = [
  { label: 'Apply', preset: 'accent' },
  { label: 'Back', preset: 'ghost' },
] as const

type ToastItem = {
  title: string
  message: string
  status: string
  preset: 'neutral' | 'accent' | 'danger' | 'warning' | 'purple' | 'ghost' | 'quiet'
  variant?: 'solid' | 'soft' | 'outline'
  footer?: boolean
}

const toastItems: ToastItem[] = [
  {
    title: 'Connection stable',
    message: 'Web socket handshake finished and the UI can now receive gameplay state.',
    status: 'Live',
    preset: 'accent',
    footer: true,
  },
  {
    title: 'Clearance update',
    message: 'The current squad is missing one field entry before the match can begin.',
    status: 'Warning',
    preset: 'warning',
  },
  {
    title: 'Containment breach',
    message: 'This is the higher urgency variant with a darker frame and a harder edge.',
    status: 'Alert',
    preset: 'danger',
    variant: 'solid',
  },
  {
    title: 'Document sync',
    message: 'Localized text and image payloads can arrive through the Unreal HTTP bridge.',
    status: 'Quiet',
    preset: 'quiet',
    variant: 'outline',
  },
] as const

const modalModes = [
  {
    key: 'standard',
    label: 'Standard',
    description: 'X button, backdrop close, and escape close.',
  },
  {
    key: 'no-button',
    label: 'Header Only',
    description: 'Backdrop close on, no X button.',
  },
  {
    key: 'locked',
    label: 'Locked',
    description: 'No X button and no backdrop close.',
  },
] as const

const modalConfig = computed(() => {
  switch (modalMode.value) {
    case 'no-button':
      return {
        title: 'Header Only Modal',
        subtitle: 'The modal still closes on backdrop and Escape, but has no X button.',
        status: 'Backdrop close',
        closable: true,
        backdropClosable: true,
        escapeClosable: true,
        showCloseButton: false,
      }
    case 'locked':
      return {
        title: 'Locked Modal',
        subtitle: 'This one is intentionally persistent until footer action closes it.',
        status: 'Locked',
        closable: false,
        backdropClosable: false,
        escapeClosable: false,
        showCloseButton: false,
      }
    default:
      return {
        title: 'Standard Modal',
        subtitle: 'The usual framework behavior with all close paths enabled.',
        status: 'Closable',
        closable: true,
        backdropClosable: true,
        escapeClosable: true,
        showCloseButton: true,
      }
  }
})

const disabledLabel = computed(() => (isActionDisabled.value ? 'Disabled' : 'Enabled'))
const queryStatus = computed(() =>
  query.value.trim().length > 0
    ? 'Search input is active for logs, players, or object names.'
    : 'Search is empty.',
)

const textareaSummary = computed(
  () => `Briefing ${briefingNote.value.length} chars / Log ${radioLog.value.length} chars`,
)

const sliderSummary = computed(
  () => `Volume ${masterVolume.value} / Sensitivity ${sensitivity.value} / Threat ${threatLevel.value}`,
)

const progressSummary = computed(
  () => `Load ${progressLoad.value}% / Scan ${progressScan.value}% / Core ${progressRing.value}%`,
)

const numberSummary = computed(
  () => `Items ${itemCount.value} / Split ${splitAmount.value.toFixed(1)}`,
)

const checkboxSummary = computed(() => {
  const enabledCount = [soundEnabled.value, subtitlesEnabled.value, playerNamesEnabled.value, motionBlurEnabled.value].filter(Boolean).length
  return `${enabledCount} settings enabled`
})

const switchSummary = computed(() => {
  const enabledCount = [nightVisionEnabled.value, autoLootEnabled.value, voiceChatEnabled.value].filter(Boolean).length
  return `${enabledCount} switches on`
})

const radioSummary = computed(
  () => `Mission ${missionStyle.value} / Feed ${feedStyle.value} / Power ${powerState.value}`,
)

const graphicsQualityLabel = computed(
  () => graphicsQualityOptions.find((item) => item.value === graphicsQuality.value)?.title ?? 'Unknown',
)

const graphicsQualitySummary = computed(
  () => `Selected quality: ${graphicsQualityLabel.value}.`,
)

function toggleDisabled(): void {
  isActionDisabled.value = !isActionDisabled.value
}

function openModal(mode: 'standard' | 'no-button' | 'locked'): void {
  modalMode.value = mode
  modalOpen.value = true
  modalEvent.value = `Showing ${mode} modal.`
}

function onModalOpen(): void {
  modalEvent.value = `Showing ${modalMode.value} modal.`
}

function onModalClose(reason?: 'button' | 'backdrop' | 'escape'): void {
  modalEvent.value = reason ? `Closed via ${reason}.` : 'Closed modal.'
}

function onModalBackdropClick(): void {
  modalEvent.value = 'Backdrop click received.'
}

function onModalEscape(): void {
  modalEvent.value = 'Escape key received.'
}

function closeModalFromFooter(message: string): void {
  modalEvent.value = message
  modalOpen.value = false
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
              <p class="ui-heading">GLabel</p>
              <p class="debug-meta">
                Small text labels for fields, sections, captions, and tiny status marks.
              </p>
            </div>
          </div>

          <div class="label-grid">
            <GLabel kind="section" preset="quiet" text="Containment field" />
            <GLabel kind="field" as="label">Nickname</GLabel>
            <GLabel kind="caption" text="Optional squad note" />
            <GLabel kind="tag" preset="accent">Live</GLabel>
            <GLabel kind="tag" preset="warning">Locked</GLabel>
            <GLabel kind="tag" preset="purple">Purple signal</GLabel>
            <GLabel kind="tag" preset="danger">Hazard</GLabel>
          </div>
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
              <p class="ui-heading">GTextarea</p>
              <p class="debug-meta">
                Multiline input for notes, lobby chat, mission text, and player briefings.
              </p>
            </div>
          </div>

          <div class="textarea-stack">
            <GTextarea
              v-model="briefingNote"
              label="Briefing Note"
              helper="Visible counter shows the current length."
              preset="surface"
              width="full"
              :rows="4"
              :maxlength="160"
              placeholder="Write briefing text"
            />

            <GTextarea
              v-model="radioLog"
              label="Radio Log"
              helper="Same control, but the counter is hidden."
              preset="quiet"
              width="full"
              :rows="4"
              :show-counter="false"
              placeholder="Write the radio log"
            />
          </div>

          <GText preset="muted" class="textarea-status" :text="textareaSummary" />
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GSlider</p>
              <p class="debug-meta">
                Range control for audio, gameplay tuning, and runtime thresholds.
              </p>
            </div>
          </div>

          <div class="slider-stack">
            <GSlider
              v-model="masterVolume"
              label="Master Volume"
              helper="Used for menu music, SFX, and ambient loops."
              preset="accent"
              width="full"
              :min="0"
              :max="100"
              :step="1"
              value-suffix="%"
            />

            <GSlider
              v-model="sensitivity"
              label="Look Sensitivity"
              helper="Mouse and stick response for the in-game camera."
              preset="purple"
              width="full"
              :min="0"
              :max="100"
              :step="1"
              value-suffix="%"
            />

            <GSlider
              v-model="threatLevel"
              label="Threat Threshold"
              error="This value is locked by the current test scenario."
              preset="warning"
              width="full"
              :min="0"
              :max="100"
              :step="1"
              value-suffix="%"
              disabled
            />
          </div>

          <GText preset="muted" class="slider-status" :text="sliderSummary" />
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GProgress</p>
              <p class="debug-meta">
                Read-only progress display with value label control and multiple visual styles.
              </p>
            </div>
          </div>

          <div class="progress-stack">
            <GProgress
              v-model="progressLoad"
              label="Asset Load"
              helper="Standard horizontal bar with a visible numeric value."
              preset="accent"
              width="full"
              variant="bar"
              value-suffix="%"
            />

            <GProgress
              v-model="progressScan"
              label="Scan Sweep"
              helper="Striped bar with the numeric value hidden."
              preset="purple"
              width="full"
              variant="striped"
              :show-value="false"
            />

            <GProgress
              v-model="progressRing"
              label="Core Stability"
              helper="Ring style with a custom label beside the number."
              preset="warning"
              width="full"
              variant="ring"
              value-label="Stable"
              value-position="prefix"
              value-suffix="%"
            />
          </div>

          <GText preset="muted" class="progress-status" :text="progressSummary" />
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GNumberInput</p>
              <p class="debug-meta">
                Numeric input for item counts, split amounts, and other integer/float values.
              </p>
            </div>
          </div>

          <div class="number-stack">
            <GNumberInput
              v-model="itemCount"
              label="Item Count"
              helper="Integer-only quantity with step buttons."
              preset="accent"
              width="full"
              mode="integer"
              :min="0"
              :max="99"
              :step="1"
              value-suffix=" pcs"
            />

            <GNumberInput
              v-model="splitAmount"
              label="Split Amount"
              helper="Float input for portions, fractions, and tuning values."
              preset="purple"
              width="full"
              mode="float"
              :min="0"
              :max="10"
              :step="0.5"
              :precision="1"
              value-suffix="x"
            />
          </div>

          <GText preset="muted" class="number-status" :text="numberSummary" />
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GCheckbox</p>
              <p class="debug-meta">
                Boolean settings for audio, readability, and gameplay convenience.
              </p>
            </div>
          </div>

          <div class="checkbox-stack">
            <GCheckbox
              v-model="soundEnabled"
              label="Sound Enabled"
              helper="Keeps music, effects, and ambience active."
              preset="accent"
              width="full"
            />

            <GCheckbox
              v-model="subtitlesEnabled"
              label="Subtitles"
              helper="Helps with whispers, system alerts, and mission text."
              preset="purple"
              width="full"
            />

            <GCheckbox
              v-model="playerNamesEnabled"
              label="Show Player Names"
              helper="Useful for HUD tags and 3D overhead labels."
              preset="ghost"
              width="full"
            />

            <GCheckbox
              v-model="motionBlurEnabled"
              label="Motion Blur"
              helper="Disabled in this demo because the setting is locked."
              error="Locked in the current build."
              preset="warning"
              width="full"
              disabled
            />
          </div>

          <GText preset="muted" class="checkbox-status" :text="checkboxSummary" />
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GSwitch</p>
              <p class="debug-meta">
                Toggle-style control for gameplay features and live settings.
              </p>
            </div>
          </div>

          <div class="switch-stack">
            <GSwitch
              v-model="nightVisionEnabled"
              label="Night Vision"
              helper="Useful for darker containment rooms."
              preset="accent"
              width="full"
            />

            <GSwitch
              v-model="autoLootEnabled"
              label="Auto Loot"
              helper="Turns pickup assistance on or off."
              preset="purple"
              width="full"
            />

            <GSwitch
              v-model="voiceChatEnabled"
              label="Voice Chat"
              helper="Keeps squad comms open."
              preset="warning"
              width="full"
            />
          </div>

          <GText preset="muted" class="switch-status" :text="switchSummary" />
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GRadio</p>
              <p class="debug-meta">
                Single-choice controls with circle, square, and lever visuals.
              </p>
            </div>
          </div>

          <div class="radio-grid">
            <div class="radio-group">
              <GText preset="header">Mission Style</GText>
              <GRadio
                v-model="missionStyle"
                name="mission-style"
                value="stealth"
                label="Stealth"
                helper="Slow, quiet, and methodical."
                preset="accent"
                variant="circle"
                width="full"
              />
              <GRadio
                v-model="missionStyle"
                name="mission-style"
                value="assault"
                label="Assault"
                helper="Direct, fast, and loud."
                preset="warning"
                variant="circle"
                width="full"
              />
              <GRadio
                v-model="missionStyle"
                name="mission-style"
                value="panic"
                label="Panic"
                helper="For testing emergency states."
                preset="danger"
                variant="circle"
                width="full"
              />
            </div>

            <div class="radio-group">
              <GText preset="header">Feed Style</GText>
              <GRadio
                v-model="feedStyle"
                name="feed-style"
                value="circle"
                label="Circle"
                helper="Classic radio look."
                preset="purple"
                variant="circle"
                width="full"
              />
              <GRadio
                v-model="feedStyle"
                name="feed-style"
                value="square"
                label="Square"
                helper="Sharper, more terminal-like."
                preset="ghost"
                variant="square"
                width="full"
              />
              <GRadio
                v-model="feedStyle"
                name="feed-style"
                value="lever"
                label="Lever"
                helper="A switch-like indicator."
                preset="accent"
                variant="lever"
                width="full"
              />
            </div>

            <div class="radio-group">
              <GText preset="header">Power State</GText>
              <GRadio
                v-model="powerState"
                name="power-state"
                value="on"
                label="Power On"
                helper="Subsystems active."
                preset="accent"
                variant="lever"
                width="full"
              />
              <GRadio
                v-model="powerState"
                name="power-state"
                value="off"
                label="Power Off"
                helper="Subsystems idle."
                preset="quiet"
                variant="lever"
                width="full"
              />
            </div>
          </div>

          <GText preset="muted" class="radio-status" :text="radioSummary" />
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
              <p class="ui-heading">GSection</p>
              <p class="debug-meta">
                Higher-level block for settings pages, lobby panels, and grouped in-game options.
              </p>
            </div>
          </div>

          <GSection
            title="Video Settings"
            subtitle="The top-level container for related controls inside a settings page."
            status="Runtime ready"
            width="full"
            preset="quiet"
            background
          >
            <div class="field-stack">
              <GField
                label="Graphics Quality"
                helper="One wrapper, any control inside it. This one holds the direct preset rail."
                layout="row"
                width="full"
                background
                preset="quiet"
              >
                <GRail
                  v-model="graphicsQuality"
                  :items="graphicsQualityOptions"
                  preset="quiet"
                  width="full"
                  background
                />
              </GField>

              <GText preset="muted" class="field-status" :text="graphicsQualitySummary" />
            </div>
          </GSection>
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GDivider</p>
              <p class="debug-meta">
                Simple separator for splitting settings groups and denser menu blocks.
              </p>
            </div>
          </div>

          <div class="divider-stack">
            <GDivider label="Audio" preset="quiet" />
            <div class="divider-demo">
              <GText preset="body">Left block</GText>
              <GDivider orientation="vertical" inset preset="accent" aria-label="Split blocks" />
              <GText preset="body">Right block</GText>
            </div>
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
                    {{ currentTab?.value === 'pause' ? 'Resume Game' : 'Pause Menu' }}
                  </GButton>
                  <GButton preset="purple" width="full">
                    {{ currentTab?.value === 'hud' ? 'HUD Live' : 'HUD Preview' }}
                  </GButton>
                </div>
              </div>
            </template>
          </GTabs>
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GPanel</p>
              <p class="debug-meta">
                Shared framed container for menu blocks, HUD widgets, and modal content.
              </p>
            </div>
          </div>

          <div class="panel-grid">
            <GPanel
              title="Containment Briefing"
              subtitle="This panel uses header, body, and footer slots."
              strong
              width="full"
            >
              <div class="panel-stats">
                <div v-for="stat in panelStats" :key="stat.label" class="panel-stat">
                  <GText preset="caps">{{ stat.label }}</GText>
                  <GText preset="header">{{ stat.value }}</GText>
                </div>
              </div>

              <template #footer>
                <GButton preset="accent">Briefing</GButton>
                <GButton preset="ghost">Dismiss</GButton>
              </template>
            </GPanel>

            <GPanel
              title="HUD Frame"
              subtitle="A lighter shell for status strips and live overlays."
              width="full"
            >
              <GText preset="body">
                This is the kind of reusable container we can keep using for lobby cards, pause
                menus, and microgame surfaces.
              </GText>
            </GPanel>
          </div>
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GBadge</p>
              <p class="debug-meta">
                Small status tags for players, alerts, counts, and runtime conditions.
              </p>
            </div>
          </div>

          <div class="badge-grid">
            <GBadge
              v-for="item in badgeItems"
              :key="item.text"
              :preset="item.preset"
              :variant="item.variant || 'soft'"
              :dot="item.dot || false"
            >
              {{ item.text }}
            </GBadge>

            <GBadge preset="accent" variant="outline" interactive title="Clickable badge">
              Clickable
            </GBadge>
          </div>
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GToast</p>
              <p class="debug-meta">
                Visual notification card for the future toast system, with header, body, footer,
                and close event wiring.
              </p>
            </div>
          </div>

          <div class="toast-grid">
            <GToast
              v-for="item in toastItems"
              :key="item.title"
              :title="item.title"
              :message="item.message"
              :status="item.status"
              :preset="item.preset"
              :variant="item.variant || 'soft'"
              closable
            >
              <template #icon>
                <span
                  class="toast-icon"
                  :class="`toast-icon--${item.preset}`"
                  aria-hidden="true"
                ></span>
              </template>

              <template #footer="{ close }">
                <template v-if="item.footer">
                  <GButton preset="ghost" @click="close">Dismiss</GButton>
                  <GButton preset="accent">Retry link</GButton>
                </template>
              </template>
            </GToast>
          </div>
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GWindow</p>
              <p class="debug-meta">
                Larger framed surface for settings, inventory, and pause-style overlays.
              </p>
            </div>
          </div>

          <GWindow
            title="Settings Window"
            subtitle="A full UI shell with header, body, and footer actions."
            status="Paused"
            strong
            width="full"
            height="full"
            closable
            @close="toggleDisabled"
          >
            <div class="window-grid">
              <GPanel title="Graphics" subtitle="Shared container inside the window." width="full">
                <GText preset="body">
                  We can slot `GPanel` inside `GWindow` for nested sections like graphics, audio,
                  and controls.
                </GText>
              </GPanel>

              <GPanel title="Connection" subtitle="Runtime state from game to UI." width="full">
                <GText preset="technical" text="ws://127.0.0.1:7777 | protobuf: enabled | images: http" />
              </GPanel>
            </div>

            <template #footer>
              <GButton v-for="action in windowActions" :key="action.label" :preset="action.preset">
                {{ action.label }}
              </GButton>
            </template>
          </GWindow>
        </section>

        <section class="font-card ui-panel">
          <div class="debug-card-head">
            <div>
              <p class="ui-heading">GModal</p>
              <p class="debug-meta">
                Blocking overlay with header, content, footer, and close behavior flags.
              </p>
            </div>
          </div>

          <div class="modal-toolbar">
            <GButton
              v-for="mode in modalModes"
              :key="mode.key"
              :preset="mode.key === 'locked' ? 'warning' : 'surface'"
              @click="openModal(mode.key)"
            >
              {{ mode.label }} modal
            </GButton>
          </div>

          <GText preset="muted" class="modal-event" :text="modalEvent" />
        </section>
      </GScroller>
    </div>

    <GModal
      v-model="modalOpen"
      :title="modalConfig.title"
      :subtitle="modalConfig.subtitle"
      :status="modalConfig.status"
      :closable="modalConfig.closable"
      :backdrop-closable="modalConfig.backdropClosable"
      :escape-closable="modalConfig.escapeClosable"
      :show-close-button="modalConfig.showCloseButton"
      width="lg"
      @open="onModalOpen"
      @close="onModalClose"
      @backdrop-click="onModalBackdropClick"
      @escape="onModalEscape"
    >
      <template #header="{ close, isOpen }">
        <div class="modal-custom-header">
          <div class="modal-custom-header__text">
            <GText preset="header">{{ modalConfig.title }}</GText>
            <GText preset="muted">{{ modalConfig.subtitle }}</GText>
          </div>
          <div class="modal-custom-header__actions">
            <GButton
              v-if="modalConfig.showCloseButton && modalConfig.closable"
              preset="ghost"
              shape="chip"
              icon-only
              aria-label="Close modal"
              @click="close('button')"
            >
              <template #icon>
                <span class="modal-close-icon" aria-hidden="true"></span>
              </template>
            </GButton>
          </div>
        </div>
      </template>

      <div class="modal-body">
        <GText preset="body">
          This modal demonstrates close button control, backdrop control, and event binding.
          The footer buttons are custom content, not framework filler.
        </GText>

        <GPanel title="Runtime Details" subtitle="Custom content in the modal body." width="full">
          <div class="modal-details">
            <GText preset="technical" text="modal_id = 42\nclose_paths = configurable\ntransport = websocket" />
            <GText preset="muted">
              In a real game, this is where confirmations, warnings, and mini-game prompts live.
            </GText>
          </div>
        </GPanel>
      </div>

      <template #footer="{ close }">
        <GButton preset="accent" @click="closeModalFromFooter('Closed from footer confirm.')">
          Confirm
        </GButton>
        <GButton preset="ghost" @click="closeModalFromFooter('Closed from footer action.')">
          Footer Close
        </GButton>
      </template>
    </GModal>
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

.label-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.field-stack {
  display: grid;
  gap: 1rem;
}

.field-status {
  margin-top: 0;
}

.divider-stack {
  display: grid;
  gap: 1rem;
}

.divider-demo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.textarea-stack {
  display: grid;
  gap: 1rem;
}

.textarea-status {
  margin-top: 1rem;
}

.slider-stack {
  display: grid;
  gap: 1rem;
}

.slider-status {
  margin-top: 1rem;
}

.progress-stack {
  display: grid;
  gap: 1rem;
}

.progress-status {
  margin-top: 1rem;
}

.number-stack {
  display: grid;
  gap: 1rem;
}

.number-status {
  margin-top: 1rem;
}

.checkbox-stack {
  display: grid;
  gap: 0.875rem;
}

.checkbox-status {
  margin-top: 1rem;
}

.switch-stack {
  display: grid;
  gap: 0.875rem;
}

.switch-status {
  margin-top: 1rem;
}

.radio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1rem;
}

.radio-group {
  display: grid;
  gap: 0.875rem;
}

.radio-status {
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

.panel-grid {
  display: grid;
  gap: 1rem;
}

.badge-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.toast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 0.875rem;
}

.toast-icon {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 999px;
  border: 0.125rem solid currentColor;
  box-shadow: 0 0 0 0.125rem rgba(0, 0, 0, 0.2);
}

.toast-icon--accent {
  background: var(--ui-accent);
  color: var(--ui-accent);
}

.toast-icon--warning {
  background: #ffd26b;
  color: #ffd26b;
}

.toast-icon--danger {
  background: #ff8b82;
  color: #ff8b82;
}

.toast-icon--quiet {
  background: rgba(236, 240, 244, 0.56);
  color: rgba(236, 240, 244, 0.56);
}

.panel-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 0.75rem;
}

.panel-stat {
  display: grid;
  gap: 0.25rem;
}

.window-grid {
  display: grid;
  gap: 1rem;
}

.window-grid :deep(.gpanel) {
  min-width: 0;
}

.modal-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.modal-event {
  margin-top: 1rem;
}

.modal-custom-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}

.modal-custom-header__text {
  display: grid;
  gap: 0.25rem;
  min-width: 0;
}

.modal-custom-header__actions {
  display: grid;
  justify-items: end;
  gap: 0.5rem;
  flex: 0 0 auto;
}

.modal-close-icon {
  position: relative;
  display: inline-block;
  width: 0.875rem;
  height: 0.875rem;
}

.modal-close-icon::before,
.modal-close-icon::after {
  content: '';
  position: absolute;
  inset: 50% auto auto 50%;
  width: 1rem;
  height: 0.125rem;
  background: currentColor;
  transform-origin: center;
}

.modal-close-icon::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.modal-close-icon::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.modal-body {
  display: grid;
  gap: 1rem;
}

.modal-details {
  display: grid;
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
