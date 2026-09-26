<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm h-full flex flex-col">
    <div class="mb-4">
      <h2 class="text-lg font-bold text-primary-navy dark:text-white font-ibm">المبيعات</h2>
      <p class="text-sm text-muted">أداء المبيعات خلال الفترة المحددة</p>
    </div>
    <div class="flex-1 relative min-h-[300px]">
      <ClientOnly>
        <Line v-if="chartData" :data="chartData" :options="chartOptions" />
        <template #fallback>
          <div class="absolute inset-0 flex items-center justify-center text-muted">جاري تحميل المخطط...</div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

const isDark = ref(false)
let observer: MutationObserver | null = null;

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
  
  observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

const chartData = computed(() => ({
  labels: ['1 أبريل', '5 أبريل', '10 أبريل', '15 أبريل', '20 أبريل', '25 أبريل', '30 أبريل'],
  datasets: [
    {
      label: 'المبيعات',
      data: [5000, 10000, 8000, 16000, 12000, 22000, 28450],
      borderColor: '#1769FF',
      backgroundColor: isDark.value ? 'rgba(23, 105, 255, 0.2)' : 'rgba(23, 105, 255, 0.1)',
      borderWidth: 3,
      pointBackgroundColor: '#FFFFFF',
      pointBorderColor: '#1769FF',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.4
    }
  ]
}))

const chartOptions = computed<any>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: isDark.value ? '#1e293b' : '#0B1626',
      titleFont: { family: 'Cairo', size: 13 },
      bodyFont: { family: 'Cairo', size: 14, weight: 'bold' },
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (context: any) => `${context.parsed.y.toLocaleString()} ج.م`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: isDark.value ? '#334155' : '#e2e8f0',
        drawBorder: false,
      },
      ticks: {
        font: { family: 'Cairo' },
        color: isDark.value ? '#94a3b8' : '#64748b',
        callback: (value: number) => {
          if (value >= 1000) return value / 1000 + 'K'
          return value
        }
      },
      border: { display: false }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: { family: 'Cairo' },
        color: isDark.value ? '#94a3b8' : '#64748b',
      },
      border: { display: false }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
}))
</script>
