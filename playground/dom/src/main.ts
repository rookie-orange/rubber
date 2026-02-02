import { createRubberElement, type RubberElementOptions, type Axis, type AnimationType } from '@rubber/dom'

// DOM Elements
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
const $$ = <T extends HTMLElement>(selector: string) => document.querySelectorAll<T>(selector)

// State
let currentInstance: ReturnType<typeof createRubberElement> | null = null
let currentType: AnimationType = 'spring'
let currentAxis: Axis = 'xy'
let maxStretch = 120
let resistance = 0.6
let intensity = 0.4
const springConfig = { stiffness: 200, damping: 25 }
const tweenConfig = { duration: 300 }

function getConfig(): RubberElementOptions {
  const base = {
    axis: currentAxis,
    maxStretch,
    resistance,
    intensity,
    onUpdate(state: { phase: string; progress: number }) {
      $('state-phase').textContent = state.phase
      $('state-progress').textContent = `${Math.round(state.progress * 100)}%`
    },
  }

  switch (currentType) {
    case 'spring':
      return { ...base, type: 'spring', spring: springConfig }
    case 'ease':
      return { ...base, type: 'ease', tween: tweenConfig }
    case 'linear':
      return { ...base, type: 'linear', tween: tweenConfig }
    default:
      return { ...base, type: 'none' }
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
    createInstance()
  })
})

// Axis radio buttons
$$<HTMLInputElement>('input[name="axis"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    currentAxis = radio.value as Axis
    createInstance()
  })
})

// Range sliders
function setupSlider(id: string, update: (value: number) => void) {
  const slider = $<HTMLInputElement>(id)
  const display = $(`${id}-value`)

  slider.addEventListener('input', () => {
    const value = parseFloat(slider.value)
    display.textContent = String(value)
    update(value)
    createInstance()
  })
}

setupSlider('stiffness', (v) => (springConfig.stiffness = v))
setupSlider('damping', (v) => (springConfig.damping = v))
setupSlider('duration', (v) => (tweenConfig.duration = v))
setupSlider('maxStretch', (v) => (maxStretch = v))
setupSlider('intensity', (v) => (intensity = v))
setupSlider('resistance', (v) => (resistance = v))
