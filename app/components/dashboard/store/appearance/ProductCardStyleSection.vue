<template>
  <div class="bg-surface dark:bg-surface-dark p-5 md:p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
    <h2 class="text-lg font-bold text-primary-navy dark:text-white mb-4">بطاقات المنتجات</h2>
    
    <div class="grid grid-cols-2 gap-4">
      <button 
        v-for="option in options" 
        :key="option.value"
        @click="productCardStyle = option.value"
        class="border rounded-xl p-4 flex flex-col items-center gap-4 transition-colors"
        :class="productCardStyle === option.value ? 'border-primary bg-primary-light dark:bg-primary/10 ring-1 ring-primary' : 'border-border-light dark:border-border-dark hover:border-gray-300'"
      >
        <!-- Mini Product Card Preview -->
        <div 
          class="w-full bg-white transition-all overflow-hidden"
          :class="[
            option.previewClass,
            { 'border border-gray-200': option.value === 'bordered' || option.value === 'classic' },
            { 'shadow-md hover:shadow-lg': option.value === 'elevated' },
            { 'shadow-none border-none': option.value === 'minimal' }
          ]"
        >
          <div class="w-full aspect-square bg-gray-100 flex items-center justify-center mb-2">
            <Icon name="lucide:image" class="w-8 h-8 text-gray-300" />
          </div>
          <div class="p-2 text-right">
            <div class="h-3 w-3/4 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 w-1/2 bg-gray-300 rounded"></div>
          </div>
        </div>

        <span class="text-sm font-medium" :class="productCardStyle === option.value ? 'text-primary' : 'text-muted'">
          {{ option.label }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStoreAppearance, type StoreAppearance } from '~/composables/useStoreAppearance'

const { draftAppearance, updateField } = useStoreAppearance()

const productCardStyle = computed({
  get: () => draftAppearance.value?.productCard.style || 'classic',
  set: (val) => updateField('productCard', 'style', val)
})

const options: { value: StoreAppearance['productCard']['style'], label: string, previewClass: string }[] = [
  { value: 'minimal', label: 'بسيطة (بدون إطار)', previewClass: 'rounded-none' },
  { value: 'classic', label: 'كلاسيكية (بإطار)', previewClass: 'rounded-md' },
  { value: 'elevated', label: 'بارزة (بظل)', previewClass: 'rounded-lg' },
  { value: 'bordered', label: 'محددة', previewClass: 'rounded-2xl border-2' }
]
</script>
