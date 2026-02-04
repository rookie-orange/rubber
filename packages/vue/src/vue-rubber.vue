<script setup lang="ts">
import {
  createRubberElement,
  type RubberElementOptions,
  type RubberElementInstance,
} from '@rubber/dom'
import {
  onMounted,
  onUnmounted,
  watch,
  inject,
  computed,
  useTemplateRef,
  type ComputedRef,
} from 'vue'
import { RUBBER_INJECTION_KEY } from './injection-key'

type AsTag =
  | 'a'
  | 'button'
  | 'div'
  | 'form'
  | 'h2'
  | 'h3'
  | 'img'
  | 'input'
  | 'label'
  | 'li'
  | 'nav'
  | 'ol'
  | 'p'
  | 'span'
  | 'svg'
  | 'ul'
  | 'template'
  | ({} & string) // any other string

export interface VueRubberProps {
  as?: AsTag
  enabled?: boolean
  axis?: 'x' | 'y' | 'xy'
  maxStretch?: number
  resistance?: number
  intensity?: number
  type?: 'spring' | 'ease' | 'linear' | 'none'
  spring?: { stiffness: number; damping: number; mass?: number }
  tween?: { duration?: number }
}

const props = withDefaults(defineProps<VueRubberProps>(), {
  as: 'div',
})

const emit = defineEmits<{
  update: [
    state: {
      stretchX: number
      stretchY: number
      scaleX: number
      scaleY: number
      progress: number
      phase: 'idle' | 'dragging' | 'animating'
    },
  ]
  dragStart: []
  dragEnd: []
}>()

const rubberElement = useTemplateRef('rubberRef')

let instance: RubberElementInstance | null = null

// Get injected config from provider
const injectedConfig = inject<ComputedRef<VueRubberProps> | null>(
  RUBBER_INJECTION_KEY,
  null,
)

// Merge props with injected config (props take precedence)
const mergedConfig = computed<RubberElementOptions>(() => {
  const base = injectedConfig?.value ?? {}
  return {
    enabled: props.enabled ?? base.enabled,
    axis: props.axis ?? base.axis ?? 'y',
    maxStretch: props.maxStretch ?? base.maxStretch ?? 80,
    resistance: props.resistance ?? base.resistance ?? 0.6,
    intensity: props.intensity ?? base.intensity ?? 0.4,
    type: props.type ?? base.type ?? 'spring',
    spring: props.spring ?? base.spring,
    tween: props.tween ?? base.tween,
  } as RubberElementOptions
})

function buildOptions(): RubberElementOptions {
  const config = mergedConfig.value
  const options: RubberElementOptions = {
    enabled: config.enabled,
    axis: config.axis,
    maxStretch: config.maxStretch,
    resistance: config.resistance,
    intensity: config.intensity,
    onUpdate: (state) => emit('update', state),
    onDragStart: () => emit('dragStart'),
    onDragEnd: () => emit('dragEnd'),
  }

  if (config.type === 'spring') {
    return { ...options, type: 'spring', spring: config.spring }
  } else if (config.type === 'ease') {
    return { ...options, type: 'ease', tween: config.tween }
  } else if (config.type === 'linear') {
    return { ...options, type: 'linear', tween: config.tween }
  }
  return { ...options, type: 'none' }
}

function initRubber() {
  if (!rubberElement.value) return
  instance = createRubberElement(
    rubberElement.value as HTMLElement,
    buildOptions(),
  )
}

// Watch for prop changes and call configure
watch(
  mergedConfig,
  (newConfig) => {
    if (!instance) return
    instance.configure(newConfig)
  },
  { deep: true },
)

onMounted(() => initRubber())

onUnmounted(() => {
  instance?.destroy()
  instance = null
})

defineExpose({
  getInstance: () => instance,
})
</script>

<template>
  <component :is="as" ref="rubberRef" v-bind="$attrs">
    <slot />
  </component>
</template>
