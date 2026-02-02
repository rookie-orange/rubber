import type { Axis, SpringOptions, AnimationType, TweenOptions } from '@rubber/core'

export type { Axis, SpringOptions, AnimationType, TweenOptions }

/** Base options shared by all animation types */
interface BaseRubberElementOptions {
  /** Axis to enable: 'x', 'y', or 'xy'. Default: 'y' */
  axis?: Axis
  /** Maximum stretch distance in pixels. Default: 80 */
  maxStretch?: number
  /** Drag resistance factor (0-1). Default: 0.6 */
  resistance?: number
  /** Scale intensity factor (0-1). Default: 0.4 */
  intensity?: number
  /** Callback when state updates */
  onUpdate?: (state: RubberElementState) => void
  /** Callback when drag starts */
  onDragStart?: () => void
  /** Callback when drag ends */
  onDragEnd?: () => void
}

/** Options when using spring animation */
export interface SpringRubberElementOptions extends BaseRubberElementOptions {
  type: 'spring'
  spring?: SpringOptions
}

/** Options when using ease animation */
export interface EaseRubberElementOptions extends BaseRubberElementOptions {
  type: 'ease'
  tween?: TweenOptions
}

/** Options when using linear animation */
export interface LinearRubberElementOptions extends BaseRubberElementOptions {
  type: 'linear'
  tween?: TweenOptions
}

/** Options when using no animation (instant reset) */
export interface NoneRubberElementOptions extends BaseRubberElementOptions {
  type?: 'none'
}

/** Combined options type */
export type RubberElementOptions =
  | SpringRubberElementOptions
  | EaseRubberElementOptions
  | LinearRubberElementOptions
  | NoneRubberElementOptions

export interface RubberElementState {
  stretchX: number
  stretchY: number
  scaleX: number
  scaleY: number
  progress: number
  phase: 'idle' | 'dragging' | 'animating'
}

export interface RubberElementInstance {
  /** Destroy the instance and remove event listeners */
  destroy: () => void
  /** Get the target element */
  element: HTMLElement
}
