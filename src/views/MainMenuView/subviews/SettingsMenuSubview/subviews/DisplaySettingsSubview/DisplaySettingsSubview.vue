<script lang="ts" src="./DisplaySettingsSubview.ts"></script>

<template>
  <section class="display-settings" aria-label="Display settings">
    <section class="display-settings__group" aria-label="Display output settings">
      <div class="display-settings__stack">
        <GField
          label="Fullscreen Mode"
          helper="Windowed Fullscreen locks to the desktop output path."
          layout="stack"
          width="full"
          class="display-settings__field display-settings__feature-field"
        >
          <template #head>
            <GTooltip
              :delay="hoverHelpDelay"
              placement="top"
              size="lg"
              preset="quiet"
              :text="displayHelp.fullscreenMode"
              aria-label="Fullscreen mode help"
            >
              <GBadge preset="quiet" variant="outline" size="sm" class="display-settings__help-badge">?</GBadge>
            </GTooltip>
          </template>

          <div class="display-settings__mode-grid">
            <GButton
              v-for="mode in fullscreenModes"
              :key="mode.value"
              :pressed="fullscreenMode === mode.value"
              :preset="fullscreenMode === mode.value ? 'accent' : 'quiet'"
              shape="block"
              size="lg"
              class="display-settings__mode-button"
              @click="fullscreenMode = mode.value"
            >
              {{ mode.label }}
            </GButton>
          </div>
        </GField>

        <div class="display-settings__grid display-settings__grid--duo">
          <GField
            label="Resolution"
            helper="Disabled while using desktop-sized borderless mode."
            width="full"
            class="display-settings__feature-field"
          >
            <template #head>
              <GTooltip
                :delay="hoverHelpDelay"
                placement="top"
                size="lg"
                preset="quiet"
                :text="displayHelp.resolution"
                aria-label="Resolution help"
              >
                <GBadge preset="quiet" variant="outline" size="sm" class="display-settings__help-badge">?</GBadge>
              </GTooltip>
            </template>

            <GCombo
              v-model="resolution"
              :options="resolutionOptions"
              :disabled="resolutionDisabled"
              width="full"
              preset="quiet"
              placeholder="Select resolution"
            />
          </GField>

          <GField
            label="Sync"
            helper="Presentation pacing and tear control."
            width="full"
            class="display-settings__field display-settings__feature-field"
          >
            <template #head>
              <GTooltip
                :delay="hoverHelpDelay"
                placement="top"
                size="lg"
                preset="quiet"
                :text="displayHelp.sync"
                aria-label="VSync help"
              >
                <GBadge preset="quiet" variant="outline" size="sm" class="display-settings__help-badge">?</GBadge>
              </GTooltip>
            </template>

            <div class="display-settings__toggle-column">
              <GCheckbox v-model="vsync" preset="quiet">VSync</GCheckbox>
            </div>
          </GField>
        </div>

        <GField
          label="Frame Rate Limit"
          helper="Enable the cap, then tune it with the slider or exact numeric input."
          width="full"
          class="display-settings__field display-settings__feature-field"
        >
          <template #head>
            <GTooltip
              :delay="hoverHelpDelay"
              placement="top"
              size="lg"
              preset="quiet"
              :text="displayHelp.frameRateLimit"
              aria-label="Frame rate limit help"
            >
              <GBadge preset="quiet" variant="outline" size="sm" class="display-settings__help-badge">?</GBadge>
            </GTooltip>
          </template>

          <div class="display-settings__fps-group">
            <GCheckbox v-model="limitFps" preset="quiet">Limit FPS</GCheckbox>

            <div class="display-settings__fps-row" :class="{ 'display-settings__fps-row--disabled': fpsControlsDisabled }">
              <GSlider
                v-model="maxFps"
                :disabled="fpsControlsDisabled"
                :min="30"
                :max="360"
                :step="1"
                :show-value="false"
                value-suffix=" FPS"
                width="full"
                preset="quiet"
                aria-label="Maximum frames per second"
              />
              <GNumberInput
                v-model="maxFps"
                :disabled="fpsControlsDisabled"
                :min="30"
                :max="360"
                :step="1"
                :step-buttons="false"
                :show-value="false"
                width="full"
                preset="quiet"
                aria-label="Maximum FPS input"
              >
                <template #suffix>
                  <span class="display-settings__unit">FPS</span>
                </template>
              </GNumberInput>
            </div>
          </div>
        </GField>

        <div class="display-settings__hdr-shell">
          <div class="display-settings__hdr-head">

            <GCheckbox v-model="hdrEnabled" preset="quiet">HDR Enable</GCheckbox>
            <GBadge
              v-if="displaySettingsRuntime.showHdrUnsupportedBadge"
              preset="warning"
              variant="soft"
              size="sm"
            >
              Not Supported
            </GBadge>
          </div>

          <div class="display-settings__grid display-settings__grid--duo">
            <GField
              label="Output Device"
              helper="`r.HDR.Display.OutputDevice` mapping"
              width="full"
              class="display-settings__feature-field"
            >
              <template #head>
                <GTooltip
                  :delay="hoverHelpDelay"
                  placement="top"
                  size="lg"
                  preset="quiet"
                  :text="displayHelp.hdrOutputDevice"
                  aria-label="HDR output device help"
                >
                  <GBadge preset="quiet" variant="outline" size="sm" class="display-settings__help-badge">?</GBadge>
                </GTooltip>
              </template>

              <GCombo
                v-model="hdrOutputDevice"
                :options="hdrOutputDeviceOptions"
                :disabled="hdrControlsDisabled"
                width="full"
                preset="quiet"
                placeholder="Select output device"
              />
            </GField>

            <GField
              label="Color Gamut"
              helper="`r.HDR.Display.ColorGamut` mapping"
              width="full"
              class="display-settings__feature-field"
            >
              <template #head>
                <GTooltip
                  :delay="hoverHelpDelay"
                  placement="top"
                  size="lg"
                  preset="quiet"
                  :text="displayHelp.hdrColorGamut"
                  aria-label="HDR color gamut help"
                >
                  <GBadge preset="quiet" variant="outline" size="sm" class="display-settings__help-badge">?</GBadge>
                </GTooltip>
              </template>

              <GCombo
                v-model="hdrColorGamut"
                :options="hdrColorGamutOptions"
                :disabled="hdrControlsDisabled"
                width="full"
                preset="quiet"
                placeholder="Select color gamut"
              />
            </GField>
          </div>
        </div>
      </div>
    </section>

    <GDivider label="Accessibility" preset="quiet" class="display-settings__divider" />

    <section class="display-settings__group" aria-label="Accessibility settings">
      <GText as="p" preset="muted" class="display-settings__group-summary">
        Screen comfort and readability controls.
      </GText>

      <div class="display-settings__triple">
        <GField label="Brightness" width="full" class="display-settings__feature-field">
          <template #head>
            <GTooltip
              :delay="hoverHelpDelay"
              placement="top"
              size="lg"
              preset="quiet"
              :text="displayHelp.brightness"
              aria-label="Brightness help"
            >
              <GBadge preset="quiet" variant="outline" size="sm" class="display-settings__help-badge">?</GBadge>
            </GTooltip>
          </template>

          <GSlider
            v-model="brightness"
            :min="0"
            :max="100"
            :step="1"
            width="full"
            preset="quiet"
            aria-label="Brightness"
          />
        </GField>

        <GField label="Gamma" width="full" class="display-settings__feature-field">
          <template #head>
            <GTooltip
              :delay="hoverHelpDelay"
              placement="top"
              size="lg"
              preset="quiet"
              :text="displayHelp.gamma"
              aria-label="Gamma help"
            >
              <GBadge preset="quiet" variant="outline" size="sm" class="display-settings__help-badge">?</GBadge>
            </GTooltip>
          </template>

          <GSlider
            v-model="gamma"
            :min="0"
            :max="100"
            :step="1"
            width="full"
            preset="quiet"
            aria-label="Gamma"
          />
        </GField>

        <GField label="Contrast" width="full" class="display-settings__feature-field">
          <template #head>
            <GTooltip
              :delay="hoverHelpDelay"
              placement="top"
              size="lg"
              preset="quiet"
              :text="displayHelp.contrast"
              aria-label="Contrast help"
            >
              <GBadge preset="quiet" variant="outline" size="sm" class="display-settings__help-badge">?</GBadge>
            </GTooltip>
          </template>

          <GSlider
            v-model="contrast"
            :min="0"
            :max="100"
            :step="1"
            width="full"
            preset="quiet"
            aria-label="Contrast"
          />
        </GField>
      </div>
    </section>

    <GDivider label="Camera" preset="quiet" class="display-settings__divider" />

    <section class="display-settings__group" aria-label="Camera settings">
      <GText as="p" preset="muted" class="display-settings__group-summary">
        Visual comfort tuning for movement-heavy first-person play.
      </GText>

      <div class="display-settings__stack">
        <GField label="Field Of View" width="full" class="display-settings__feature-field">
          <template #head>
            <GTooltip
              :delay="hoverHelpDelay"
              placement="top"
              size="lg"
              preset="quiet"
              :text="displayHelp.fov"
              aria-label="Field of view help"
            >
              <GBadge preset="quiet" variant="outline" size="sm" class="display-settings__help-badge">?</GBadge>
            </GTooltip>
          </template>

          <GSlider
            v-model="fov"
            :min="70"
            :max="120"
            :step="1"
            value-suffix="deg"
            width="full"
            preset="quiet"
            aria-label="Field of view"
          />
        </GField>

        <div class="display-settings__grid display-settings__grid--camera">
          <GField label="Camera Smoothing" width="full" class="display-settings__feature-field">
            <template #head>
              <GTooltip
                :delay="hoverHelpDelay"
                placement="top"
                size="lg"
                preset="quiet"
                :text="displayHelp.cameraSmoothing"
                aria-label="Camera smoothing help"
              >
                <GBadge preset="quiet" variant="outline" size="sm" class="display-settings__help-badge">?</GBadge>
              </GTooltip>
            </template>

            <GSlider
              v-model="cameraSmoothing"
              :min="0"
              :max="100"
              :step="1"
              width="full"
              preset="quiet"
              aria-label="Camera smoothing"
            />
          </GField>

          <GField label="Screen Shake Intensity" width="full" class="display-settings__feature-field">
            <template #head>
              <GTooltip
                :delay="hoverHelpDelay"
                placement="top"
                size="lg"
                preset="quiet"
                :text="displayHelp.screenShakeIntensity"
                aria-label="Screen shake intensity help"
              >
                <GBadge preset="quiet" variant="outline" size="sm" class="display-settings__help-badge">?</GBadge>
              </GTooltip>
            </template>

            <GSlider
              v-model="screenShakeIntensity"
              :min="0"
              :max="100"
              :step="1"
              width="full"
              preset="quiet"
              aria-label="Screen shake intensity"
            />
          </GField>

          <GField label="Head Bobbing Intensity" width="full" class="display-settings__feature-field">
            <template #head>
              <GTooltip
                :delay="hoverHelpDelay"
                placement="top"
                size="lg"
                preset="quiet"
                :text="displayHelp.headBobbingIntensity"
                aria-label="Head bobbing intensity help"
              >
                <GBadge preset="quiet" variant="outline" size="sm" class="display-settings__help-badge">?</GBadge>
              </GTooltip>
            </template>

            <GSlider
              v-model="headBobbingIntensity"
              :min="0"
              :max="100"
              :step="1"
              width="full"
              preset="quiet"
              aria-label="Head bobbing intensity"
            />
          </GField>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.display-settings {
  display: grid;
  align-content: start;
  gap: 1rem;
  min-height: 100%;
}

.display-settings__header {
  display: grid;
  gap: 0.55rem;
}

.display-settings__title {
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

.display-settings__summary {
  max-width: 42rem;
  margin: 0;
}

.display-settings__group {
  display: grid;
  gap: 1rem;
}

.display-settings__stack {
  display: grid;
  gap: 1rem;
}

.display-settings__grid {
  display: grid;
  gap: 1rem;
}

.display-settings__grid--duo {
  grid-template-columns: minmax(0, 1.25fr) minmax(18rem, 0.75fr);
}

.display-settings__grid--camera {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.display-settings__triple {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.display-settings__mode-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
}

.display-settings__mode-button {
  min-width: 0;
}

.display-settings__feature-field {
  position: relative;
}

.display-settings__feature-field :deep(.gfield__head) {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding-bottom: 0.75rem;
  flex-wrap: wrap;
}

.display-settings__feature-field :deep(.gfield__label) {
  color: rgba(244, 248, 236, 0.98);
  font-size: 1rem;
  letter-spacing: 0.16em;
  text-shadow: 0 0 1rem rgba(198, 255, 74, 0.12);
}

.display-settings__feature-field :deep(.gfield__helper) {
  max-width: 44rem;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  line-height: 1.5;
  color: rgba(216, 225, 214, 0.74);
}

.display-settings__toggle-column {
  display: grid;
  align-content: start;
  gap: 0.9rem;
  padding-top: 0.15rem;
}

.display-settings__fps-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(7.5rem, 9rem);
  gap: 1rem;
  align-items: end;
}

.display-settings__fps-group {
  display: grid;
  gap: 0.25rem;
}

.display-settings__fps-row--disabled {
  opacity: 0.5;
}

.display-settings__fps-row :deep(.gslider),
.display-settings__fps-row :deep(.gnumberinput) {
  gap: 0;
}

.display-settings__fps-row :deep(.gslider__head),
.display-settings__fps-row :deep(.gslider__meta),
.display-settings__fps-row :deep(.gnumberinput__head),
.display-settings__fps-row :deep(.gnumberinput__meta) {
  display: none;
}

.display-settings__hdr-shell {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid rgba(198, 255, 74, 0.09);
  background:
    linear-gradient(180deg, rgba(255, 176, 0, 0.04), transparent 30%),
    rgba(5, 8, 8, 0.36);
}

.display-settings__hdr-head {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.display-settings__hdr-head :deep(.gcheckbox) {
  align-items: center;
}

.display-settings__hdr-head :deep(.gcheckbox__control) {
  margin-top: 0;
}

.display-settings__hdr-head :deep(.gcheckbox__content) {
  min-height: auto;
  padding-top: 0;
}

.display-settings__hdr-head :deep(.gbadge) {
  align-self: center;
}

.display-settings__divider {
  margin-top: 0.35rem;
}

.display-settings__help-badge {
  justify-self: start;
  min-width: 1.8rem;
  padding-inline: 0.45rem;
  cursor: help;
}

.display-settings__unit {
  color: rgba(236, 240, 244, 0.62);
  font-family: var(--ui-technical-font);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 64rem) {
  .display-settings__grid--duo,
  .display-settings__grid--camera,
  .display-settings__triple {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .display-settings__fps-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 48rem) {
  .display-settings__mode-grid,
  .display-settings__grid--duo,
  .display-settings__grid--camera,
  .display-settings__triple {
    grid-template-columns: 1fr;
  }

  .display-settings__toggle-column {
    padding-top: 0;
  }
}
</style>
