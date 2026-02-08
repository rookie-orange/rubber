<script setup lang="ts">
import { computed, ref } from 'vue'
import { RubberConfigPanel, ElementConfigPanel } from './components/widgets'
import { VueRubber } from '@rubber/vue'

type Axis = 'x' | 'y' | 'xy'
type AnimationType = 'spring' | 'ease' | 'linear' | 'none'

// Rubber configuration
const enabled = ref(true)
const axis = ref<Axis>('xy')
const type = ref<AnimationType>('spring')
const maxStretch = ref([100])
const resistance = ref([0.5])
const stiffness = ref([200])
const damping = ref([10])
const mass = ref([1])
const duration = ref([300])

// Element style
const width = ref([192])
const height = ref([192])
const borderRadius = ref([24])

// Computed props for VueRubber
const rubberProps = computed(() => {
  const base = {
    enabled: enabled.value,
    axis: axis.value,
    maxStretch: maxStretch.value[0],
    resistance: resistance.value[0],
  }

  if (type.value === 'spring') {
    return {
      ...base,
      type: 'spring' as const,
      spring: {
        stiffness: stiffness.value[0]!,
        damping: damping.value[0]!,
        mass: mass.value[0],
      },
    }
  }

  if (type.value === 'ease' || type.value === 'linear') {
    return {
      ...base,
      type: type.value,
      tween: {
        duration: duration.value[0],
      },
    }
  }

  return {
    ...base,
    type: type.value,
  }
})

// Computed element style
const elementStyle = computed(() => ({
  width: `${width.value[0]}px`,
  height: `${height.value[0]}px`,
  borderRadius: `${borderRadius.value[0]}px`,
}))
</script>

<template>
  <div class="flex h-screen">
    <!-- Left: Configuration Panel -->
    <div class="border-border w-80 shrink-0 overflow-y-auto border-r p-6">
      <RubberConfigPanel
        v-model:enabled="enabled"
        v-model:axis="axis"
        v-model:type="type"
        v-model:max-stretch="maxStretch"
        v-model:resistance="resistance"
        v-model:stiffness="stiffness"
        v-model:damping="damping"
        v-model:mass="mass"
        v-model:duration="duration"
      />

      <div class="border-border mt-6 border-t pt-6">
        <ElementConfigPanel
          v-model:width="width"
          v-model:height="height"
          v-model:border-radius="borderRadius"
        />
      </div>
    </div>
    <!-- Right: Preview -->
    <div class="bg-secondary flex flex-1 items-center justify-center">
      <VueRubber
        v-bind="rubberProps"
        :style="elementStyle"
        class="bg-primary text-primary-foreground flex cursor-grab items-center justify-center font-medium select-none active:cursor-grabbing"
      >
        Drag me
      </VueRubber>
    </div>
  </div>
</template>
