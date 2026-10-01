<template>
  <div class="relative h-[280px]">
    <ClientOnly>
      <Line :data="chartData" :options="chartOptions" />
      <template #fallback>
        <div class="absolute inset-0 flex items-center justify-center text-muted text-sm">جاري تحميل المخطط...</div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js'
import type { DailyPoint } from '~/stores/analytics'
import { useChartTheme, formatCurrency, formatCompact, formatShortDate } from '~/composables/useChartTheme'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const props = defineProps<{
  current: DailyPoint[]
  previous: DailyPoint[]
}>()

const { colors, baseOptions } = useChartTheme()

const chartData = computed(() => ({
  labels: props.current.map(p => formatShortDate(p.date)),
  datasets: [
    {
      label: 'الفترة الحالية',
      data: props.current.map(p => p.revenue),
      borderColor: colors.value.primary,
      backgroundColor: 'rgba(23, 105, 255, 0.08)',
      borderWidth: 2,
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: colors.value.primary,
      pointHoverBorderColor: colors.value.surface,
      pointHoverBorderWidth: 2,
      order: 1
    },
    {
      label: 'الفترة السابقة',
      data: props.previous.map(p => p.revenue),
      borderColor: colors.value.comparison,
      borderWidth: 2,
      fill: false,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: colors.value.comparison,
      pointHoverBorderColor: colors.value.surface,
      pointHoverBorderWidth: 2,
      order: 2
    }
  ]
}))

const chartOptions = computed<any>(() => ({
  ...baseOptions.value,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    ...baseOptions.value.plugins,
    tooltip: {
      ...baseOptions.value.plugins.tooltip,
      callbacks: {
        title: (items: any[]) => {
          const i = items[0]?.dataIndex ?? 0
          const prev = props.previous[i]
          return prev
            ? `${formatShortDate(props.current[i].date)}  (مقابل ${formatShortDate(prev.date)})`
            : formatShortDate(props.current[i].date)
        },
        label: (ctx: any) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`
      }
    }
  },
  scales: {
    ...baseOptions.value.scales,
    y: {
      ...baseOptions.value.scales.y,
      ticks: { ...baseOptions.value.scales.y.ticks, callback: (v: number) => formatCompact(v) }
    }
  }
}))
</script>
