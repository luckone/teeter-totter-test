<template>
  <div class="status">
    <div>Balance: {{ balance }}°</div>
    <div>Score: {{ score }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  balance: number
  score: number
}>()
</script>

<style scoped>
.status {
  position: absolute;
  top: 20px;
  right: 20px;
  text-align: right;
}
</style>
