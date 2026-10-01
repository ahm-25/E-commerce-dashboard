import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// Column definition for a chart's table view
export interface TableColumn {
  key: string
  label: string
  format?: (value: any, row: any) => string
}

// Shared Chart.js styling that follows the `dark` class on <html>
export const useChartTheme = () => {
  const isDark = ref(false)
  let observer: MutationObserver | null = null

  onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark')
    observer = new MutationObserver(() => {
      isDark.value = document.documentElement.classList.contains('dark')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  })

  onBeforeUnmount(() => observer?.disconnect())

  const colors = computed(() => ({
    primary: '#1769FF',
    // Comparison series: neutral, so the current period stays the focus
    comparison: isDark.value ? '#64748b' : '#94a3b8',
    grid: isDark.value ? '#334155' : '#e2e8f0',
    tick: isDark.value ? '#94a3b8' : '#64748b',
    surface: isDark.value ? '#1e293b' : '#FFFFFF',
    tooltipBg: isDark.value ? '#0f172a' : '#0B1626'
  }))

  const baseOptions = computed<any>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: { display: false },
      tooltip: {
        rtl: true,
        textDirection: 'rtl',
        backgroundColor: colors.value.tooltipBg,
        titleFont: { family: 'Cairo', size: 12 },
        bodyFont: { family: 'Cairo', size: 13, weight: 'bold' },
        padding: 10,
        boxPadding: 4
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { family: 'Cairo', size: 11 }, color: colors.value.tick, maxRotation: 0, autoSkipPadding: 16 }
      },
      y: {
        beginAtZero: true,
        grid: { color: colors.value.grid },
        border: { display: false },
        ticks: { font: { family: 'Cairo', size: 11 }, color: colors.value.tick }
      }
    }
  }))

  return { isDark, colors, baseOptions }
}

export const formatCurrency = (value: number) => `${Math.round(value).toLocaleString('en-US')} ج.م`

export const formatCompact = (value: number) => {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return `${value}`
}

export const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'short' })

export const percentChange = (current: number, previous: number) =>
  previous ? ((current - previous) / previous) * 100 : 0
