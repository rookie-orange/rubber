<script setup lang="ts">
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

type Axis = 'x' | 'y' | 'xy'
type AnimationType = 'spring' | 'ease' | 'linear' | 'none'

const enabled = defineModel<boolean>('enabled', {
  default: true,
  required: true,
})
const axis = defineModel<Axis>('axis', { required: true })
const type = defineModel<AnimationType>('type', { required: true })
const maxStretch = defineModel<number[]>('maxStretch', { required: true })
const resistance = defineModel<number[]>('resistance', { required: true })
const stiffness = defineModel<number[]>('stiffness', { required: true })
const damping = defineModel<number[]>('damping', { required: true })
const mass = defineModel<number[]>('mass', { required: true })
const duration = defineModel<number[]>('duration', { required: true })
</script>

<template>
  <div>
    <h2
      class="text-muted-foreground mb-4 text-sm font-semibold tracking-wide uppercase"
    >
      Rubber Options
    </h2>

    <!-- Enabled -->
    <div class="mb-5">
      <div class="flex items-center justify-between">
        <Label>Enabled</Label>
        <Switch v-model:model-value="enabled" />
      </div>
    </div>

    <!-- Axis -->
    <div class="mb-5">
      <Label class="mb-2 block">Axis</Label>
      <RadioGroup v-model="axis" class="flex gap-4">
        <div class="flex items-center gap-2">
          <RadioGroupItem value="x" id="axis-x" />
          <Label for="axis-x" class="font-normal">X</Label>
        </div>
        <div class="flex items-center gap-2">
          <RadioGroupItem value="y" id="axis-y" />
          <Label for="axis-y" class="font-normal">Y</Label>
        </div>
        <div class="flex items-center gap-2">
          <RadioGroupItem value="xy" id="axis-xy" />
          <Label for="axis-xy" class="font-normal">XY</Label>
        </div>
      </RadioGroup>
    </div>

    <!-- Type -->
    <div class="mb-5">
      <Label class="mb-2 block">Animation Type</Label>
      <Select v-model="type">
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="spring">Spring</SelectItem>
          <SelectItem value="ease">Ease</SelectItem>
          <SelectItem value="linear">Linear</SelectItem>
          <SelectItem value="none">None</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Max Stretch -->
    <div class="mb-5">
      <Label class="mb-2 block"> Max Stretch: {{ maxStretch[0] }} </Label>
      <Slider v-model="maxStretch" :min="10" :max="500" :step="10" />
    </div>

    <!-- Resistance -->
    <div class="mb-5">
      <Label class="mb-2 block">
        Resistance: {{ resistance[0]?.toFixed(2) }}
      </Label>
      <Slider v-model="resistance" :min="0" :max="1" :step="0.05" />
    </div>

    <!-- Spring Options -->
    <template v-if="type === 'spring'">
      <div class="border-border mt-5 border-t pt-5">
        <h3 class="text-muted-foreground mb-4 text-xs font-medium">Spring</h3>

        <div class="mb-5">
          <Label class="mb-2 block">Stiffness: {{ stiffness[0] }}</Label>
          <Slider v-model="stiffness" :min="10" :max="500" :step="10" />
        </div>

        <div class="mb-5">
          <Label class="mb-2 block">Damping: {{ damping[0] }}</Label>
          <Slider v-model="damping" :min="1" :max="50" :step="1" />
        </div>

        <div class="mb-5">
          <Label class="mb-2 block">Mass: {{ mass[0] }}</Label>
          <Slider v-model="mass" :min="0.1" :max="10" :step="0.1" />
        </div>
      </div>
    </template>

    <!-- Tween Options -->
    <template v-if="type === 'ease' || type === 'linear'">
      <div class="border-border mt-5 border-t pt-5">
        <h3 class="text-muted-foreground mb-4 text-xs font-medium">Tween</h3>

        <div class="mb-5">
          <Label class="mb-2 block">Duration: {{ duration[0] }}ms</Label>
          <Slider v-model="duration" :min="100" :max="2000" :step="50" />
        </div>
      </div>
    </template>
  </div>
</template>
