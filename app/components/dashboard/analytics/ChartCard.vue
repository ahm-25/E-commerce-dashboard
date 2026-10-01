<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5 flex flex-col">
    <div class="flex items-start justify-between gap-4 mb-4">
      <div class="min-w-0">
        <h2 class="font-bold text-primary-navy dark:text-white font-ibm">{{ title }}</h2>
        <p v-if="subtitle" class="text-xs text-muted mt-0.5">{{ subtitle }}</p>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <slot name="legend" />
        <button
          v-if="columns && rows"
          @click="showTable = !showTable"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          :title="showTable ? 'عرض كمخطط' : 'عرض كجدول'"
          :aria-label="showTable ? 'عرض كمخطط' : 'عرض كجدول'"
        >
          <Icon :name="showTable ? 'ph:chart-line' : 'ph:table'" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div v-if="showTable && columns && rows" class="overflow-auto max-h-[320px] -mx-5">
      <table class="w-full text-sm text-right">
        <thead class="bg-gray-50 dark:bg-gray-800/50 text-muted sticky top-0">
          <tr>
            <th v-for="col in columns" :key="col.key" class="px-5 py-2 font-bold whitespace-nowrap">{{ col.label }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-light dark:divide-border-dark">
          <tr v-for="(row, i) in rows" :key="i">
            <td v-for="col in columns" :key="col.key" class="px-5 py-2 text-primary-navy dark:text-white tabular-nums whitespace-nowrap">
              {{ col.format ? col.format(row[col.key], row) : row[col.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="flex-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn } from '~/composables/useChartTheme'

defineProps<{
  title: string
  subtitle?: string
  columns?: TableColumn[]
  rows?: Record<string, any>[]
}>()

const showTable = ref(false)
</script>
