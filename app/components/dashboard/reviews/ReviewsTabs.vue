<template>
  <div class="border-b border-border-light dark:border-border-dark px-4 overflow-x-auto no-scrollbar">
    <div class="flex space-x-6 space-x-reverse min-w-max">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="store.setTab(tab.id)"
        class="py-4 px-2 relative text-sm font-medium transition-colors"
        :class="store.currentTab === tab.id ? 'text-primary' : 'text-text-muted dark:text-text-muted-dark hover:text-text-strong dark:hover:text-text-strong-dark'"
      >
        <span class="flex items-center gap-2">
          {{ tab.label }}
          <span 
            v-if="tab.count !== undefined"
            class="px-2 py-0.5 rounded-full text-xs font-bold"
            :class="store.currentTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-surface-alt dark:bg-surface-dark-alt text-text-regular dark:text-text-regular-dark'"
          >
            {{ tab.count }}
          </span>
        </span>
        
        <div 
          v-if="store.currentTab === tab.id" 
          class="absolute bottom-0 right-0 left-0 h-0.5 bg-primary rounded-t-full"
        ></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReviewsStore } from '~/stores/reviews'
import { computed } from 'vue'

const store = useReviewsStore()

const tabs = computed(() => [
  { id: 'all', label: 'الكل', count: store.stats?.total },
  { id: 'pending', label: 'قيد المراجعة', count: store.stats?.pending },
  { id: 'approved', label: 'معتمد', count: store.stats?.approved },
  { id: 'hidden', label: 'مخفي', count: store.stats?.hidden },
  { id: 'rejected', label: 'مرفوض', count: store.stats?.rejected },
  { id: 'unanswered', label: 'بدون رد', count: store.stats?.unanswered }
])
</script>
