import { createRubber, type Axis } from '@rubber/core'
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
  intensity: number
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
  options: RubberElementOptions = {}
): RubberElementInstance {
  const element = typeof target === 'string'
    ? document.querySelector<HTMLElement>(target)
    : target

  if (!element) {
    throw new Error(`[RubberElement] Element not found: ${target as string}`)
  }

  const {
    axis = 'y',
    maxStretch = 80,
    resistance = 0.6,
    spring = { stiffness: 200, damping: 25 },
    intensity = 0.4,
    onUpdate,
    onDragStart,
    onDragEnd,
  } = options

  // Apply initial styles
  element.style.touchAction = 'none'
  element.style.userSelect = 'none'
  element.style.cursor = 'grab'

  const rubber = createRubber({
    axis,
    maxStretch,
    resistance,
    spring,
    onUpdate(state) {
      const result = calcElasticScale(state.stretchX, state.stretchY, axis, maxStretch, intensity)
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
  })

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

  return { destroy, element }
}
