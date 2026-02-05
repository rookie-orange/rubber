import {
  createRubberElement,
  type RubberElementOptions,
  type Axis,
  type AnimationType,
} from '@rubber/dom'

// DOM Elements
const $ = <T extends HTMLElement>(id: string) =>
  document.getElementById(id) as T
const $$ = <T extends HTMLElement>(selector: string) =>
  document.querySelectorAll<T>(selector)

// State
let currentInstance: ReturnType<typeof createRubberElement> | null = null
let currentType: AnimationType = 'spring'
let currentAxis: Axis = 'xy'
let enabled = true
let maxStretch = 120
let resistance = 0.6
let intensity = 0.4
const springConfig = { stiffness: 200, damping: 25 }
const tweenConfig = { duration: 300 }

function getConfig(): RubberElementOptions {
  return {
    enabled,
    axis: currentAxis,
    maxStretch,
    resistance,
    intensity,
    type: currentType,
    spring: springConfig,
    tween: tweenConfig,
    onUpdate(state: { phase: string; progress: number }) {
      $('state-phase').textContent = state.phase
      $('state-progress').textContent = `${Math.round(state.progress * 100)}%`
    },
  }
}

let config = getConfig()

function createInstance() {
  currentInstance?.destroy()
  config = getConfig()
  currentInstance = createRubberElement('#rubber-element', config)
}

function updateControlsState() {
  const springControls = $('spring-controls')
  const tweenControls = $('tween-controls')

  // Spring controls: only enabled for 'spring' type
  if (currentType === 'spring') {
    springControls.style.opacity = '1'
    springControls.style.pointerEvents = 'auto'
  } else {
    springControls.style.opacity = '0.4'
    springControls.style.pointerEvents = 'none'
  }

  // Tween controls: only enabled for 'ease' or 'linear' type
  if (currentType === 'ease' || currentType === 'linear') {
    tweenControls.style.opacity = '1'
    tweenControls.style.pointerEvents = 'auto'
  } else {
    tweenControls.style.opacity = '0.4'
    tweenControls.style.pointerEvents = 'none'
  }
}

// Initialize
createInstance()

// Type radio buttons
$$<HTMLInputElement>('input[name="type"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    currentType = radio.value as AnimationType
    updateControlsState()
    currentInstance?.configure({ type: currentType })
  })
})

// Axis radio buttons
$$<HTMLInputElement>('input[name="axis"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    currentAxis = radio.value as Axis
    currentInstance?.configure({ axis: currentAxis })
  })
})

// Enabled toggle
$<HTMLInputElement>('enabled').addEventListener('change', (e) => {
  enabled = (e.target as HTMLInputElement).checked
  currentInstance?.configure({ enabled })
})

// Range sliders
function setupSlider(
  id: string,
  update: (value: number) => void,
  getConfigUpdate: () => Partial<RubberElementOptions>,
) {
  const slider = $<HTMLInputElement>(id)
  const display = $(`${id}-value`)

  slider.addEventListener('input', () => {
    const value = parseFloat(slider.value)
    display.textContent = String(value)
    update(value)
    currentInstance?.configure(getConfigUpdate())
  })
}

setupSlider(
  'stiffness',
  (v) => (springConfig.stiffness = v),
  () => ({ spring: springConfig }),
)
setupSlider(
  'damping',
  (v) => (springConfig.damping = v),
  () => ({ spring: springConfig }),
)
setupSlider(
  'duration',
  (v) => (tweenConfig.duration = v),
  () => ({ tween: tweenConfig }),
)
setupSlider(
  'maxStretch',
  (v) => (maxStretch = v),
  () => ({ maxStretch }),
)
setupSlider(
  'intensity',
  (v) => (intensity = v),
  () => ({ intensity }),
)
setupSlider(
  'resistance',
  (v) => (resistance = v),
  () => ({ resistance }),
)
