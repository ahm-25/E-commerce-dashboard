<template>
  <div class="bg-surface dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
    <div class="flex items-start justify-between">
      <div class="flex flex-col">
        <h3 class="text-sm font-bold text-muted mb-3">{{ title }}</h3>
        <div class="text-[28px] font-black text-primary-navy dark:text-white font-ibm tracking-tight leading-none mb-1">{{ value }}</div>
      </div>
      
      <div class="w-12 h-12 rounded-full bg-primary-light/50 dark:bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
        <Icon :name="icon" class="w-6 h-6" />
      </div>
    </div>
    
    <div class="mt-4 flex items-center gap-2">
      <span dir="ltr" v-if="isPositive" class="flex items-center gap-1 text-xs font-bold text-success">
        <Icon name="ph:trend-up-bold" class="w-3.5 h-3.5" />
        {{ change }}
      </span>
      <span dir="ltr" v-else class="flex items-center gap-1 text-xs font-bold text-danger">
        <Icon name="ph:trend-down-bold" class="w-3.5 h-3.5" />
        {{ change }}
      </span>
      <span class="text-[11px] font-bold text-gray-400">مقارنة بالفترة السابقة</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: string
  change: string
  icon: string
}>()

const isPositive = computed(() => props.change.startsWith('+'))
</script>
