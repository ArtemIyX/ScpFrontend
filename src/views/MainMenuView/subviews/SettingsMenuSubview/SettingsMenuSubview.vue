<script lang="ts" src="./SettingsMenuSubview.ts"></script>

<template>
  <section class="settings-menu" aria-label="Settings menu">
    <GWindow class="settings-menu__window" padding="lg" width="full" strong>
      <div class="settings-menu__layout">
        <GTabs
          v-model="activeTab"
          class="settings-menu__tabs"
          :tabs="settingsTabs"
          preset="quiet"
          size="md"
          width="full"
          aria-label="Settings navigation"
        />

        <div class="settings-menu__content-frame">
          <GScroller class="settings-menu__scroller">
            <component :is="currentSubview" class="settings-menu__tab-view" />
          </GScroller>
        </div>
      </div>
    </GWindow>
  </section>
</template>

<style scoped>
.settings-menu {
  display: grid;
  place-items: center;
  min-width: 0;
  min-height: 100%;
  padding: 1.5rem 0 2rem;
}

.settings-menu__window {
  width: min(100%, 76rem);
  height: min(100%, calc(100vh - 9.5rem));
  border: 1px solid rgba(198, 255, 74, 0.16);
  background:
    linear-gradient(180deg, rgba(8, 12, 11, 0.94), rgba(4, 6, 6, 0.92)),
    rgba(0, 0, 0, 0.56);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 1.75rem 4rem rgba(0, 0, 0, 0.42),
    0 0 2.4rem rgba(198, 255, 74, 0.06);
  transform: translateY(0.8rem);
}

.settings-menu__layout {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1rem;
  height: 100%;
  min-height: 0;
}

.settings-menu__tabs {
  --gtabs-gap: 0.5rem;
  --gtabs-panel-padding: 0;
  --gtabs-tab-radius: 0.75rem;
  --gtabs-tab-min-height: 3.25rem;
  --gtabs-tab-padding-x: 1rem;
  --gtabs-tab-padding-y: 0.85rem;
}

.settings-menu__tabs:deep(.gtabs__list) {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.settings-menu__tabs:deep(.gtabs__tab) {
  justify-content: center;
  text-align: center;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.settings-menu__tabs:deep(.gtabs__tab-body) {
  justify-items: center;
}

.settings-menu__tabs:deep(.gtabs__description),
.settings-menu__tabs:deep(.gtabs__panel) {
  display: none;
}

.settings-menu__content-frame {
  min-width: 0;
  min-height: 0;
  border: 1px solid rgba(198, 255, 74, 0.12);
  background:
    linear-gradient(180deg, rgba(198, 255, 74, 0.03), transparent 14%),
    linear-gradient(180deg, rgba(12, 16, 15, 0.9), rgba(7, 10, 10, 0.92));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.03),
    inset 0 0 0 1px rgba(198, 255, 74, 0.02);
}

.settings-menu__scroller {
  height: 100%;
}

.settings-menu__scroller:deep(.gscroller__content) {
  padding: 1.5rem 1.5rem 1.75rem;
}

.settings-menu__tab-view {
  min-height: 100%;
}

@media (max-width: 64rem) {
  .settings-menu__tabs:deep(.gtabs__list) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 48rem) {
  .settings-menu {
    padding: 1rem 0 1.5rem;
  }

  .settings-menu__window {
    width: 100%;
    height: min(100%, calc(100vh - 7rem));
    transform: translateY(0.4rem);
  }

  .settings-menu__tabs:deep(.gtabs__list) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .settings-menu__scroller:deep(.gscroller__content) {
    padding: 1.125rem 1rem 1.5rem;
  }
}
</style>
