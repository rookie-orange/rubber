import { createRubber, type Axis, type RubberOptions } from '@rubber/core'

import type { RubberElementOptions, RubberElementInstance } from './types'

interface ElasticScaleResult {
  scaleX: number
  scaleY: number
  transform: string
  transformOrigin: string
}

function calcElasticScale(
  stretchX: number,
  stretchY: number,
  axis: Axis,
  maxStretch: number,
  intensity: number,
): ElasticScaleResult {
  let scaleX = 1
  let scaleY = 1
  let originX = 'center'
  let originY = 'center'

  if (axis === 'x' || axis === 'xy') {
    const normalizedX = Math.abs(stretchX) / maxStretch
    scaleX = 1 + normalizedX * intensity
    originX = stretchX >= 0 ? 'left' : 'right'
  }

  if (axis === 'y' || axis === 'xy') {
    const normalizedY = Math.abs(stretchY) / maxStretch
    scaleY = 1 + normalizedY * intensity
    originY = stretchY >= 0 ? 'top' : 'bottom'
  }

  return {
    scaleX,
    scaleY,
    transform: `scale(${scaleX}, ${scaleY})`,
    transformOrigin: `${originX} ${originY}`,
  }
}

/**
 * Creates an elastic rubber effect on a DOM element.
 * The element will stretch when dragged and spring back when released.
 */
export function createRubberElement(
  target: HTMLElement | string,
  options: RubberElementOptions = {},
): RubberElementInstance {
  const element =
    typeof target === 'string'
      ? document.querySelector<HTMLElement>(target)
      : target

  if (!element) {
    throw new Error(`[RubberElement] Element not found: ${target as string}`)
  }

  // Mutable configuration
  let currentAxis = options.axis ?? 'y'
  let currentMaxStretch = options.maxStretch ?? 80
  let currentIntensity = options.intensity ?? 0.4

  const { resistance = 0.6, onUpdate, onDragStart, onDragEnd } = options

  // Build rubber options based on animation type
  const rubberOptions: RubberOptions = {
    enabled: options.enabled,
    axis: currentAxis,
    maxStretch: currentMaxStretch,
    resistance,
    onUpdate(state) {
      const result = calcElasticScale(
        state.stretchX,
        state.stretchY,
        currentAxis,
        currentMaxStretch,
        currentIntensity,
      )
      element.style.transform = result.transform
      element.style.transformOrigin = result.transformOrigin

      onUpdate?.({
        stretchX: state.stretchX,
        stretchY: state.stretchY,
        scaleX: result.scaleX,
        scaleY: result.scaleY,
        progress: state.progress,
        phase: state.phase,
      })
    },
  }

  // Only add animation-specific config based on type
  if (options.type === 'spring') {
    ;(rubberOptions as unknown as { type: 'spring'; spring: unknown }).type =
      'spring'
    ;(rubberOptions as unknown as { spring: unknown }).spring =
      options.spring ?? { stiffness: 200, damping: 25 }
  } else if (options.type === 'ease') {
    ;(rubberOptions as unknown as { type: 'ease'; tween: unknown }).type =
      'ease'
    ;(rubberOptions as unknown as { tween: unknown }).tween = options.tween ?? {
      duration: 300,
    }
  } else if (options.type === 'linear') {
    ;(rubberOptions as unknown as { type: 'linear'; tween: unknown }).type =
      'linear'
    ;(rubberOptions as unknown as { tween: unknown }).tween = options.tween ?? {
      duration: 300,
    }
  }

  // Apply initial styles
  element.style.touchAction = 'none'
  element.style.userSelect = 'none'
  element.style.cursor = 'grab'

  const rubber = createRubber(rubberOptions)

  let lastX = 0
  let lastY = 0
  let dragging = false

  function handlePointerDown(e: PointerEvent) {
    dragging = true
    lastX = e.clientX
    lastY = e.clientY
    element!.setPointerCapture(e.pointerId)
    element!.style.cursor = 'grabbing'
    onDragStart?.()
  }

  function handlePointerMove(e: PointerEvent) {
    if (!dragging) return
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    lastX = e.clientX
    lastY = e.clientY
    rubber.drag({ deltaX: dx, deltaY: dy })
  }

  function handlePointerUp(e: PointerEvent) {
    if (!dragging) return
    dragging = false
    element!.releasePointerCapture(e.pointerId)
    element!.style.cursor = 'grab'
    rubber.release()
    onDragEnd?.()
  }

  element.addEventListener('pointerdown', handlePointerDown)
  element.addEventListener('pointermove', handlePointerMove)
  element.addEventListener('pointerup', handlePointerUp)
  element.addEventListener('pointercancel', handlePointerUp)

  function destroy() {
    rubber.destroy()
    element!.removeEventListener('pointerdown', handlePointerDown)
    element!.removeEventListener('pointermove', handlePointerMove)
    element!.removeEventListener('pointerup', handlePointerUp)
    element!.removeEventListener('pointercancel', handlePointerUp)
    element!.style.transform = ''
    element!.style.transformOrigin = ''
    element!.style.cursor = ''
    element!.style.touchAction = ''
    element!.style.userSelect = ''
  }

  function configure(newOptions: Partial<RubberElementOptions>) {
    // Update local state
    if (newOptions.axis !== undefined) currentAxis = newOptions.axis
    if (newOptions.maxStretch !== undefined)
      currentMaxStretch = newOptions.maxStretch
    if (newOptions.intensity !== undefined)
      currentIntensity = newOptions.intensity

    // Build core options (only pass properties that core understands)
    const coreOptions: Partial<RubberOptions> = {}
    if (newOptions.enabled !== undefined)
      coreOptions.enabled = newOptions.enabled
    if (newOptions.axis !== undefined) coreOptions.axis = newOptions.axis
    if (newOptions.maxStretch !== undefined)
      coreOptions.maxStretch = newOptions.maxStretch
    if (newOptions.resistance !== undefined)
      coreOptions.resistance = newOptions.resistance
    if (newOptions.type !== undefined)
      (coreOptions as { type: string }).type = newOptions.type
    if ('spring' in newOptions && newOptions.spring) {
      ;(coreOptions as { spring: unknown }).spring = newOptions.spring
    }
    if ('tween' in newOptions && newOptions.tween) {
      ;(coreOptions as { tween: unknown }).tween = newOptions.tween
    }

    rubber.configure(coreOptions)
  }

  return { destroy, element, configure }
}
