<template>
  <div class="bg-surface dark:bg-surface-dark p-5 md:p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-primary-navy dark:text-white">شريط الإعلانات</h2>
      
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" v-model="enabled" class="sr-only peer">
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        <span class="mr-3 text-sm font-medium text-primary-navy dark:text-white">{{ enabled ? 'مفعل' : 'معطل' }}</span>
      </label>
    </div>
    
    <div v-if="enabled" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-primary-navy dark:text-gray-200 mb-2">النص</label>
        <input 
          type="text" 
          v-model="text" 
          placeholder="مثال: شحن مجاني للطلبات أكثر من 1000 جنيه"
          class="w-full border-gray-300 dark:border-border-dark dark:bg-surface-dark dark:text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-primary-navy dark:text-gray-200 mb-2">الرابط (اختياري)</label>
        <input 
          type="text" 
          v-model="link" 
          placeholder="https://..."
          class="w-full border-gray-300 dark:border-border-dark dark:bg-surface-dark dark:text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary text-left" dir="ltr"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStoreAppearance } from '~/composables/useStoreAppearance'

const { draftAppearance, updateField } = useStoreAppearance()

const enabled = computed({
  get: () => draftAppearance.value?.announcementBar?.enabled ?? false,
  set: (val) => updateField('announcementBar', 'enabled', val)
})

const text = computed({
  get: () => draftAppearance.value?.announcementBar?.text || '',
  set: (val) => updateField('announcementBar', 'text', val)
})

const link = computed({
  get: () => draftAppearance.value?.announcementBar?.link || '',
  set: (val) => updateField('announcementBar', 'link', val)
})
</script>
