import {
  createRubberElement,
  type RubberElementInstance,
  type RubberElementOptions,
} from '@rubber/dom'
import {
  computed,
  defineComponent,
  h,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  shallowRef,
  watch,
  type ComputedRef,
  type InjectionKey,
} from 'vue'

type AsTag =
  | 'a'
  | 'button'
  | 'div'
  | 'form'
  | 'h2'
  | 'h3'
  | 'label'
  | 'li'
  | 'nav'
  | 'ol'
  | 'p'
  | 'span'
  | 'svg'
  | 'ul'
  | ({} & string) // any other string

interface VueRubberProps {
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

type VueRubberProviderProps = Omit<VueRubberProps, 'as'>

const RUBBER_INJECTION_KEY: InjectionKey<ComputedRef<VueRubberProviderProps>> =
  Symbol('vue-rubber')

const VueRubberProvider = defineComponent<VueRubberProviderProps>(
  (props, { slots }) => {
    const reactiveProps = computed(() => ({ ...props }))
    provide(RUBBER_INJECTION_KEY, reactiveProps)

    return () => slots.default?.()
  },
  { name: 'VueRubberProvider', inheritAttrs: false },
)

const VueRubber = defineComponent<VueRubberProps>(
  (props, { attrs, slots, expose, emit }) => {
    const rubberContext = inject(RUBBER_INJECTION_KEY)

    const rubberRef = ref<HTMLElement | null>(null)
    const rubberInstance = shallowRef<RubberElementInstance | null>(null)
    const delegatedProps = computed(() => {
      const { as: _, ...rest } = props
      return rest
    })
    const mergedConfig = computed(() => ({
      ...rubberContext?.value,
      ...delegatedProps.value,
    }))

    function buildOptions(): RubberElementOptions {
      return {
        ...mergedConfig.value,
        onUpdate: (state) => emit('update', state),
        onDragStart: () => emit('dragStart'),
        onDragEnd: () => emit('dragEnd'),
      }
    }

    function initRubber() {
      if (!rubberRef.value) return
      rubberInstance.value = createRubberElement(
        rubberRef.value,
        buildOptions(),
      )
    }

    watch(
      mergedConfig,
      (newConfig) => {
        if (!rubberInstance.value) return
        rubberInstance.value.configure(newConfig)
      },
      { deep: true },
    )

    onMounted(() => initRubber())

    onUnmounted(() => {
      rubberInstance.value?.destroy()
      rubberInstance.value = null
    })

    expose({
      getInstance: () => rubberInstance.value,
    })

    return () => h(props.as ?? 'div', { ref: rubberRef, ...attrs }, slots.default?.())
  },
  { name: 'VueRubber', inheritAttrs: false },
)

export { VueRubber, VueRubberProvider }

export type { VueRubberProps }
