<script setup lang="ts">
import { ref } from 'vue'

const language = ref('en')

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
]
</script>

<template>
  <section class="settings-tab-view" aria-label="Gameplay settings">
    <h1 class="settings-tab-view__title">Gameplay</h1>

    <GField label="Language" width="full" class="settings-tab-view__language-field">
      <GCombo
        v-model="language"
        :options="languageOptions"
        width="full"
        preset="quiet"
        aria-label="Language"
      />
    </GField>
  </section>
</template>

<style scoped>
.settings-tab-view {
  display: grid;
  align-content: start;
  min-height: 100%;
}

.settings-tab-view__title {
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

.settings-tab-view__language-field {
  margin-top: 2rem;
  max-width: 28rem;
}
</style>
