<template>
  <div class="flex flex-col gap-3">
    <div v-for="(step, i) in rows" :key="step.label" class="flex flex-col gap-1">
      <div class="flex items-center justify-between text-sm">
        <span class="font-bold text-primary-navy dark:text-white">{{ step.label }}</span>
        <span class="text-muted">
          <span class="font-bold text-primary-navy dark:text-white tabular-nums">{{ step.count.toLocaleString('en-US') }}</span>
          <span class="text-xs mr-1 tabular-nums">({{ step.ofTotal.toFixed(1) }}%)</span>
        </span>
      </div>
      <div class="h-2.5 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div class="h-full rounded bg-primary transition-all duration-300" :style="{ width: `${Math.max(step.ofTotal, 0.5)}%` }"></div>
      </div>
      <div
        v-if="i < rows.length - 1"
        class="text-[11px] font-bold flex items-center gap-1"
        :class="i === biggestDropIndex ? 'text-warning' : 'text-muted'"
      >
        <Icon :name="i === biggestDropIndex ? 'ph:warning-bold' : 'ph:arrow-down'" class="w-3 h-3" />
        يكمل {{ rows[i + 1].fromPrevious.toFixed(0) }}% للخطوة التالية
        <span v-if="i === biggestDropIndex">· أكبر نقطة تسرّب</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FunnelStep } from '~/stores/analytics'

const props = defineProps<{
  steps: FunnelStep[]
}>()

const rows = computed(() => {
  const total = props.steps[0]?.count || 1
  return props.steps.map((step, i) => ({
    ...step,
    ofTotal: (step.count / total) * 100,
    fromPrevious: i === 0 ? 100 : (step.count / (props.steps[i - 1].count || 1)) * 100
  }))
})

// The step after which the largest share of shoppers leaves
const biggestDropIndex = computed(() => {
  let worst = -1
  let worstRate = Infinity
  rows.value.forEach((row, i) => {
    if (i > 0 && row.fromPrevious < worstRate) {
      worstRate = row.fromPrevious
      worst = i - 1
    }
  })
  return worst
})
</script>
