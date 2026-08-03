<script lang="ts" src="./ControlsSettingsSubview.ts"></script>

<template>
  <section class="controls-settings" aria-label="Controls settings">
    <section class="controls-settings__section" aria-label="Mouse sensitivity settings">
      <GField table="Local.Settings.Controls" label-key="#Group_MouseSensitivity" width="full" class="controls-settings__feature-field">
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

        <GText table="Local.Settings.Controls" text-key="#Helper_MouseSensitivity" as="p" preset="muted" class="controls-settings__sensitivity-copy" />
      </GField>
    </section>

    <GDivider table="Local.Settings.Controls" label-key="#Divider_Movement" preset="quiet" class="controls-settings__divider" />

    <section class="controls-settings__section" aria-label="Movement controls">
      <div class="controls-settings__checkbox-list">
        <GCheckbox v-model="invertYAxis" table="Local.Settings.Controls" label-key="#Label_InvertYAxis" preset="quiet" />
        <GCheckbox v-model="holdToSprint" table="Local.Settings.Controls" label-key="#Label_HoldToSprint" preset="quiet" />
        <GCheckbox v-model="holdToCrouch" table="Local.Settings.Controls" label-key="#Label_HoldToCrouch" preset="quiet" />
      </div>
    </section>

    <GDivider table="Local.Settings.Controls" label-key="#Divider_Character" preset="quiet" class="controls-settings__divider" />

    <section class="controls-settings__section" aria-label="Character controls">
      <div class="controls-settings__checkbox-list">
        <GCheckbox v-model="holdToSelectItem" table="Local.Settings.Controls" label-key="#Label_HoldToSelectItem" preset="quiet" />
        <GCheckbox v-model="autoSwitchNewItemPickedUp" table="Local.Settings.Controls" label-key="#Label_AutoSwitchNewItemPickedUp" preset="quiet" />
        <GCheckbox v-model="holdToSeeInventory" table="Local.Settings.Controls" label-key="#Label_HoldToSeeInventory" preset="quiet" />
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
