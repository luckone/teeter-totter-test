import { ref, computed } from 'vue'
import {
  GameState,
  GAME_CONSTANTS, Shape
} from '@/types/game'
import { useGamePhysics } from '@/composables/useGamePhysics'

export function useTeeterTotter(
  canvasWidth = GAME_CONSTANTS.CANVAS_WIDTH,
  canvasHeight = GAME_CONSTANTS.CANVAS_HEIGHT
) {
  const gameState = ref<GameState>({
    isPaused: false,
    isAutoMode: false,
    angle: 0,
    score: 0,
    fallingShape: null,
    leftShapes: [],
    rightShapes: [],
    lastSpawnTime: 0
  })

  const {
    spawnShape,
    updateShape,
    calculateBalance
  } = useGamePhysics(canvasWidth, canvasHeight)

  const balance = computed(() => Math.round(gameState.value.angle))
  const score = computed(() => gameState.value.score)

  let ctx: CanvasRenderingContext2D | null = null
  let animationFrameId: number | null = null

  function update() {
    if (gameState.value.isPaused) return

    const currentTime = Date.now()
    if (
      !gameState.value.fallingShape &&
      currentTime - gameState.value.lastSpawnTime > 2000
    ) {
      gameState.value.fallingShape = spawnShape(true)
      gameState.value.lastSpawnTime = currentTime

      // Random chance to spawn right shape
      if (Math.random() < 0.3) {
        gameState.value.rightShapes.push(spawnShape(false))
      }
    }

    // Update shapes
    if (gameState.value.fallingShape) {
      const shapeAdded = updateShape(
        gameState.value.fallingShape,
        gameState
      )
      if (shapeAdded) {
        gameState.value.score++
        gameState.value.fallingShape = null
      }
    }

    gameState.value.leftShapes.forEach(shape =>
      updateShape(shape, gameState)
    )

    gameState.value.rightShapes.forEach(shape =>
      updateShape(shape, gameState)
    )

    gameState.value.angle = calculateBalance(gameState)

    // Check if the game should end
    if (Math.abs(gameState.value.angle) >= GAME_CONSTANTS.MAX_ANGLE) {
      endGame()
    }
  }

  function draw(canvasContext: CanvasRenderingContext2D) {
    ctx = canvasContext
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Draw beam
    ctx.save()
    ctx.translate(canvasWidth / 2, canvasHeight - 100)
    ctx.rotate((gameState.value.angle * Math.PI) / 180)

    // Pivot
    ctx.fillStyle = '#666'
    ctx.beginPath()
    ctx.moveTo(30, 0)
    ctx.lineTo(-30, 0)
    ctx.lineTo(0, 50)
    ctx.fill()

    // Beam
    ctx.fillStyle = 'red'
    ctx.fillRect(-GAME_CONSTANTS.BEAM_LENGTH / 2, -5, GAME_CONSTANTS.BEAM_LENGTH, 10)

    ctx.restore()

    // Draw shapes
    const drawShape = (shape: Shape) => {
      ctx!.save()
      ctx!.translate(shape.x, shape.y)
      ctx!.rotate((shape.rotation * Math.PI) / 180)
      ctx!.fillStyle = shape.color

      ctx!.beginPath()
      switch (shape.type) {
        case 'triangle':
          ctx!.moveTo(-shape.size / 2, shape.size / 2)
          ctx!.lineTo(shape.size / 2, shape.size / 2)
          ctx!.lineTo(0, -shape.size / 2)
          break
        case 'circle':
          ctx!.arc(0, 0, shape.size / 2, 0, Math.PI * 2)
          break
        case 'rectangle':
          ctx!.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size)
          break
      }

      ctx!.fill()
      ctx!.restore()

      // Draw weight text
      ctx!.save()
      ctx!.translate(shape.x, shape.y)
      ctx!.fillStyle = 'white'
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'middle'
      ctx!.font = `${shape.size / 3}px Arial`
      ctx!.fillText(`${shape.weight}kg`, 0, 0)
      ctx!.restore()
    }

    if (gameState.value.fallingShape) {
      drawShape(gameState.value.fallingShape)
    }
    gameState.value.leftShapes.forEach(drawShape)
    gameState.value.rightShapes.forEach(drawShape)
  }

  function gameLoop(canvasContext: CanvasRenderingContext2D) {
    update()
    draw(canvasContext)
    animationFrameId = requestAnimationFrame(() =>
      gameLoop(canvasContext)
    )
  }

  function moveFallingShape(direction: number) {
    if (
      gameState.value.isPaused ||
      !gameState.value.fallingShape ||
      gameState.value.isAutoMode
    ) return
    gameState.value.fallingShape.x += direction * 20
  }

  function togglePause() {
    gameState.value.isPaused = !gameState.value.isPaused
  }

  function toggleAutoMode() {
    gameState.value.isAutoMode = !gameState.value.isAutoMode
  }

  function endGame() {
    gameState.value.isPaused = true
    alert(`Game Over! Score: ${gameState.value.score}`)
    location.reload()
  }

  function stopGame() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  }

  return {
    gameState,
    balance,
    score,
    gameLoop,
    moveFallingShape,
    togglePause,
    toggleAutoMode,
    stopGame
  }
}
