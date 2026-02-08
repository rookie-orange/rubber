<script setup lang="ts">
import { VueRubber, VueRubberProvider } from '@rubber/vue'
</script>

<template>
  <div class="h-screen flex justify-center items-center">
    <VueRubberProvider
      axis="y"
      type="spring"
      :spring="{
        stiffness: 200,
        damping: 10,
      }"
    >
      <VueRubber
        class="size-48 rounded-full bg-orange-500 flex items-center justify-center"
      >
        Drag
      </VueRubber>

      <VueRubber
        class="size-48 rounded-full bg-sky-500 flex items-center justify-center"
        type="ease"
        axis="xy"
      >
        Drag
      </VueRubber>
    </VueRubberProvider>
  </div>
</template>
