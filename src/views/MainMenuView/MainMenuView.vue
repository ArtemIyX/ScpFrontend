<script lang="ts" src="./MainMenuView.ts"></script>

<template>
  <main class="ui-page main-menu">
    <div class="main-menu__backdrop" aria-hidden="true">
      <div class="main-menu__glow main-menu__glow--left"></div>
      <div class="main-menu__glow main-menu__glow--right"></div>
      <div class="main-menu__grid"></div>
    </div>

    <section class="main-menu__stage" :class="{ 'main-menu__stage--play': isPlayTab }">
      <div class="main-menu__topbar">
        <div class="main-menu__tabs-frame" aria-hidden="true">
          <span class="main-menu__tabs-line main-menu__tabs-line--left"></span>
          <span class="main-menu__tabs-line main-menu__tabs-line--right"></span>
        </div>

        <GTabs
          v-model="activeTab"
          class="main-menu__tabs"
          :tabs="menuTabs"
          preset="ghost"
          size="lg"
          align="center"
          aria-label="Main menu navigation"
        />
      </div>

      <GWindow
        class="main-menu__window"
        :class="{ 'main-menu__window--play': isPlayTab }"
        :status="currentTab.status"
        width="full"
        :height="isPlayTab ? 'full' : 'auto'"
        strong
      >
        <div class="main-menu__body" :class="{ 'main-menu__body--play': isPlayTab }">
          <div class="main-menu__title-wrap" :class="{ 'main-menu__title-wrap--play': isPlayTab }">
            <div class="main-menu__sigil" aria-hidden="true"></div>
            <div class="main-menu__copy" :class="{ 'main-menu__copy--play': isPlayTab }">
              <GText as="p" preset="caps" class="main-menu__eyebrow">
                SCP Tactical Command
              </GText>
              <GText as="h1" preset="title" class="main-menu__title">
                {{ currentTab.heading }}
              </GText>
              <GText as="p" preset="body" class="main-menu__subtitle">
                {{ currentTab.detail }}
              </GText>
            </div>
          </div>

          <component
            :is="currentSubview"
            v-if="currentSubview"
            class="main-menu__subview"
            :class="{ 'main-menu__subview--play': isPlayTab }"
          />
        </div>
      </GWindow>
    </section>
  </main>
</template>

<style scoped src="./MainMenuView.css"></style>
