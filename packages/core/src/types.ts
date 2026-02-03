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
  phase: 'idle' | 'dragging' | 'animating'
}

export interface RubberOutput<Shape = unknown> extends RubberState {
  shape?: Shape
}

export interface SpringOptions {
  stiffness: number
  damping: number
  mass?: number
}

/** Animation type for release behavior */
export type AnimationType = 'spring' | 'ease' | 'linear' | 'none'

/** Options for ease/linear animations */
export interface TweenOptions {
  /** Animation duration in milliseconds. Default: 300 */
  duration?: number
}

/** Base options shared by all animation types */
export interface BaseRubberOptions<Shape = unknown> {
  /** Whether the rubber effect is enabled. Default: true */
  enabled?: boolean
  axis?: Axis
  maxStretch?: number
  resistance?: number
  deform?: (state: RubberState) => Shape
  onUpdate?: (output: RubberOutput<Shape>) => void
}

/** Options when using spring animation */
export interface SpringRubberOptions<Shape = unknown> extends BaseRubberOptions<Shape> {
  type: 'spring'
  spring?: SpringOptions
}

/** Options when using ease animation */
export interface EaseRubberOptions<Shape = unknown> extends BaseRubberOptions<Shape> {
  type: 'ease'
  tween?: TweenOptions
}

/** Options when using linear animation */
export interface LinearRubberOptions<Shape = unknown> extends BaseRubberOptions<Shape> {
  type: 'linear'
  tween?: TweenOptions
}

/** Options when using no animation (instant reset) */
export interface NoneRubberOptions<Shape = unknown> extends BaseRubberOptions<Shape> {
  type?: 'none'
}

/** Combined options type */
export type RubberOptions<Shape = unknown> =
  | SpringRubberOptions<Shape>
  | EaseRubberOptions<Shape>
  | LinearRubberOptions<Shape>
  | NoneRubberOptions<Shape>

/** Rubber instance returned by createRubber */
export interface RubberInstance {
  drag: (input: DragInput) => void
  release: () => void
  destroy: () => void
  /** Update configuration without destroying the instance */
  configure: (options: Partial<RubberOptions>) => void
}
