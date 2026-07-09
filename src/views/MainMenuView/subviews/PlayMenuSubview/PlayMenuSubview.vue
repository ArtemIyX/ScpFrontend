<script lang="ts" src="./PlayMenuSubview.ts"></script>

<template>
  <section class="play-menu" aria-label="Play menu">
    <div class="play-menu__stats">
      <div v-for="item in queueStats" :key="item.label" class="play-menu__stat">
        <GText as="span" preset="caps" class="play-menu__stat-label">{{ item.label }}</GText>
        <GText as="span" preset="header" class="play-menu__stat-value">{{ item.value }}</GText>
      </div>
    </div>

    <div class="play-menu__grid">
      <article v-for="card in missionCards" :key="card.title" class="play-menu__card">
        <div class="play-menu__card-header">
          <GText as="h2" preset="header" class="play-menu__card-title">{{ card.title }}</GText>
          <GText as="span" preset="caps" class="play-menu__card-meta">{{ card.meta }}</GText>
        </div>

        <GText as="p" preset="body" class="play-menu__card-copy">
          {{ card.description }}
        </GText>

        <div class="play-menu__card-actions">
          <GButton preset="accent">Select</GButton>
          <GButton preset="ghost">Details</GButton>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped src="./PlayMenuSubview.css"></style>
