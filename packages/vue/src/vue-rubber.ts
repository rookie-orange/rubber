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
  type InjectionKey,
} from 'vue'

import type { VueRubberProps, VueRubberProviderProps } from './type'

const RUBBER_INJECTION_KEY: InjectionKey<VueRubberProviderProps> =
  Symbol('vue-rubber')

function omitUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>
}

const VueRubberProvider = defineComponent<VueRubberProviderProps>(
  (props, { slots }) => {
    provide(RUBBER_INJECTION_KEY, props)

    return () => slots.default?.()
  },
  {
    name: 'VueRubberProvider',
    inheritAttrs: false,
    props: [
      'axis',
      'enabled',
      'intensity',
      'maxStretch',
      'resistance',
      'spring',
      'tween',
      'type',
    ],
  },
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
      ...rubberContext,
      ...omitUndefined(delegatedProps.value),
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

    return () =>
      h(props.as ?? 'div', { ref: rubberRef, ...attrs }, slots.default?.())
  },
  {
    name: 'VueRubber',
    inheritAttrs: true,
    props: [
      'as',
      'axis',
      'enabled',
      'intensity',
      'maxStretch',
      'resistance',
      'spring',
      'tween',
      'type',
    ],
  },
)

export { VueRubber, VueRubberProvider }

export type { VueRubberProps, VueRubberProviderProps }
