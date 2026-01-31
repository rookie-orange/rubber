export function applyResistance(
  delta: number,
  stretch: number,
  maxStretch: number,
  resistance: number,
) {
  const progress = Math.min(Math.abs(stretch) / maxStretch, 1)
  const damp = 1 - progress * resistance
  return delta * damp
}
