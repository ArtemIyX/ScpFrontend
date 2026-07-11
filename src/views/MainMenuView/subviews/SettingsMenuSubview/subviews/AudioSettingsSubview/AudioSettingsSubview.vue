<script lang="ts" src="./AudioSettingsSubview.ts"></script>

<template>
  <section class="audio-settings" aria-label="Audio settings">
    <section class="audio-settings__group" aria-label="Device routing">
      <GField
        label="Playback Device"
        helper="Select the device the game should use for audio playback."
        width="full"
        class="audio-settings__feature-field"
      >
        <GCombo
          v-model="outputDevice"
          :options="outputDeviceOptions"
          width="full"
          preset="quiet"
          placeholder="Select output device"
        />
      </GField>

      <GField
        label="Capture Device"
        helper="Select the microphone or input source used for voice chat."
        width="full"
        class="audio-settings__feature-field"
      >
        <GCombo
          v-model="inputDevice"
          :options="inputDeviceOptions"
          width="full"
          preset="quiet"
          placeholder="Select input device"
        />
      </GField>
    </section>

    <GDivider label="Voice Chat" preset="quiet" class="audio-settings__divider" />

    <section class="audio-settings__group" aria-label="Voice communication settings">
      <GField
        label="Talk Mode"
        helper="Pick the communication mode the squad uses in-game."
        width="full"
        class="audio-settings__feature-field"
      >
        <div class="audio-settings__mode-list">
          <GRadio
            v-for="mode in talkModes"
            :key="mode.value"
            v-model="talkMode"
            :value="mode.value"
            name="audio-talk-mode"
            preset="quiet"
            variant="circle"
            width="full"
            :label="mode.label"
            :helper="mode.helper"
          />
        </div>
      </GField>

      <GField
        label="Voice Activation Threshold"
        helper="Only active when voice activation is selected."
        width="full"
        class="audio-settings__feature-field"
      >
        <div class="audio-settings__threshold-row" :class="{ 'audio-settings__threshold-row--disabled': voiceActivationDisabled }">
          <GSlider
            v-model="voiceActivationThreshold"
            :disabled="voiceActivationDisabled"
            :min="0"
            :max="100"
            :step="1"
            value-suffix="%"
            width="full"
            preset="quiet"
            aria-label="Voice activation threshold"
          />
          <GText as="p" preset="muted" class="audio-settings__threshold-copy">
            Lower values are more sensitive. Higher values require a stronger voice signal.
          </GText>
        </div>
      </GField>
    </section>

    <GDivider label="Mixer" preset="quiet" class="audio-settings__divider" />

    <section class="audio-settings__group" aria-label="Volume mixer">
      <GField
        label="Master Volume"
        helper="Global game output level."
        width="full"
        class="audio-settings__feature-field"
      >
        <GSlider
          v-model="masterVolume"
          :min="0"
          :max="100"
          :step="1"
          value-suffix="%"
          width="full"
          preset="quiet"
          aria-label="Master volume"
        />
      </GField>

      <div class="audio-settings__volume-grid">
        <GField
          label="Ambient Volume"
          helper="Controls wind, machinery hum, room tone, and environmental sound beds."
          width="full"
        >
          <GSlider
            v-model="ambientVolume"
            :min="0"
            :max="100"
            :step="1"
            value-suffix="%"
            width="full"
            preset="quiet"
            aria-label="Ambient sound volume"
          />
        </GField>

        <GField
          label="UI Volume"
          helper="Controls menu clicks, confirmations, alerts, and interface feedback."
          width="full"
        >
          <GSlider
            v-model="uiVolume"
            :min="0"
            :max="100"
            :step="1"
            value-suffix="%"
            width="full"
            preset="quiet"
            aria-label="Interface volume"
          />
        </GField>

        <GField
          label="Music Volume"
          helper="Controls background music, ambient score, and menu tracks."
          width="full"
        >
          <GSlider
            v-model="musicVolume"
            :min="0"
            :max="100"
            :step="1"
            value-suffix="%"
            width="full"
            preset="quiet"
            aria-label="Music volume"
          />
        </GField>

        <GField
          label="Voice Volume"
          helper="Controls teammate comms, radio chatter, and spoken lines."
          width="full"
        >
          <GSlider
            v-model="voiceVolume"
            :min="0"
            :max="100"
            :step="1"
            value-suffix="%"
            width="full"
            preset="quiet"
            aria-label="Voice volume"
          />
        </GField>

        <GField
          label="SFX Volume"
          helper="Controls footsteps, weapons, impacts, and other world effects."
          width="full"
          class="audio-settings__volume-wide"
        >
          <GSlider
            v-model="sfxVolume"
            :min="0"
            :max="100"
            :step="1"
            value-suffix="%"
            width="full"
            preset="quiet"
            aria-label="Sound effects volume"
          />
        </GField>
      </div>
    </section>
  </section>
</template>

<style scoped>
.audio-settings {
  display: grid;
  align-content: start;
  gap: 1rem;
  min-height: 100%;
}

.audio-settings__header {
  display: grid;
  gap: 0.55rem;
}

.audio-settings__title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.audio-settings__title {
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

.audio-settings__summary {
  max-width: 44rem;
  margin: 0;
}

.audio-settings__group {
  display: grid;
  gap: 1rem;
}

.audio-settings__mode-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.audio-settings__threshold-row {
  display: grid;
  gap: 0.55rem;
}

.audio-settings__threshold-row--disabled {
  opacity: 0.52;
}

.audio-settings__threshold-copy {
  max-width: 38rem;
  margin: 0;
}

.audio-settings__volume-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.audio-settings__volume-wide {
  grid-column: 1 / -1;
}

.audio-settings__divider {
  margin-top: 0.35rem;
}

.audio-settings__feature-field :deep(.gfield__head) {
  gap: 0.22rem;
  padding-bottom: 0.45rem;
}

.audio-settings__feature-field :deep(.gfield__label) {
  color: rgba(244, 248, 236, 0.98);
  font-size: 1.08rem;
  letter-spacing: 0.16em;
  text-shadow: 0 0 1rem rgba(198, 255, 74, 0.12);
}

.audio-settings__feature-field :deep(.gfield__helper) {
  max-width: 44rem;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  line-height: 1.5;
  color: rgba(216, 225, 214, 0.74);
}

@media (max-width: 64rem) {
  .audio-settings__volume-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 48rem) {
  .audio-settings__title-row {
    align-items: flex-start;
  }

  .audio-settings__mode-list {
    grid-template-columns: 1fr;
  }
}
</style>
