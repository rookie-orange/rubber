import { RubberOptions, RubberState, DragInput, RubberOutput } from './types'
import { applyResistance } from './resistance'
import { Spring } from './spring/spring'

export function createRubber<Shape = unknown>(options: RubberOptions<Shape>) {
  const {
    maxStretch = 80,
    resistance = 0.6,
    spring: springOptions = { stiffness: 220, damping: 20 },
    deform,
    onUpdate,
  } = options

  const state: RubberState = {
    stretch: 0,
    velocity: 0,
    isDragging: false,
  }

  const spring = new Spring(springOptions)

  let lastTime = 0
  let phase: 'dragging' | 'spring' = 'dragging'

  function emit() {
    const progress = Math.min(Math.abs(state.stretch) / maxStretch, 1)

    const shape = deform?.(state.stretch, {
      progress,
      stretch: state.stretch,
      velocity: state.velocity,
      phase,
    })

    const output: RubberOutput<Shape> = {
      stretch: state.stretch,
      progress,
      shape,
    }

    onUpdate?.(output)
  }

  function drag(input: DragInput) {
    if (!state.isDragging) {
      state.isDragging = true
      phase = 'dragging'
    }

    const delta = applyResistance(
      input.delta,
      state.stretch,
      maxStretch,
      resistance,
    )

    state.stretch += delta
    state.velocity = 0

    emit()
  }

  function release() {
    if (!state.isDragging) return

    state.isDragging = false
    phase = 'spring'

    spring.start(state.stretch, state.velocity)
    lastTime = 0
  }

  function tick(time: number) {
    if (state.isDragging) return

    if (!lastTime) {
      lastTime = time
      return
    }

    const dt = (time - lastTime) / 1000
    lastTime = time

    const { value, velocity } = spring.step(dt)

    state.stretch = value
    state.velocity = velocity

    emit()
  }

  function destroy() {
    state.isDragging = false
    state.stretch = 0
    state.velocity = 0
  }

  return {
    drag,
    release,
    tick,
    destroy,
  }
}
