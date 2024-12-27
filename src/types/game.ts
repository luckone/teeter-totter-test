export const SHAPES = ['triangle', 'circle', 'rectangle'] as const
export type ShapeType = typeof SHAPES[number]

export interface Shape {
  type: ShapeType
  weight: number
  x: number
  y: number
  size: number
  color: string
  velocityY: number
  velocityX: number
  isLeft: boolean
  rotation: number
  landed: boolean
  landedDistance: number
}

export interface GameState {
  isPaused: boolean
  isAutoMode: boolean
  angle: number
  score: number
  fallingShape: Shape | null
  leftShapes: Shape[]
  rightShapes: Shape[]
  lastSpawnTime: number
}

export const GAME_CONSTANTS = {
  COLORS: ['#4CAF50', '#2196F3', '#FFC107'],
  BEAM_LENGTH: 500,
  MAX_ANGLE: 30,
  GRAVITY: 0.2,
  MAX_FALL_SPEED: 3,
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600
}
