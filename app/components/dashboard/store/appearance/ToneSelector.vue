<template>
  <div>
    <div class="text-sm font-bold text-primary-navy dark:text-white mb-2">{{ label }}</div>
    <div class="grid grid-cols-3 gap-2" role="radiogroup" :aria-label="label">
      <button
        v-for="o in options"
        :key="o.value"
        type="button"
        role="radio"
        :aria-checked="model === o.value"
        @click="model = o.value"
        class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition-colors"
        :class="model === o.value
          ? 'border-primary ring-1 ring-primary bg-primary-light dark:bg-primary/10 text-primary'
          : 'border-border-light dark:border-border-dark text-muted hover:border-gray-300 dark:hover:border-gray-500'"
      >
        <span class="w-4 h-4 rounded-full border border-black/10 shrink-0" :style="{ backgroundColor: o.swatch }"></span>
        {{ o.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SurfaceTone } from '~/stores/storeAppearance'

const props = defineProps<{ label: string, brand: string }>()
const model = defineModel<SurfaceTone>({ required: true })

const options = computed(() => [
  { value: 'light' as const, label: 'فاتح', swatch: '#FFFFFF' },
  { value: 'dark' as const, label: 'داكن', swatch: '#111827' },
  { value: 'brand' as const, label: 'لون البراند', swatch: props.brand }
])
</script>
