<template>
  <div class="border-b border-border-light dark:border-border-dark px-4 flex overflow-x-auto hide-scrollbar">
    <button 
      v-for="tab in tabs" 
      :key="tab.value"
      @click="store.selectedTab = tab.value"
      class="px-4 py-4 text-sm font-bold whitespace-nowrap transition-colors relative"
      :class="store.selectedTab === tab.value ? 'text-primary' : 'text-muted hover:text-primary-navy dark:hover:text-white'"
    >
      {{ tab.label }}
      <div v-if="store.selectedTab === tab.value" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useDiscountsStore } from '~/stores/discounts'
const store = useDiscountsStore()

const tabs = [
  { label: 'الكل', value: 'all' },
  { label: 'النشطة', value: 'active' },
  { label: 'المجدولة', value: 'scheduled' },
  { label: 'المنتهية', value: 'expired' },
  { label: 'الكوبونات', value: 'coupon' },
  { label: 'الخصومات التلقائية', value: 'automatic' },
]
</script>
<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
