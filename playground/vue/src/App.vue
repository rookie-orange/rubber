<script setup lang="ts">
import { computed, ref } from 'vue'
import { RubberConfigPanel, ElementConfigPanel } from './components/widgets'
import { VueRubber } from '@rubber/vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { GithubIcon, Code, Check, Copy } from 'lucide-vue-next'

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

// Config code generation
const configCode = computed(() => {
  return JSON.stringify(rubberProps.value, null, 2)
})

// Copy functionality
const copied = ref(false)
async function copyConfig() {
  await navigator.clipboard.writeText(configCode.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
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
    <div class="bg-secondary relative flex flex-1 items-center justify-center">
      <!-- Top right buttons -->
      <div class="absolute top-4 right-4 flex gap-2">
        <Dialog>
          <DialogTrigger as-child>
            <Button variant="outline" size="icon">
              <Code class="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Configuration</DialogTitle>
            </DialogHeader>
            <div class="relative">
              <pre
                class="bg-muted rounded-md p-4 text-sm overflow-auto max-h-80"
              ><code>{{ configCode }}</code></pre>
              <Button
                variant="outline"
                size="icon-sm"
                class="absolute top-2 right-2"
                @click="copyConfig"
              >
                <Check v-if="copied" class="size-4" />
                <Copy v-else class="size-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          size="icon"
          as="a"
          href="https://github.com/rookie-orange/rubber"
          target="_blank"
        >
          <GithubIcon class="size-4" />
        </Button>
      </div>

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
