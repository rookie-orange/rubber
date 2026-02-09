# Rubber

A lightweight JavaScript library for creating elastic/rubber-band drag effects with smooth spring animations.

## Features

- Elastic drag resistance with customizable parameters
- Multiple animation types: `spring`, `ease`, `linear`, `none`
- Support for single axis (`x`, `y`) or dual axis (`xy`) dragging
- Custom deformation callbacks for creative effects
- Zero dependencies in core package
- TypeScript support out of the box

## Packages

| Package        | Description                   |
| -------------- | ----------------------------- |
| `@rubber/core` | Core elastic physics engine   |
| `@rubber/dom`  | DOM element bindings          |
| `@rubber/vue`  | Vue 3 component bindings      |

## Installation

> Not yet released

```bash
# Using pnpm
pnpm add @rubber/core @rubber/dom

# Using npm
npm install @rubber/core @rubber/dom

# Using yarn
yarn add @rubber/core @rubber/dom
```

## Quick Start

```typescript
import { createRubberElement } from '@rubber/dom'

const element = document.querySelector('.draggable')

const rubber = createRubberElement(element, {
  axis: 'y',
  maxStretch: 100,
  resistance: 0.5,
  type: 'spring',
  spring: {
    stiffness: 300,
    damping: 20,
  },
})
```

## Core API

```typescript
import { createRubber } from '@rubber/core'

const rubber = createRubber({
  axis: 'y', // 'x' | 'y' | 'xy'
  maxStretch: 80, // Maximum stretch distance in pixels
  resistance: 0.6, // Resistance factor (0-1)
  type: 'spring', // 'spring' | 'ease' | 'linear' | 'none'
  spring: {
    stiffness: 300,
    damping: 20,
  },
  onUpdate: (state) => {
    // Handle state updates
    console.log(state.stretchX, state.stretchY, state.progress)
  },
})

// Control methods
rubber.drag({ deltaY: 10 })
rubber.release()
rubber.configure({ maxStretch: 100 })
rubber.destroy()
```

## Vue Component

```vue
<script setup>
import { VueRubber } from '@rubber/vue'
</script>

<template>
  <VueRubber
    axis="xy"
    :max-stretch="100"
    :resistance="0.5"
    type="spring"
    :spring="{ stiffness: 200, damping: 10 }"
  >
    Drag me
  </VueRubber>
</template>
```

### Props

| Prop         | Type                                    | Default    | Description                        |
| ------------ | --------------------------------------- | ---------- | ---------------------------------- |
| `as`         | `string`                                | `'div'`    | HTML tag to render                 |
| `enabled`    | `boolean`                               | `true`     | Enable/disable the effect          |
| `axis`       | `'x' \| 'y' \| 'xy'`                    | `'x'`      | Drag axis                          |
| `maxStretch` | `number`                                | `150`      | Maximum stretch distance (px)      |
| `resistance` | `number`                                | `0.5`      | Drag resistance factor (0-1)       |
| `intensity`  | `number`                                | `1`        | Scale effect intensity             |
| `type`       | `'spring' \| 'ease' \| 'linear' \| 'none'` | `'spring'` | Animation type                     |
| `spring`     | `{ stiffness, damping, mass? }`         | -          | Spring animation config            |
| `tween`      | `{ duration? }`                         | -          | Tween animation config             |

### Events

| Event       | Payload          | Description                |
| ----------- | ---------------- | -------------------------- |
| `update`    | `RubberState`    | Fired on each state update |
| `dragStart` | -                | Fired when drag starts     |
| `dragEnd`   | -                | Fired when drag ends       |

### Provider

Use `VueRubberProvider` to set default props for all nested `VueRubber` components:

```vue
<script setup>
import { VueRubber, VueRubberProvider } from '@rubber/vue'
</script>

<template>
  <VueRubberProvider type="spring" :spring="{ stiffness: 300, damping: 15 }">
    <VueRubber>Item 1</VueRubber>
    <VueRubber>Item 2</VueRubber>
  </VueRubberProvider>
</template>
```

## Roadmap

- [x] Vue component (`@rubber/vue`)
- [ ] React component (`@rubber/react`) - Coming soon

## License

MIT
