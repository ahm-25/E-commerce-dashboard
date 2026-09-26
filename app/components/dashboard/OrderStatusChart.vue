<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm h-full flex flex-col">
    <h2 class="text-lg font-bold text-primary-navy dark:text-white font-ibm mb-6">حالة الطلبات</h2>
    
    <div class="flex-1 flex flex-col justify-center">
      <div class="relative w-48 h-48 mx-auto mb-8">
        <ClientOnly>
          <Doughnut :data="chartData" :options="chartOptions" />
          <template #fallback>
             <div class="absolute inset-0 flex items-center justify-center text-muted">...</div>
          </template>
        </ClientOnly>
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-2xl font-bold text-primary-navy dark:text-white font-ibm">{{ totalOrders.toLocaleString() }}</span>
          <span class="text-xs text-muted font-medium mt-1">إجمالي الطلبات</span>
        </div>
      </div>
      
      <div class="flex flex-col gap-4">
        <div v-for="(item, index) in statuses" :key="index" class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2.5">
            <span class="w-3 h-3 rounded-full shadow-sm" :style="{ backgroundColor: item.color }"></span>
            <span class="text-muted font-medium">{{ item.label }}</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="font-bold text-primary-navy dark:text-white">{{ item.value.toLocaleString() }}</span>
            <span class="text-xs font-bold px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 text-muted w-10 text-center">{{ Math.round((item.value / totalOrders) * 100) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'

ChartJS.register(ArcElement, Tooltip)

const statuses = [
  { label: 'مكتملة', value: 774, color: '#1769FF' },
  { label: 'قيد التنفيذ', value: 224, color: '#f59e0b' },
  { label: 'قيد الشحن', value: 150, color: '#10b981' },
  { label: 'ملغاة', value: 100, color: '#ef4444' },
]

const totalOrders = computed(() => statuses.reduce((sum, item) => sum + item.value, 0))

const chartData = computed(() => ({
  labels: statuses.map(s => s.label),
  datasets: [
    {
      data: statuses.map(s => s.value),
      backgroundColor: statuses.map(s => s.color),
      borderWidth: 0,
      hoverOffset: 4
    }
  ]
}))

const chartOptions = computed<any>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      titleFont: { family: 'Cairo' },
      bodyFont: { family: 'Cairo', weight: 'bold' },
      padding: 10,
      callbacks: {
        label: (context: any) => ` ${context.parsed.toLocaleString()} طلب`
      }
    }
  }
}))
</script>
