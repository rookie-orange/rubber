import type { InjectionKey, ComputedRef } from 'vue'
import type { VueRubberProps } from './vue-rubber.vue'

export const RUBBER_INJECTION_KEY: InjectionKey<ComputedRef<VueRubberProps>> =
  Symbol('rubber-config')
