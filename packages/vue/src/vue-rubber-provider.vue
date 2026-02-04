<script setup lang="ts">
import { provide, computed, toRefs } from 'vue'
import { RUBBER_INJECTION_KEY } from './injection-key'
import type { VueRubberProps } from './vue-rubber.vue'

const props = defineProps<VueRubberProps>()

const propsRefs = toRefs(props)

const config = computed<VueRubberProps>(() => ({
  enabled: propsRefs.enabled?.value,
  axis: propsRefs.axis?.value,
  maxStretch: propsRefs.maxStretch?.value,
  resistance: propsRefs.resistance?.value,
  intensity: propsRefs.intensity?.value,
  type: propsRefs.type?.value,
  spring: propsRefs.spring?.value,
  tween: propsRefs.tween?.value,
}))

provide(RUBBER_INJECTION_KEY, config)
</script>

<template>
  <slot />
</template>
