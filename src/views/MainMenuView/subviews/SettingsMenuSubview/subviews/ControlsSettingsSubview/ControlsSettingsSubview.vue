<script lang="ts" src="./ControlsSettingsSubview.ts"></script>

<template>
  <section class="controls-settings" aria-label="Controls settings">
    <section class="controls-settings__section" aria-label="Mouse sensitivity settings">
      <GField label="Mouse Sensitivity" width="full" class="controls-settings__feature-field">
        <div class="controls-settings__sensitivity-row">
          <GSlider
            v-model="mouseSensitivity"
            :min="0.001"
            :max="200"
            :step="0.001"
            :show-value="false"
            width="full"
            preset="quiet"
            aria-label="Mouse sensitivity slider"
          />

          <GNumberInput
            v-model="mouseSensitivity"
            mode="float"
            :precision="3"
            :min="0.001"
            :max="200"
            :step="0.001"
            :step-buttons="false"
            :show-value="false"
            width="auto"
            preset="quiet"
            aria-label="Mouse sensitivity value"
          />
        </div>

        <GText as="p" preset="muted" class="controls-settings__sensitivity-copy">
          Higher values turn the camera faster for the same mouse movement. Lower values feel steadier and more precise.
        </GText>
      </GField>
    </section>

    <GDivider label="Movement" preset="quiet" class="controls-settings__divider" />

    <section class="controls-settings__section" aria-label="Movement controls">
      <div class="controls-settings__checkbox-list">
        <GCheckbox v-model="invertYAxis" preset="quiet">Invert Y axis</GCheckbox>
        <GCheckbox v-model="holdToSprint" preset="quiet">Hold to sprint</GCheckbox>
        <GCheckbox v-model="holdToCrouch" preset="quiet">Hold to crouch</GCheckbox>
      </div>
    </section>

    <GDivider label="Character" preset="quiet" class="controls-settings__divider" />

    <section class="controls-settings__section" aria-label="Character controls">
      <div class="controls-settings__checkbox-list">
        <GCheckbox v-model="holdToSelectItem" preset="quiet">Hold to select item</GCheckbox>
        <GCheckbox v-model="autoSwitchNewItemPickedUp" preset="quiet">Auto-switch newly picked up item</GCheckbox>
        <GCheckbox v-model="holdToSeeInventory" preset="quiet">Hold to see inventory</GCheckbox>
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
  max-width: 32rem;
  margin: 0;
}

.controls-settings__section {
  display: grid;
  gap: 1rem;
}

.controls-settings__feature-field :deep(.gfield__head) {
  display: flex;
  align-items: center;
  gap: 0.22rem;
  padding-bottom: 0.6rem;
}

.controls-settings__feature-field :deep(.gfield__label) {
  color: rgba(244, 248, 236, 0.98);
  font-size: 1.08rem;
  letter-spacing: 0.16em;
  text-shadow: 0 0 1rem rgba(198, 255, 74, 0.12);
}

.controls-settings__sensitivity-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(8rem, 10rem);
  gap: 1rem;
  align-items: end;
}

.controls-settings__sensitivity-copy {
  max-width: 40rem;
  margin: 0.5rem 0 0;
}

.controls-settings__checkbox-list {
  display: grid;
  gap: 0.8rem;
}

.controls-settings__divider {
  margin-top: 0.35rem;
}

@media (max-width: 48rem) {
  .controls-settings__sensitivity-row {
    grid-template-columns: 1fr;
  }
}
</style>
