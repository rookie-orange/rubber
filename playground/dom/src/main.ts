import { createRubberElement, type RubberElementOptions, type Axis } from '@rubber/dom'

// DOM Elements
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
const $$ = <T extends HTMLElement>(selector: string) => document.querySelectorAll<T>(selector)

// State
let currentInstance: ReturnType<typeof createRubberElement> | null = null

const config: RubberElementOptions = {
  axis: 'xy',
  maxStretch: 120,
  resistance: 0.6,
  intensity: 0.4,
  spring: { stiffness: 200, damping: 25 },
  onUpdate(state) {
    $('state-phase').textContent = state.phase
    $('state-progress').textContent = `${Math.round(state.progress * 100)}%`
  },
}

function createInstance() {
  currentInstance?.destroy()
  currentInstance = createRubberElement('#rubber-element', config)
}

// Initialize
createInstance()

// Axis radio buttons
$$<HTMLInputElement>('input[name="axis"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    config.axis = radio.value as Axis
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

setupSlider('stiffness', (v) => (config.spring!.stiffness = v))
setupSlider('damping', (v) => (config.spring!.damping = v))
setupSlider('maxStretch', (v) => (config.maxStretch = v))
setupSlider('intensity', (v) => (config.intensity = v))
setupSlider('resistance', (v) => (config.resistance = v))
