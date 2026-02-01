export type Axis = 'x' | 'y' | 'xy'

export interface Vector2 {
  x: number
  y: number
}

export interface DragInput {
  deltaX?: number
  deltaY?: number
  /** @deprecated use deltaX/deltaY instead */
  delta?: number
}

export interface RubberState {
  stretchX: number
  stretchY: number
  velocityX: number
  velocityY: number
  progress: number
  phase: 'idle' | 'dragging' | 'spring'
}

export interface RubberOutput<Shape = unknown> extends RubberState {
  shape?: Shape
}

export interface SpringOptions {
  stiffness: number
  damping: number
  mass?: number
}

export interface RubberOptions<Shape = unknown> {
  axis?: Axis
  maxStretch?: number
  resistance?: number
  spring?: SpringOptions
  deform?: (state: RubberState) => Shape
  onUpdate?: (output: RubberOutput<Shape>) => void
}
