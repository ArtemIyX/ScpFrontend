<script lang="ts" src="./GraphicsSettingsSubview.ts"></script>

<template>
  <section class="graphics-settings" aria-label="Graphics settings">
    <section class="graphics-settings__group" aria-label="Scalability settings">

      <div class="graphics-settings__stack">
        <GField
          label="Resolution Scale"
          helper="Controls internal rendering scale before final output."
          width="full"
        >
          <GSlider
            v-model="resolutionScale"
            :min="50"
            :max="100"
            :step="1"
            value-suffix="%"
            width="full"
            preset="quiet"
            aria-label="Resolution scale"
          />
        </GField>

        <div class="graphics-settings__quality-grid">
          <GField
            label="View Distance Quality"
            helper="Affects how far geometry and scene detail remain fully resolved."
            width="full"
          >
            <GRail
              v-model="viewDistanceQuality"
              :items="scalabilityItems"
              width="full"
              preset="quiet"
              aria-label="View distance quality"
            />
          </GField>

          <GField
            label="Anti-Aliasing Quality"
            helper="Controls edge smoothing quality and related resolve cost."
            width="full"
          >
            <GRail
              v-model="antiAliasingQuality"
              :items="scalabilityItems"
              width="full"
              preset="quiet"
              aria-label="Anti-aliasing quality"
            />
          </GField>
        </div>

        <GField
          label="Material Quality Level"
          helper="Switches between reduced and full material feature paths."
          width="full"
        >
          <GRail
            v-model="materialQualityLevel"
            :items="materialQualityItems"
            width="full"
            preset="quiet"
            aria-label="Material quality level"
          />
        </GField>
      </div>
    </section>
  </section>
</template>

<style scoped>
.graphics-settings {
  display: grid;
  align-content: start;
  gap: 1rem;
  min-height: 100%;
}

.graphics-settings__header {
  display: grid;
  gap: 0.55rem;
}

.graphics-settings__title {
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

.graphics-settings__summary {
  max-width: 42rem;
  margin: 0;
}

.graphics-settings__divider {
  margin-top: 0.35rem;
}

.graphics-settings__group {
  display: grid;
  gap: 1rem;
}

.graphics-settings__group-summary {
  max-width: 42rem;
  margin: 0;
}

.graphics-settings__stack {
  display: grid;
  gap: 1rem;
}

.graphics-settings__quality-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (max-width: 64rem) {
  .graphics-settings__quality-grid {
    grid-template-columns: 1fr;
  }
}
</style>
