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
  justify-items: center;
  align-content: start;
  min-width: 0;
  min-height: 100%;
  padding: 1.5rem 0 2rem;
}

.settings-menu__window {
  width: min(100%, 76rem);
  height: min(100%, calc(100vh - 9.5rem));
  margin: 0 auto;
  border: 0.0625rem solid rgba(198, 255, 74, 0.16);
  background:
    linear-gradient(180deg, rgba(8, 12, 11, 0.94), rgba(4, 6, 6, 0.92)),
    rgba(0, 0, 0, 0.56);
  box-shadow:
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.04),
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
  --gtabs-tab-radius: 0.9rem;
  --gtabs-tab-min-height: 3.6rem;
  --gtabs-tab-padding-x: 1rem;
  --gtabs-tab-padding-y: 0.9rem;
}

.settings-menu__tabs:deep(.gtabs__list) {
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.6rem;
  padding: 0.5rem;
  border: 0.0625rem solid rgba(198, 255, 74, 0.12);
  background:
    linear-gradient(180deg, rgba(198, 255, 74, 0.04), rgba(198, 255, 74, 0.01)),
    linear-gradient(180deg, rgba(11, 15, 14, 0.92), rgba(6, 8, 8, 0.9));
  box-shadow:
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.04),
    inset 0 0 0 0.0625rem rgba(198, 255, 74, 0.03),
    0 1rem 2.2rem rgba(0, 0, 0, 0.26);
}

.settings-menu__tabs:deep(.gtabs__list)::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, transparent, rgba(198, 255, 74, 0.06), transparent),
    radial-gradient(circle at top center, rgba(43, 220, 255, 0.08), transparent 40%);
  pointer-events: none;
  opacity: 0.75;
}

.settings-menu__tabs:deep(.gtabs__tab) {
  overflow: hidden;
  justify-content: center;
  border: 0.0625rem solid rgba(198, 255, 74, 0.1);
  background:
    linear-gradient(180deg, rgba(20, 25, 24, 0.92), rgba(9, 12, 12, 0.94)),
    linear-gradient(135deg, rgba(198, 255, 74, 0.02), transparent 58%);
  box-shadow:
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.04),
    0 0.9rem 1.8rem rgba(0, 0, 0, 0.26);
  color: rgba(224, 229, 223, 0.82);
  text-align: center;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition:
    transform 140ms ease,
    color 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease,
    background 140ms ease;
}

.settings-menu__tabs:deep(.gtabs__tab)::before,
.settings-menu__tabs:deep(.gtabs__tab)::after {
  content: '';
  position: absolute;
  pointer-events: none;
  transition:
    opacity 140ms ease,
    transform 160ms ease;
}

.settings-menu__tabs:deep(.gtabs__tab)::before {
  inset: 0;
  background:
    linear-gradient(135deg, rgba(84, 201, 29, 0.18), transparent 40%),
    radial-gradient(circle at 100% 0, rgba(45, 210, 101, 0.14), transparent 42%);
  opacity: 0;
}

.settings-menu__tabs:deep(.gtabs__tab)::after {
  left: 18%;
  right: 18%;
  bottom: 0.38rem;
  height: 0.16rem;
  border-radius: 62.4375rem;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(198, 255, 74, 0.96),
    rgba(43, 220, 255, 0.92),
    transparent
  );
  box-shadow:
    0 0 1rem rgba(198, 255, 74, 0.34),
    0 0 1.25rem rgba(43, 220, 255, 0.16);
  transform: scaleX(0.4);
  opacity: 0;
}

.settings-menu__tabs:deep(.gtabs__tab:not(.gtabs__tab--active):hover) {
  transform: translateY(-0.18rem);
  border-color: rgba(84, 201, 29, 0.3);
  background:
    linear-gradient(180deg, rgba(34, 52, 18, 0.94), rgba(13, 20, 11, 0.96)),
    linear-gradient(
      135deg,
      rgba(84, 201, 29, 0.16),
      rgba(45, 210, 101, 0.07) 68%,
      transparent
    );
  box-shadow:
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.07),
    inset 0 0 0.85rem rgba(84, 201, 29, 0.05),
    0 1.1rem 2.1rem rgba(0, 0, 0, 0.32),
    0 0 1.1rem rgba(84, 201, 29, 0.1);
  color: rgba(242, 247, 239, 0.96);
}

.settings-menu__tabs:deep(.gtabs__tab:not(.gtabs__tab--active):hover)::before {
  opacity: 0.88;
}

.settings-menu__tabs:deep(.gtabs__tab:not(.gtabs__tab--active):hover)::after {
  transform: scaleX(0.62);
  opacity: 0.58;
}

.settings-menu__tabs:deep(.gtabs__tab--active) {
  border-color: rgba(255, 197, 58, 0.52);
  background:
    linear-gradient(180deg, rgba(82, 63, 10, 0.92), rgba(28, 21, 7, 0.96)),
    linear-gradient(135deg, rgba(255, 197, 58, 0.24), rgba(255, 176, 0, 0.1) 68%, transparent);
  box-shadow:
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.08),
    inset 0 0 1.7rem rgba(255, 197, 58, 0.1),
    0 1.25rem 2.4rem rgba(0, 0, 0, 0.34),
    0 0 1.9rem rgba(255, 197, 58, 0.16);
  color: rgba(255, 249, 228, 0.98);
}

.settings-menu__tabs:deep(.gtabs__tab--active)::before {
  opacity: 1;
  background:
    linear-gradient(135deg, rgba(255, 216, 107, 0.22), transparent 38%),
    radial-gradient(circle at 100% 0, rgba(255, 197, 58, 0.16), transparent 42%);
}

.settings-menu__tabs:deep(.gtabs__tab--active)::after {
  transform: scaleX(1);
  opacity: 1;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 216, 107, 0.98),
    rgba(255, 176, 0, 0.95),
    transparent
  );
  box-shadow:
    0 0 1rem rgba(255, 197, 58, 0.36),
    0 0 1.25rem rgba(255, 176, 0, 0.2);
}

.settings-menu__tabs:deep(.gtabs__tab--active:hover) {
  transform: none;
  border-color: rgba(255, 197, 58, 0.52);
  box-shadow:
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.08),
    inset 0 0 1.7rem rgba(255, 197, 58, 0.1),
    0 1.25rem 2.4rem rgba(0, 0, 0, 0.34),
    0 0 1.9rem rgba(255, 197, 58, 0.16);
}

.settings-menu__tabs:deep(.gtabs__tab--active:hover)::before {
  opacity: 1;
}

.settings-menu__tabs:deep(.gtabs__tab-body) {
  justify-items: center;
}

.settings-menu__tabs:deep(.gtabs__label) {
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 0 0.9rem rgba(198, 255, 74, 0.08);
}

.settings-menu__tabs:deep(.gtabs__description),
.settings-menu__tabs:deep(.gtabs__panel) {
  display: none;
}

.settings-menu__content-frame {
  min-width: 0;
  min-height: 0;
  border: 0.0625rem solid rgba(198, 255, 74, 0.12);
  background:
    linear-gradient(180deg, rgba(198, 255, 74, 0.03), transparent 14%),
    linear-gradient(180deg, rgba(12, 16, 15, 0.9), rgba(7, 10, 10, 0.92));
  box-shadow:
    inset 0 0.0625rem 0 rgba(255, 255, 255, 0.03),
    inset 0 0 0 0.0625rem rgba(198, 255, 74, 0.02);
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
