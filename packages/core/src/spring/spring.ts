import type { SpringOptions } from '../types'

export class Spring {
  private value = 0
  private velocity = 0
  private options: SpringOptions

  constructor(options: SpringOptions) {
    this.options = options
  }

  start(from: number, velocity = 0) {
    this.value = from
    this.velocity = velocity
  }

  step(dt: number) {
    const { stiffness, damping, mass = 1 } = this.options

    const force = -stiffness * this.value
    const accel = force / mass

    this.velocity += accel * dt
    this.velocity *= Math.exp(-damping * dt)
    this.value += this.velocity * dt

    return {
      value: this.value,
      velocity: this.velocity,
    }
  }

  isAtRest(epsilon = 0.01) {
    return Math.abs(this.value) < epsilon && Math.abs(this.velocity) < epsilon
  }
}
