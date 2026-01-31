export type Axis = 'x' | 'y'

export interface DragInput {
  delta: number
  time: number // ms
}

export interface RubberState {
  stretch: number
  velocity: number
  isDragging: boolean
}

export interface RubberOutput<Shape = unknown> {
  stretch: number
  progress: number
  shape?: Shape
}

export interface DeformContext {
  progress: number
  stretch: number
  velocity: number
  phase: 'dragging' | 'spring'
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
  deform?: (stretch: number, ctx: DeformContext) => Shape
  onUpdate?: (output: RubberOutput<Shape>) => void
}