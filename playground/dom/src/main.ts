import { createRubber, createPillDeform } from '@rubber/core'

const path = document.getElementById('pill') as unknown as SVGPathElement

// 初始化一个“静止状态”的 pill
path.setAttribute(
  'd',
  createPillDeform({
    width: 40,
    height: 120,
  })(0, {
    progress: 0,
    stretch: 0,
    velocity: 0,
    phase: 'dragging',
  }),
)

const rubber = createRubber({
  maxStretch: 120,
  resistance: 0.7,
  deform: createPillDeform({
    width: 40,
    height: 120,
    maxBulge: 16,
  }),
  onUpdate(o) {
    if (o.shape) {
      path.setAttribute('d', o.shape)
    }
  },
})

// ===== Pointer → Rubber Adapter（最小但正确） =====

let lastY = 0
let dragging = false

path.addEventListener('pointerdown', (e) => {
  dragging = true
  lastY = e.clientY
  path.setPointerCapture(e.pointerId)
})

path.addEventListener('pointermove', (e) => {
  if (!dragging) return

  const dy = e.clientY - lastY
  lastY = e.clientY

  rubber.drag({
    delta: dy,
    time: performance.now(),
  })
})

function release(e?: PointerEvent) {
  dragging = false
  if (e) path.releasePointerCapture(e.pointerId)
  rubber.release()
}

path.addEventListener('pointerup', release)
path.addEventListener('pointercancel', release)

// ===== RAF 驱动 =====

function loop(t: number) {
  rubber.tick(t)
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
