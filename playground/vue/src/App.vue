<script setup lang="ts">
import { VueRubber, VueRubberProvider } from '@rubber/vue'
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <VueRubberProvider
      axis="y"
      type="spring"
      :spring="{
        stiffness: 200,
        damping: 10,
      }"
    >
      <VueRubber
        class="flex size-48 items-center justify-center rounded-full bg-orange-500"
      >
        Drag
      </VueRubber>

      <VueRubber
        class="flex size-48 items-center justify-center rounded-full bg-sky-500"
        type="ease"
        axis="xy"
      >
        Drag
      </VueRubber>
    </VueRubberProvider>
  </div>
</template>
