import type {
  RubberOptions,
  DragInput,
  RubberOutput,
  RubberState,
  AnimationType,
  RubberInstance,
} from './types'
import { applyResistance } from './resistance'
import { Spring } from './spring'

export function createRubber<Shape = unknown>(options: RubberOptions<Shape>): RubberInstance {
  // Mutable configuration
  let axis = options.axis ?? 'y'
  let maxStretch = options.maxStretch ?? 80
  let resistance = options.resistance ?? 0.6
  let deform = options.deform
  let onUpdate = options.onUpdate
  let animationType: AnimationType = options.type ?? 'none'
  let tweenDuration = (animationType === 'ease' || animationType === 'linear') && 'tween' in options
    ? options.tween?.duration ?? 300
    : 300

  let stretchX = 0
  let stretchY = 0
  let velocityX = 0
  let velocityY = 0
  let phase: 'idle' | 'dragging' | 'animating' = 'idle'
  let lastTime = 0
  let rafId: number | null = null

  // Tween state
  let tweenStartX = 0
  let tweenStartY = 0
  let tweenStartTime = 0

  // Spring instance with initial options
  const springOptions = animationType === 'spring' && 'spring' in options
    ? options.spring ?? { stiffness: 300, damping: 20 }
    : { stiffness: 300, damping: 20 }
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

  // Easing function: easeOutCubic
  function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
  }

  function tick(time: number) {
    if (phase !== 'animating') {
      rafId = null
      return
    }

    if (animationType === 'spring') {
      tickSpring(time)
    } else {
      tickTween(time)
    }
  }

  function tickSpring(time: number) {
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

  function tickTween(time: number) {
    if (tweenStartTime === 0) {
      tweenStartTime = time
      rafId = requestAnimationFrame(tick)
      return
    }

    const elapsed = time - tweenStartTime
    const progress = Math.min(elapsed / tweenDuration, 1)
    const easedProgress = animationType === 'ease' ? easeOutCubic(progress) : progress

    stretchX = tweenStartX * (1 - easedProgress)
    stretchY = tweenStartY * (1 - easedProgress)
    velocityX = 0
    velocityY = 0

    emit()

    if (progress >= 1) {
      stretchX = 0
      stretchY = 0
      phase = 'idle'
      rafId = null
      emit()
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

    if (animationType === 'spring') {
      phase = 'animating'
      spring.start(stretchX, stretchY, velocityX, velocityY)
      lastTime = 0
      startAnimation()
    } else if (animationType === 'ease' || animationType === 'linear') {
      phase = 'animating'
      tweenStartX = stretchX
      tweenStartY = stretchY
      tweenStartTime = 0
      startAnimation()
    } else {
      // type === 'none': instant reset
      stretchX = 0
      stretchY = 0
      velocityX = 0
      velocityY = 0
      phase = 'idle'
      emit()
    }
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

  function configure(newOptions: Partial<RubberOptions>) {
    if (newOptions.axis !== undefined) axis = newOptions.axis
    if (newOptions.maxStretch !== undefined) maxStretch = newOptions.maxStretch
    if (newOptions.resistance !== undefined) resistance = newOptions.resistance
    if (newOptions.type !== undefined) animationType = newOptions.type

    // Update spring options
    if ('spring' in newOptions && newOptions.spring) {
      spring.configure(newOptions.spring)
    }

    // Update tween duration
    if ('tween' in newOptions && newOptions.tween?.duration !== undefined) {
      tweenDuration = newOptions.tween.duration
    }
  }

  return {
    drag,
    release,
    destroy,
    configure,
  }
}
