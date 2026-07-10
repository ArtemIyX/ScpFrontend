<template>
  <section class="settings-tab-view" aria-label="Audio settings">
    <h1 class="settings-tab-view__title">Audio</h1>
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
</style>
