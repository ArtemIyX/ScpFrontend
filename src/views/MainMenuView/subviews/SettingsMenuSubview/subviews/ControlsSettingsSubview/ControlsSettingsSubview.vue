<script lang="ts" src="./ControlsSettingsSubview.ts"></script>

<template>
  <section class="controls-settings" aria-label="Controls settings">
    <header class="controls-settings__header">
      <h1 class="controls-settings__title">Controls</h1>
      <GText as="p" preset="muted" class="controls-settings__summary">
        Input feel, response shaping, and runtime interaction preferences for mouse, keyboard, and controller play.
      </GText>
    </header>

    <section class="controls-settings__group" aria-label="Input response settings">
      <div class="controls-settings__grid controls-settings__grid--duo">
        <GField label="Mouse Sensitivity" width="full" class="controls-settings__feature-field">
          <template #head>
            <GTooltip
              :delay="hoverHelpDelay"
              placement="top"
              size="lg"
              preset="quiet"
              :text="controlsHelp.mouseSensitivity"
              aria-label="Mouse sensitivity help"
            >
              <GBadge preset="quiet" variant="outline" size="sm" class="controls-settings__help-badge">?</GBadge>
            </GTooltip>
          </template>

          <GSlider
            v-model="mouseSensitivity"
            :min="0"
            :max="100"
            :step="1"
            value-suffix="%"
            width="full"
            preset="quiet"
            aria-label="Mouse sensitivity"
          />
        </GField>

        <GField label="Aim Sensitivity" width="full" class="controls-settings__feature-field">
          <template #head>
            <GTooltip
              :delay="hoverHelpDelay"
              placement="top"
              size="lg"
              preset="quiet"
              :text="controlsHelp.aimSensitivity"
              aria-label="Aim sensitivity help"
            >
              <GBadge preset="quiet" variant="outline" size="sm" class="controls-settings__help-badge">?</GBadge>
            </GTooltip>
          </template>

          <GSlider
            v-model="aimSensitivity"
            :min="0"
            :max="100"
            :step="1"
            value-suffix="%"
            width="full"
            preset="quiet"
            aria-label="Aim sensitivity"
          />
        </GField>
      </div>

      <GField label="Input Profile" width="full" class="controls-settings__feature-field">
        <template #head>
          <GTooltip
            :delay="hoverHelpDelay"
            placement="top"
            size="lg"
            preset="quiet"
            :text="controlsHelp.inputProfile"
            aria-label="Input profile help"
          >
            <GBadge preset="quiet" variant="outline" size="sm" class="controls-settings__help-badge">?</GBadge>
          </GTooltip>
        </template>

        <GCombo
          v-model="inputProfile"
          :options="aimProfileOptions"
          width="full"
          preset="quiet"
          placeholder="Select an input profile"
        />
      </GField>
    </section>

    <GDivider label="Movement" preset="quiet" class="controls-settings__divider" />

    <section class="controls-settings__group" aria-label="Movement preferences">
      <div class="controls-settings__toggle-grid">
        <GField label="Invert Vertical Look" width="full" class="controls-settings__feature-field">
          <template #head>
            <GTooltip
              :delay="hoverHelpDelay"
              placement="top"
              size="lg"
              preset="quiet"
              :text="controlsHelp.invertVerticalLook"
              aria-label="Invert vertical look help"
            >
              <GBadge preset="quiet" variant="outline" size="sm" class="controls-settings__help-badge">?</GBadge>
            </GTooltip>
          </template>

          <div class="controls-settings__toggle-column">
            <GCheckbox v-model="invertVerticalLook" preset="quiet">Invert Y Axis</GCheckbox>
          </div>
        </GField>

        <GField label="Hold To Sprint" width="full" class="controls-settings__feature-field">
          <template #head>
            <GTooltip
              :delay="hoverHelpDelay"
              placement="top"
              size="lg"
              preset="quiet"
              :text="controlsHelp.holdToSprint"
              aria-label="Hold to sprint help"
            >
              <GBadge preset="quiet" variant="outline" size="sm" class="controls-settings__help-badge">?</GBadge>
            </GTooltip>
          </template>

          <div class="controls-settings__toggle-column">
            <GCheckbox v-model="holdToSprint" preset="quiet">Hold Sprint</GCheckbox>
          </div>
        </GField>

        <GField label="Tap To Crouch" width="full" class="controls-settings__feature-field">
          <template #head>
            <GTooltip
              :delay="hoverHelpDelay"
              placement="top"
              size="lg"
              preset="quiet"
              :text="controlsHelp.tapToCrouch"
              aria-label="Tap to crouch help"
            >
              <GBadge preset="quiet" variant="outline" size="sm" class="controls-settings__help-badge">?</GBadge>
            </GTooltip>
          </template>

          <div class="controls-settings__toggle-column">
            <GCheckbox v-model="tapToCrouch" preset="quiet">Tap Crouch</GCheckbox>
          </div>
        </GField>

        <GField label="Toggle Lean" width="full" class="controls-settings__feature-field">
          <template #head>
            <GTooltip
              :delay="hoverHelpDelay"
              placement="top"
              size="lg"
              preset="quiet"
              :text="controlsHelp.toggleLean"
              aria-label="Toggle lean help"
            >
              <GBadge preset="quiet" variant="outline" size="sm" class="controls-settings__help-badge">?</GBadge>
            </GTooltip>
          </template>

          <div class="controls-settings__toggle-column">
            <GCheckbox v-model="toggleLean" preset="quiet">Toggle Lean</GCheckbox>
          </div>
        </GField>
      </div>
    </section>

    <GDivider label="Controller" preset="quiet" class="controls-settings__divider" />

    <section class="controls-settings__group" aria-label="Controller tuning">
      <div class="controls-settings__grid controls-settings__grid--duo">
        <GField label="Deadzone" width="full" class="controls-settings__feature-field">
          <template #head>
            <GTooltip
              :delay="hoverHelpDelay"
              placement="top"
              size="lg"
              preset="quiet"
              :text="controlsHelp.controllerDeadzone"
              aria-label="Controller deadzone help"
            >
              <GBadge preset="quiet" variant="outline" size="sm" class="controls-settings__help-badge">?</GBadge>
            </GTooltip>
          </template>

          <GSlider
            v-model="controllerDeadzone"
            :min="0"
            :max="40"
            :step="1"
            value-suffix="%"
            width="full"
            preset="quiet"
            aria-label="Controller deadzone"
          />
        </GField>

        <GField label="Vibration" width="full" class="controls-settings__feature-field">
          <template #head>
            <GTooltip
              :delay="hoverHelpDelay"
              placement="top"
              size="lg"
              preset="quiet"
              :text="controlsHelp.controllerVibration"
              aria-label="Controller vibration help"
            >
              <GBadge preset="quiet" variant="outline" size="sm" class="controls-settings__help-badge">?</GBadge>
            </GTooltip>
          </template>

          <GSlider
            v-model="controllerVibration"
            :min="0"
            :max="100"
            :step="1"
            value-suffix="%"
            width="full"
            preset="quiet"
            aria-label="Controller vibration"
          />
        </GField>
      </div>
    </section>
  </section>
</template>

<style scoped>
.controls-settings {
  display: grid;
  align-content: start;
  gap: 1rem;
  min-height: 100%;
}

.controls-settings__header {
  display: grid;
  gap: 0.55rem;
}

.controls-settings__title {
  margin: 0;
  color: rgba(240, 244, 238, 0.96);
  font-family: var(--ui-body-font);
  font-size: clamp(1.9rem, 3vw, 2.5rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-shadow: 0 0 1.2rem rgba(198, 255, 74, 0.12);
}

.controls-settings__summary {
  max-width: 48rem;
  margin: 0;
}

.controls-settings__group {
  display: grid;
  gap: 1rem;
}

.controls-settings__grid {
  display: grid;
  gap: 1rem;
}

.controls-settings__grid--duo {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.controls-settings__toggle-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.controls-settings__toggle-column {
  display: grid;
  align-content: start;
  gap: 0.9rem;
  padding-top: 0.15rem;
}

.controls-settings__divider {
  margin-top: 0.35rem;
}

.controls-settings__feature-field {
  position: relative;
}

.controls-settings__feature-field :deep(.gfield__head) {
  display: flex;
  align-items: center;
  gap: 0.22rem;
  padding-bottom: 0.45rem;
  flex-wrap: wrap;
}

.controls-settings__feature-field :deep(.gfield__label) {
  color: rgba(244, 248, 236, 0.98);
  font-size: 1.08rem;
  letter-spacing: 0.16em;
  text-shadow: 0 0 1rem rgba(198, 255, 74, 0.12);
}

.controls-settings__feature-field :deep(.gfield__helper) {
  max-width: 44rem;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  line-height: 1.5;
  color: rgba(216, 225, 214, 0.74);
}

.controls-settings__help-badge {
  justify-self: start;
  min-width: 1.8rem;
  padding-inline: 0.45rem;
  cursor: help;
}

@media (max-width: 64rem) {
  .controls-settings__grid--duo,
  .controls-settings__toggle-grid {
    grid-template-columns: 1fr;
  }
}
</style>
