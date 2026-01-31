import type { DeformContext } from '../types'

interface PillOptions {
  width: number
  height: number
  maxBulge?: number
}

export function createPillDeform(options: PillOptions) {
  const { width, height, maxBulge = width * 0.35 } = options

  const r = width / 2
  const midY = height / 2

  return function deform(stretch: number, ctx: DeformContext): string {
    const bulge = maxBulge * Math.sin((ctx.progress * Math.PI) / 2)

    const left = r - bulge
    const right = r + bulge

    return `
      M ${r} 0
      Q ${width} 0 ${width} ${r}
      L ${width} ${midY - r}
      Q ${right} ${midY} ${width} ${midY + r}
      L ${width} ${height - r}
      Q ${width} ${height} ${r} ${height}
      L ${r} ${height}
      Q 0 ${height} 0 ${height - r}
      L 0 ${midY + r}
      Q ${left} ${midY} 0 ${midY - r}
      L 0 ${r}
      Q 0 0 ${r} 0
      Z
    `.trim()
  }
}
