import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTeeterTotter } from "@/composables/useTeeterTotter.ts";

describe('useTeeterTotter', () => {
  let teeterTotter: ReturnType<typeof useTeeterTotter>

  beforeEach(() => {
    teeterTotter = useTeeterTotter()
    vi.useFakeTimers()
  })

  it('initializes with correct default state', () => {
    expect(teeterTotter.gameState.value).toMatchObject({
      isPaused: false,
      isAutoMode: false,
      angle: 0,
      score: 0,
      fallingShape: null,
      leftShapes: [],
      rightShapes: []
    })
  })

  it('moves falling shape correctly', () => {
    const shape = { x: 400, y: 0 }
    teeterTotter.gameState.value.fallingShape = shape as any

    teeterTotter.moveFallingShape(1)
    expect(shape.x).toBe(420)

    teeterTotter.moveFallingShape(-1)
    expect(shape.x).toBe(400)
  })

  it('toggles pause state', () => {
    teeterTotter.togglePause()
    expect(teeterTotter.gameState.value.isPaused).toBe(true)

    teeterTotter.togglePause()
    expect(teeterTotter.gameState.value.isPaused).toBe(false)
  })

  it('updates score when shape lands', () => {
    const initialScore = teeterTotter.score.value
    teeterTotter.gameState.value.score++
    expect(teeterTotter.score.value).toBe(initialScore + 1)
  })
})
