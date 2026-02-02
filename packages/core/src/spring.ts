import type { SpringOptions } from './types'

export class Spring {
  private valueX = 0
  private valueY = 0
  private velocityX = 0
  private velocityY = 0
  private options: SpringOptions
  private active = false

  constructor(options: SpringOptions) {
    this.options = options
  }

  configure(options: Partial<SpringOptions>) {
    this.options = { ...this.options, ...options }
  }

  start(fromX: number, fromY: number, velX = 0, velY = 0) {
    this.valueX = fromX
    this.valueY = fromY
    this.velocityX = velX
    this.velocityY = velY
    this.active = true
  }

  step(dt: number) {
    if (!this.active) {
      return { x: 0, y: 0, velocityX: 0, velocityY: 0, atRest: true }
    }

    const { stiffness, damping, mass = 1 } = this.options

    // X axis
    const springForceX = -stiffness * this.valueX
    const dampingForceX = -damping * this.velocityX
    const accelX = (springForceX + dampingForceX) / mass
    this.velocityX += accelX * dt
    this.valueX += this.velocityX * dt

    // Y axis
    const springForceY = -stiffness * this.valueY
    const dampingForceY = -damping * this.velocityY
    const accelY = (springForceY + dampingForceY) / mass
    this.velocityY += accelY * dt
    this.valueY += this.velocityY * dt

    const atRest = this.isAtRest()
    if (atRest) {
      this.valueX = 0
      this.valueY = 0
      this.velocityX = 0
      this.velocityY = 0
      this.active = false
    }

    return {
      x: this.valueX,
      y: this.valueY,
      velocityX: this.velocityX,
      velocityY: this.velocityY,
      atRest,
    }
  }

  isAtRest(epsilon = 0.5) {
    return (
      Math.abs(this.valueX) < epsilon &&
      Math.abs(this.valueY) < epsilon &&
      Math.abs(this.velocityX) < epsilon &&
      Math.abs(this.velocityY) < epsilon
    )
  }

  isActive() {
    return this.active
  }
}
