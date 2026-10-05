<template>
  <div class="bg-surface dark:bg-surface-dark p-5 md:p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
    <h2 class="text-lg font-bold text-primary-navy dark:text-white mb-4">الخطوط</h2>
    
    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-primary-navy dark:text-gray-200 mb-2">نوع الخط الأساسي</label>
        <select 
          v-model="fontFamily" 
          class="w-full border-gray-300 dark:border-border-dark dark:bg-surface-dark dark:text-white rounded-lg shadow-sm focus:ring-primary focus:border-primary"
        >
          <option value="Cairo">Cairo</option>
          <option value="IBM Plex Sans Arabic">IBM Plex Sans Arabic</option>
          <option value="Tajawal">Tajawal</option>
          <option value="Alexandria">Alexandria</option>
          <option value="Almarai">Almarai</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-primary-navy dark:text-gray-200 mb-2">حجم الخط الأساسي</label>
        <div class="flex items-center gap-4">
          <input 
            type="range" 
            v-model.number="baseFontSize" 
            min="12" 
            max="20" 
            step="1"
            class="flex-1"
          />
          <span class="text-sm font-medium text-primary-navy dark:text-gray-200 w-8">{{ baseFontSize }}px</span>
        </div>
      </div>

      <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-border-light dark:border-border-dark">
        <DashboardStoreAppearanceTypographyPreview />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStoreAppearance } from '~/composables/useStoreAppearance'

const { draftAppearance, updateField } = useStoreAppearance()

const fontFamily = computed({
  get: () => draftAppearance.value?.typography.fontFamily || 'Cairo',
  set: (val) => updateField('typography', 'fontFamily', val)
})

const baseFontSize = computed({
  get: () => draftAppearance.value?.typography.baseFontSize || 16,
  set: (val) => updateField('typography', 'baseFontSize', val)
})
</script>
