import type {
  RubberOptions,
  DragInput,
  RubberOutput,
  RubberState,
} from './types'
import { applyResistance } from './resistance'
import { Spring } from './spring'

export function createRubber<Shape = unknown>(options: RubberOptions<Shape>) {
  const {
    axis = 'y',
    maxStretch = 80,
    resistance = 0.6,
    spring: springOptions = { stiffness: 300, damping: 20 },
    deform,
    onUpdate,
  } = options

  let stretchX = 0
  let stretchY = 0
  let velocityX = 0
  let velocityY = 0
  let phase: 'idle' | 'dragging' | 'spring' = 'idle'
  let lastTime = 0
  let rafId: number | null = null

  const spring = new Spring(springOptions)

  function getProgress(): number {
    const sx = axis === 'y' ? 0 : stretchX
    const sy = axis === 'x' ? 0 : stretchY
    const magnitude = Math.sqrt(sx * sx + sy * sy)
    return Math.min(magnitude / maxStretch, 1)
  }

  function emit() {
    const progress = getProgress()
    const state: RubberState = {
      stretchX,
      stretchY,
      velocityX,
      velocityY,
      progress,
      phase,
    }
    const shape = deform?.(state)
    const output: RubberOutput<Shape> = { ...state, shape }
    onUpdate?.(output)
  }

  function tick(time: number) {
    if (phase !== 'spring') {
      rafId = null
      return
    }

    if (lastTime === 0) {
      lastTime = time
      rafId = requestAnimationFrame(tick)
      return
    }

    const dt = Math.min((time - lastTime) / 1000, 0.064)
    lastTime = time

    const result = spring.step(dt)
    stretchX = result.x
    stretchY = result.y
    velocityX = result.velocityX
    velocityY = result.velocityY

    emit()

    if (result.atRest) {
      phase = 'idle'
      rafId = null
    } else {
      rafId = requestAnimationFrame(tick)
    }
  }

  function startAnimation() {
    if (rafId !== null) return
    lastTime = 0
    rafId = requestAnimationFrame(tick)
  }

  function drag(input: DragInput) {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }

    phase = 'dragging'

    // Handle deltaX
    if ((axis === 'x' || axis === 'xy') && input.deltaX !== undefined) {
      const dx = applyResistance(input.deltaX, stretchX, maxStretch, resistance)
      stretchX += dx
    }

    // Handle deltaY
    if (axis === 'y' || axis === 'xy') {
      const rawDeltaY = input.deltaY ?? input.delta ?? 0
      const dy = applyResistance(rawDeltaY, stretchY, maxStretch, resistance)
      stretchY += dy
    }

    emit()
  }

  function release() {
    if (phase !== 'dragging') return

    phase = 'spring'
    spring.start(stretchX, stretchY, velocityX, velocityY)
    startAnimation()
  }

  function destroy() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    phase = 'idle'
    stretchX = 0
    stretchY = 0
    velocityX = 0
    velocityY = 0
  }

  return {
    drag,
    release,
    destroy,
  }
}
