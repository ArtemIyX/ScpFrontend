<template>
  <main class="ui-page main-menu">
    <div class="main-menu__backdrop" aria-hidden="true">
      <div class="main-menu__glow main-menu__glow--left"></div>
      <div class="main-menu__glow main-menu__glow--right"></div>
      <div class="main-menu__grid"></div>
    </div>

    <section class="main-menu__stage">
      <GWindow
        class="main-menu__window"
        title="Main Menu"
        status="Online"
        width="full"
        height="auto"
        strong
      >
        <div class="main-menu__title-wrap">
          <div class="main-menu__sigil" aria-hidden="true"></div>
          <GText as="h1" preset="title" class="main-menu__title">
            Main Menu
          </GText>
        </div>
      </GWindow>
    </section>
  </main>
</template>

<style scoped>
.main-menu {
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background:
    radial-gradient(circle at top, rgba(198, 255, 74, 0.08), transparent 32%),
    linear-gradient(180deg, rgba(4, 6, 8, 0.78), rgba(2, 3, 4, 0.96));
}

.main-menu__backdrop {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.main-menu__glow {
  position: absolute;
  width: 36rem;
  height: 36rem;
  border-radius: 50%;
  filter: blur(5rem);
  opacity: 0.42;
}

.main-menu__glow--left {
  top: -18rem;
  left: -10rem;
  background: rgba(198, 255, 74, 0.18);
}

.main-menu__glow--right {
  right: -12rem;
  bottom: -20rem;
  background: rgba(94, 128, 255, 0.14);
}

.main-menu__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(198, 255, 74, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(198, 255, 74, 0.08) 1px, transparent 1px);
  background-size: 6rem 6rem;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.85));
}

.main-menu__stage {
  position: relative;
  z-index: 1;
  width: min(100%, 62rem);
}

.main-menu__window {
  border-radius: 0;
  border-color: rgba(198, 255, 74, 0.28);
  background:
    linear-gradient(180deg, rgba(11, 15, 12, 0.95), rgba(5, 8, 7, 0.98)),
    rgba(0, 0, 0, 0.72);
  box-shadow:
    0 0 0 1px rgba(198, 255, 74, 0.08),
    0 2rem 4rem rgba(0, 0, 0, 0.42);
}

.main-menu__window::before,
.main-menu__window::after {
  content: '';
  position: absolute;
  left: 1.25rem;
  right: 1.25rem;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(198, 255, 74, 0.45), transparent);
}

.main-menu__window::before {
  top: 0.75rem;
}

.main-menu__window::after {
  bottom: 0.75rem;
}

.main-menu__title-wrap {
  display: grid;
  place-items: center;
  gap: 1.5rem;
  min-height: 18rem;
  padding: 2rem 1rem;
}

.main-menu__sigil {
  width: 5.5rem;
  height: 5.5rem;
  border: 1px solid rgba(198, 255, 74, 0.4);
  background:
    radial-gradient(circle, rgba(198, 255, 74, 0.18), transparent 62%),
    url('/icons/scp-sigil.svg') center / contain no-repeat;
  box-shadow:
    inset 0 0 1.5rem rgba(198, 255, 74, 0.12),
    0 0 2rem rgba(198, 255, 74, 0.12);
}

.main-menu__title {
  text-align: center;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-shadow: 0 0 1.5rem rgba(198, 255, 74, 0.18);
}

@media (max-width: 48rem) {
  .main-menu {
    padding: 1rem;
  }

  .main-menu__title-wrap {
    min-height: 14rem;
    gap: 1rem;
    padding: 1.5rem 0.75rem;
  }

  .main-menu__sigil {
    width: 4.5rem;
    height: 4.5rem;
  }
}
</style>
