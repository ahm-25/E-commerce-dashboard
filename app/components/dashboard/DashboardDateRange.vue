<template>
  <div class="relative">
    <button @click="isOpen = !isOpen" class="flex items-center gap-2 bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
      <Icon name="ph:calendar-blank-bold" class="w-4 h-4 text-muted" />
      <span class="text-primary-navy dark:text-white">{{ selectedLabel }}</span>
      <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted mr-2" />
    </button>
    
    <div v-if="isOpen" class="absolute top-full left-0 md:left-auto md:right-0 mt-2 w-48 bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg shadow-black/5 py-1.5 z-20 overflow-hidden">
      <button 
        v-for="option in options" 
        :key="option.value"
        @click="select(option)"
        class="w-full text-right px-4 py-2.5 text-sm transition-colors flex items-center justify-between group"
        :class="selected === option.value ? 'bg-primary-light/50 dark:bg-primary/10 text-primary font-bold' : 'text-muted hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-navy dark:hover:text-white font-medium'"
      >
        {{ option.label }}
        <Icon v-if="selected === option.value" name="ph:check-bold" class="w-4 h-4" />
      </button>
    </div>
    
    <!-- Backdrop for mobile/outside click -->
    <div v-if="isOpen" class="fixed inset-0 z-10" @click="isOpen = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const isOpen = ref(false)
const selected = ref('last_30_days')

const options = [
  { label: 'اليوم', value: 'today' },
  { label: 'آخر 7 أيام', value: 'last_7_days' },
  { label: 'آخر 30 يوم', value: 'last_30_days' },
  { label: 'هذا الشهر', value: 'this_month' },
  { label: 'الشهر الماضي', value: 'last_month' },
  { label: 'مخصص', value: 'custom' },
]

const selectedLabel = computed(() => options.find(o => o.value === selected.value)?.label || '')

const select = (option: any) => {
  selected.value = option.value
  isOpen.value = false
}
</script>
