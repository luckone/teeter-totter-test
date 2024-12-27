<template>
  <div class="controls">
    <button @click="$emit('toggle-pause')">Pause/Resume</button>
    <button @click="$emit('toggle-auto-mode')">Auto Mode</button>
  </div>
</template>

<script setup lang="ts">
defineEmits(['toggle-pause', 'toggle-auto-mode'])
</script>

<style scoped>
.controls {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
}
</style>
