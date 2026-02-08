<script setup lang="ts">
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

const width = defineModel<number[]>('width', { required: true })
const height = defineModel<number[]>('height', { required: true })
const borderRadius = defineModel<number[]>('borderRadius', { required: true })
</script>

<template>
  <div>
    <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      Element Style
    </h2>

    <div class="mb-5">
      <Label class="mb-2 block">Width: {{ width[0] }}px</Label>
      <Slider v-model="width" :min="80" :max="400" :step="10" />
    </div>

    <div class="mb-5">
      <Label class="mb-2 block">Height: {{ height[0] }}px</Label>
      <Slider v-model="height" :min="80" :max="400" :step="10" />
    </div>

    <div class="mb-5">
      <Label class="mb-2 block">Border Radius: {{ borderRadius[0] }}px</Label>
      <Slider v-model="borderRadius" :min="0" :max="150" :step="5" />
    </div>
  </div>
</template>
