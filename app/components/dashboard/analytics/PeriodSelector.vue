<template>
  <div class="inline-flex bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg p-1 shadow-sm" role="radiogroup" aria-label="الفترة">
    <button
      v-for="option in options"
      :key="option.value"
      role="radio"
      :aria-checked="model === option.value"
      @click="model = option.value"
      class="px-4 py-1.5 rounded-md text-sm font-bold transition-colors"
      :class="model === option.value ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-primary-navy dark:hover:text-white'"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { AnalyticsPeriod } from '~/stores/analytics'

const model = defineModel<AnalyticsPeriod>({ required: true })

const options: { value: AnalyticsPeriod, label: string }[] = [
  { value: 7, label: '7 أيام' },
  { value: 30, label: '30 يوم' },
  { value: 90, label: '90 يوم' }
]
</script>
