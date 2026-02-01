import type { Axis, SpringOptions } from '@rubber/core'

export interface RubberElementOptions {
  /** Axis to enable: 'x', 'y', or 'xy'. Default: 'y' */
  axis?: Axis
  /** Maximum stretch distance in pixels. Default: 80 */
  maxStretch?: number
  /** Drag resistance factor (0-1). Default: 0.6 */
  resistance?: number
  /** Spring animation options */
  spring?: SpringOptions
  /** Scale intensity factor (0-1). Default: 0.4 */
  intensity?: number
  /** Callback when state updates */
  onUpdate?: (state: RubberElementState) => void
  /** Callback when drag starts */
  onDragStart?: () => void
  /** Callback when drag ends */
  onDragEnd?: () => void
}

export interface RubberElementState {
  stretchX: number
  stretchY: number
  scaleX: number
  scaleY: number
  progress: number
  phase: 'idle' | 'dragging' | 'spring'
}

export interface RubberElementInstance {
  /** Destroy the instance and remove event listeners */
  destroy: () => void
  /** Get the target element */
  element: HTMLElement
}
