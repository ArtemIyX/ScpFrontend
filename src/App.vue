<script setup lang="ts">
import DebugOverlay from '@/components/debug/DebugOverlay.vue'
</script>

<template>
  <div class="ui-shell">
    <router-view />
    <DebugOverlay />
  </div>
</template>

<style scoped>
.ui-shell {
  position: relative;
  min-height: 100vh;
}
</style>
