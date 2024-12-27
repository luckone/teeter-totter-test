import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useGamePhysics } from '@/composables/useGamePhysics'
import { GAME_CONSTANTS } from '@/types/game'

describe('useGamePhysics', () => {
  const { spawnShape, updateShape, calculateBalance } = useGamePhysics(
    GAME_CONSTANTS.CANVAS_WIDTH,
    GAME_CONSTANTS.CANVAS_HEIGHT
  )

  it('spawns shape with correct properties', () => {
    const shape = spawnShape(true)

    expect(shape).toMatchObject({
      isLeft: true,
      landed: false,
      landedDistance: 0,
      rotation: 0
    })
    expect(shape.weight).toBeGreaterThanOrEqual(1)
    expect(shape.weight).toBeLessThanOrEqual(9)
    expect(['triangle', 'circle', 'rectangle']).toContain(shape.type)
  })

  it('updates shape position based on gravity', () => {
    const shape = spawnShape(true)
    const gameState = ref({ angle: 0, leftShapes: [], rightShapes: [], isPaused: false, isAutoMode: false, score: 0, fallingShape: null, lastSpawnTime: 0 })
    const initialY = shape.y

    updateShape(shape, gameState)

    expect(shape.y).toBeGreaterThan(initialY)
    expect(shape.velocityY).toBeLessThanOrEqual(GAME_CONSTANTS.MAX_FALL_SPEED)
  })

  describe('calculateBalance', () => {
    it('respects negative maximum angle limit', () => {
      const gameState = ref({
        angle: 0,
        isPaused: false,
        isAutoMode: false,
        score: 0,
        fallingShape: null,
        lastSpawnTime: 0,
        leftShapes: [
          { weight: 50, x: GAME_CONSTANTS.CANVAS_WIDTH / 2 - 100 } as any
        ],
        rightShapes: []
      })
      expect(calculateBalance(gameState)).toBe(-GAME_CONSTANTS.MAX_ANGLE)
    })
  })
})
