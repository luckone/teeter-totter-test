import { Ref } from 'vue'
import {
  Shape,
  ShapeType,
  GameState,
  SHAPES,
  GAME_CONSTANTS
} from '@/types/game'

export function createShape(
  type: ShapeType,
  weight: number,
  x: number,
  y: number,
  isLeft = true
): Shape {
  return {
    type,
    weight,
    x,
    y,
    size: weight * 10,
    color: GAME_CONSTANTS.COLORS[SHAPES.indexOf(type)],
    velocityY: 0,
    velocityX: 0,
    isLeft,
    rotation: 0,
    landed: false,
    landedDistance: 0
  }
}

export function useGamePhysics(
  canvasWidth: number,
  canvasHeight: number
) {
  function getBeamYAtX(x: number, angle: number): number {
    const centerX = canvasWidth / 2
    const centerY = canvasHeight - 100
    const relativeX = x - centerX
    const angleRad = (angle * Math.PI) / 180
    return centerY - relativeX * Math.tan(angleRad)
  }

  function spawnShape(isLeft = true): Shape {
    const type: ShapeType = SHAPES[Math.floor(Math.random() * SHAPES.length)]
    const weight = Math.floor(Math.random() * 9) + 1

    if (isLeft) {
      const centerX = canvasWidth / 2
      const randomOffset = Math.random() * 200 - 100
      const x = centerX + randomOffset
      return createShape(type, weight, x, 0, isLeft)
    } else {
      const x = canvasWidth / 2 + Math.random() * 200
      return createShape(type, weight, x, canvasHeight - 150, isLeft)
    }
  }

  function updateShape(
    shape: Shape,
    gameState: Ref<GameState>
  ): boolean {
    const { BEAM_LENGTH, GRAVITY, MAX_FALL_SPEED } = GAME_CONSTANTS

    if (!shape.landed) {
      shape.velocityY += GRAVITY
      shape.velocityY = Math.min(shape.velocityY, MAX_FALL_SPEED)
      shape.y += shape.velocityY
      shape.x += shape.velocityX

      // Check beam collision
      const beamY = getBeamYAtX(shape.x, gameState.value.angle)
      if (
        shape.y + shape.size / 2 > beamY &&
        Math.abs(shape.x - canvasWidth / 2) < BEAM_LENGTH / 2
      ) {
        shape.y = beamY - shape.size / 2
        shape.landed = true
        shape.landedDistance = shape.x - canvasWidth / 2
        shape.rotation = gameState.value.angle

        if (shape.isLeft) {
          gameState.value.leftShapes.push(shape)
          return true
        } else {
          gameState.value.rightShapes.push(shape)
        }
      }
    } else {
      // Lock shape to beam's rotation
      const centerX = canvasWidth / 2
      const centerY = canvasHeight - 100

      const currentAngleRad = (gameState.value.angle * Math.PI) / 180
      const originalAngleRad = (shape.rotation * Math.PI) / 180

      shape.x = centerX + shape.landedDistance * Math.cos(currentAngleRad - originalAngleRad)
      shape.y = centerY - shape.landedDistance * Math.sin(currentAngleRad - originalAngleRad) - shape.size / 2
      shape.rotation = gameState.value.angle
    }

    return false
  }

  function calculateBalance(
    gameState: Ref<GameState>
  ): number {
    const { MAX_ANGLE } = GAME_CONSTANTS
    let leftMoment = 0
    let rightMoment = 0

    gameState.value.leftShapes.forEach(shape => {
      const distance = shape.x - canvasWidth / 2
      leftMoment += shape.weight * distance
    })

    gameState.value.rightShapes.forEach(shape => {
      const distance = shape.x - canvasWidth / 2
      rightMoment += shape.weight * distance
    })

    const totalMoment = (leftMoment - rightMoment) / 100
    gameState.value.angle = Math.max(
      Math.min(totalMoment, MAX_ANGLE),
      -MAX_ANGLE
    )

    return gameState.value.angle
  }

  return {
    spawnShape,
    updateShape,
    calculateBalance
  }
}
