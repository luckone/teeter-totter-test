<template>
  <div class="game-container">
    <GameControls
      @toggle-pause="togglePause"
      @toggle-auto-mode="toggleAutoMode"
    />
    <GameStatus
      :balance="balance"
      :score="score"
    />
    <canvas
      ref="gameCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      @keydown.left="moveFallingShape(-1)"
      @keydown.right="moveFallingShape(1)"
      tabindex="0"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTeeterTotter } from '@/composables/useTeeterTotter'
import { GAME_CONSTANTS } from '@/types/game'
import GameControls from '@/components/GameControls.vue'
import GameStatus from '@/components/GameStatus.vue'

const canvasWidth = GAME_CONSTANTS.CANVAS_WIDTH
const canvasHeight = GAME_CONSTANTS.CANVAS_HEIGHT

const gameCanvas = ref<HTMLCanvasElement | null>(null)
const {
  balance,
  score,
  gameLoop,
  moveFallingShape,
  togglePause,
  toggleAutoMode,
  stopGame
} = useTeeterTotter(canvasWidth, canvasHeight)

onMounted(() => {
  if (gameCanvas.value) {
    const ctx = (gameCanvas.value as HTMLCanvasElement).getContext('2d')
    if (ctx) {
      (gameCanvas.value as HTMLCanvasElement).focus()
      gameLoop(ctx)
    }
  }
})

onUnmounted(() => {
  stopGame()
})
</script>

<style scoped>
.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f0f0;
  font-family: Arial, sans-serif;
  position: relative;
}

canvas {
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  outline: none;
}
</style>
