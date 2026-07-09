<script lang="ts" src="./PlaySquadDock.ts"></script>

<template>
  <section class="play-squad-dock" aria-label="Squad lobby slots">
    <div class="play-squad-dock__row">
      <button type="button" class="play-squad-dock__invite-button">
        <span class="play-squad-dock__invite-icon" aria-hidden="true"></span>
        Invite players
      </button>

      <div class="play-squad-dock__slots">
        <button
          v-for="slot in squadSlots"
          :key="slot.id"
          type="button"
          class="play-squad-dock__slot"
          :class="{ 'play-squad-dock__slot--filled': slot.filled }"
          :aria-label="slot.name"
        >
          <div class="play-squad-dock__avatar" :class="{ 'play-squad-dock__avatar--filled': slot.filled }">
            <span v-if="slot.filled" class="play-squad-dock__avatar-text">O17</span>
            <span v-else class="play-squad-dock__avatar-plus" aria-hidden="true">+</span>
          </div>

          <div class="play-squad-dock__tooltip" role="tooltip">
            <span class="play-squad-dock__tooltip-label">{{ slot.label }}</span>
            <span class="play-squad-dock__tooltip-name">{{ slot.name }}</span>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped src="./PlaySquadDock.css"></style>
