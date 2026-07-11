<script lang="ts" src="./GraphicsSettingsSubview.ts"></script>

<template>
  <section class="graphics-settings" aria-label="Graphics settings">
    <section class="graphics-settings__group" aria-label="Scalability settings">
      <div class="graphics-settings__stack">
        <GField
          label="Resolution Scale"
          helper="Controls internal rendering scale before final output."
          width="full"
          class="graphics-settings__feature-field"
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

        <GField
          label="Anti-Aliasing Method"
          helper="Selects the reconstruction or edge-smoothing technique before quality tuning."
          width="full"
          class="graphics-settings__feature-field"
        >
          <div class="graphics-settings__aa-stack">
            <div class="graphics-settings__aa-top-grid">
              <GField
                label="Method"
                helper="Locked to TAA while upscale or frame generation is active."
                width="full"
              >
                <GCombo
                  v-model="antiAliasingMethod"
                  :options="antiAliasingMethodOptions"
                  :disabled="antiAliasingMethodLocked"
                  width="full"
                  preset="quiet"
                  placeholder="Select anti-aliasing method"
                />
              </GField>

              <GField
                label="Frame Gen"
                helper="Active multipliers also force anti-aliasing method to TAA."
                width="full"
              >
                <GCombo
                  v-model="frameGeneration"
                  :options="frameGenerationOptions"
                  width="full"
                  preset="quiet"
                  placeholder="Select frame generation"
                />
              </GField>
            </div>

            <div class="graphics-settings__upscale-grid">
              <GField
                label="Upscale Mode"
                helper="Any active upscaler forces anti-aliasing method to TAA."
                width="full"
              >
                <GCombo
                  v-model="upscaleMode"
                  :options="upscaleModeOptions"
                  width="full"
                  preset="quiet"
                  placeholder="Select upscale mode"
                />
              </GField>

              <GField
                label="Upscale Quality"
                helper="Enabled only while an upscaler is active."
                width="full"
              >
                <GCombo
                  v-model="dlssQuality"
                  :options="dlssQualityOptions"
                  :disabled="upscaleQualityDisabled"
                  width="full"
                  preset="quiet"
                  placeholder="Select upscale quality"
                />
              </GField>
            </div>
          </div>
        </GField>

        <GField
          label="View Distance Quality"
          helper="Affects how far geometry and scene detail remain fully resolved."
          width="full"
          class="graphics-settings__feature-field"
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
          class="graphics-settings__feature-field"
        >
          <GRail
            v-model="antiAliasingQuality"
            :items="scalabilityItems"
            width="full"
            preset="quiet"
            aria-label="Anti-aliasing quality"
          />
        </GField>

        <GField
          label="Material Quality Level"
          helper="Switches between reduced and full material feature paths."
          width="full"
          class="graphics-settings__feature-field"
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

    <section class="graphics-settings__group" aria-label="Post process settings">
      <GraphicsPresetField
        label="Post Process Quality"
        helper="Changing any detailed override flips this profile to Custom."
        :model-value="postProcessPreset"
        :items="postProcessPresetItems"
        :customize-open="postProcessCustomOpen"
        rail-aria-label="Post process quality"
        open-customize-label="Open post process customization"
        close-customize-label="Hide post process customization"
        @update:model-value="onPostProcessPresetChange"
        @toggle-customize="togglePostProcessCustomOpen"
      >
        <GraphicsNumberOverrideRow
          v-for="row in postProcessOverrideRows"
          :key="String(row.key)"
          :label="row.label"
          :cvar="row.cvar"
          :preset-values="row.presetValues"
          :model-value="postProcessSettings[row.key]"
          :min="row.min"
          :max="row.max"
          :step="row.step"
          :mode="row.mode"
          :precision="row.precision"
          :aria-label="row.ariaLabel"
          @update:model-value="updatePostProcessSetting(row.key, $event)"
        />
      </GraphicsPresetField>
    </section>

    <section class="graphics-settings__group" aria-label="Shadow settings">
      <GraphicsPresetField
        label="Shadow Quality"
        helper="Changing any detailed override flips this profile to Custom."
        :model-value="shadowPreset"
        :items="shadowPresetItems"
        :customize-open="shadowCustomOpen"
        rail-aria-label="Shadow quality"
        open-customize-label="Open shadow customization"
        close-customize-label="Hide shadow customization"
        @update:model-value="onShadowPresetChange"
        @toggle-customize="toggleShadowCustomOpen"
      >
        <GraphicsNumberOverrideRow
          v-for="row in shadowOverrideRows"
          :key="String(row.key)"
          :label="row.label"
          :cvar="row.cvar"
          :preset-values="row.presetValues"
          :model-value="shadowSettings[row.key]"
          :min="row.min"
          :max="row.max"
          :step="row.step"
          :mode="row.mode"
          :precision="row.precision"
          :aria-label="row.ariaLabel"
          @update:model-value="updateShadowSetting(row.key, $event)"
        />
      </GraphicsPresetField>
    </section>

    <section class="graphics-settings__group" aria-label="Texture settings">
      <GraphicsPresetField
        label="Texture Quality"
        helper="Controls mip bias, anisotropy, and streaming pool budget."
        :model-value="texturePreset"
        :items="texturePresetItems"
        :customize-open="textureCustomOpen"
        rail-aria-label="Texture quality"
        open-customize-label="Open texture customization"
        close-customize-label="Hide texture customization"
        @update:model-value="onTexturePresetChange"
        @toggle-customize="toggleTextureCustomOpen"
      >
        <GraphicsNumberOverrideRow
          v-for="row in textureOverrideRows"
          :key="String(row.key)"
          :label="row.label"
          :cvar="row.cvar"
          :preset-values="row.presetValues"
          :model-value="textureSettings[row.key]"
          :min="row.min"
          :max="row.max"
          :step="row.step"
          :mode="row.mode"
          :precision="row.precision"
          :aria-label="row.ariaLabel"
          @update:model-value="updateTextureSetting(row.key, $event)"
        />
      </GraphicsPresetField>
    </section>

    <section class="graphics-settings__group" aria-label="Effects settings">
      <GraphicsPresetField
        label="Effects Quality"
        helper="Controls translucency volume detail, refraction, scene color format, and detail response."
        :model-value="effectsPreset"
        :items="effectsPresetItems"
        :customize-open="effectsCustomOpen"
        rail-aria-label="Effects quality"
        open-customize-label="Open effects customization"
        close-customize-label="Hide effects customization"
        @update:model-value="onEffectsPresetChange"
        @toggle-customize="toggleEffectsCustomOpen"
      >
        <GraphicsNumberOverrideRow
          v-for="row in effectsOverrideRows"
          :key="String(row.key)"
          :label="row.label"
          :cvar="row.cvar"
          :preset-values="row.presetValues"
          :model-value="effectsSettings[row.key]"
          :min="row.min"
          :max="row.max"
          :step="row.step"
          :mode="row.mode"
          :precision="row.precision"
          :aria-label="row.ariaLabel"
          @update:model-value="updateEffectsSetting(row.key, $event)"
        />
      </GraphicsPresetField>
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

.graphics-settings__group {
  display: grid;
  gap: 1rem;
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

.graphics-settings__aa-stack {
  display: grid;
  gap: 0.8rem;
}

.graphics-settings__aa-top-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem 1rem;
}

.graphics-settings__upscale-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem 1rem;
}

.graphics-settings__feature-field :deep(.gfield__head) {
  gap: 0.22rem;
  padding-bottom: 0.45rem;
}

.graphics-settings__feature-field :deep(.gfield__label) {
  color: rgba(244, 248, 236, 0.98);
  font-size: 1.08rem;
  letter-spacing: 0.16em;
  text-shadow: 0 0 1rem rgba(198, 255, 74, 0.12);
}

.graphics-settings__feature-field :deep(.gfield__helper) {
  max-width: 44rem;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  line-height: 1.5;
  color: rgba(216, 225, 214, 0.74);
}

@media (max-width: 64rem) {
  .graphics-settings__quality-grid {
    grid-template-columns: 1fr;
  }

  .graphics-settings__upscale-grid {
    grid-template-columns: 1fr;
  }

  .graphics-settings__aa-top-grid {
    grid-template-columns: 1fr;
  }
}
</style>
