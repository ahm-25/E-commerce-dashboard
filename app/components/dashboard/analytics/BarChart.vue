<template>
  <div class="relative" :style="{ height: `${height}px` }">
    <ClientOnly>
      <Bar :data="chartData" :options="chartOptions" />
      <template #fallback>
        <div class="absolute inset-0 flex items-center justify-center text-muted text-sm">جاري تحميل المخطط...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js'
import { useChartTheme, formatCompact } from '~/composables/useChartTheme'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const props = withDefaults(defineProps<{
  labels: string[]
  values: number[]
  seriesLabel: string
  horizontal?: boolean
  height?: number
  formatValue?: (value: number) => string
}>(), {
  horizontal: false,
  height: 260,
  formatValue: (v: number) => v.toLocaleString('en-US')
})

const { colors, baseOptions } = useChartTheme()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.seriesLabel,
      data: props.values,
      backgroundColor: colors.value.primary,
      hoverBackgroundColor: '#0F5AE0',
      borderRadius: 4,
      borderSkipped: 'start',
      maxBarThickness: props.horizontal ? 18 : 24,
      categoryPercentage: 0.8,
      barPercentage: 0.9
    }
  ]
}))

const chartOptions = computed<any>(() => {
  const base = baseOptions.value
  const valueTicks = { ...base.scales.y.ticks, callback: (v: number) => formatCompact(v) }

  return {
    ...base,
    indexAxis: props.horizontal ? 'y' : 'x',
    interaction: { mode: 'index', intersect: false },
    plugins: {
      ...base.plugins,
      tooltip: {
        ...base.plugins.tooltip,
        displayColors: false,
        callbacks: { label: (ctx: any) => `${props.seriesLabel}: ${props.formatValue(props.horizontal ? ctx.parsed.x : ctx.parsed.y)}` }
      }
    },
    scales: props.horizontal
      ? {
          // RTL: bars grow from the right edge, category labels sit on the right
          x: { ...base.scales.y, reverse: true, ticks: valueTicks },
          y: { ...base.scales.x, position: 'right', ticks: { ...base.scales.x.ticks, autoSkip: false } }
        }
      : {
          x: base.scales.x,
          y: { ...base.scales.y, ticks: valueTicks }
        }
  }
})
</script>
