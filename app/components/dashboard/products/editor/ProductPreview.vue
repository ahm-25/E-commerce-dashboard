<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden hidden xl:block">
    <div class="p-5 border-b border-border-light dark:border-border-dark">
      <h3 class="font-black text-primary-navy dark:text-white">معاينة المنتج</h3>
    </div>
    
    <div class="p-5 flex gap-4">
      <div class="w-20 h-20 bg-bg dark:bg-bg-dark rounded-lg flex-shrink-0 overflow-hidden border border-border-light dark:border-border-dark">
        <img v-if="form.images.length === 0" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" class="w-full h-full object-cover" />
      </div>
      <div class="flex-1 flex flex-col justify-center">
        <h4 class="font-bold text-primary-navy dark:text-white text-sm line-clamp-2" dir="rtl">
          {{ form.name || 'سماعات لاسلكية Pro' }}
        </h4>
        <div class="text-xs text-muted mt-1">{{ form.categoryId === 'electronics' ? 'إلكترونيات' : (form.categoryId || 'القسم') }}</div>
        
        <div class="mt-2 flex items-center gap-2" dir="ltr">
          <span class="font-black text-primary-navy dark:text-white text-sm">{{ form.price || '1,299' }} ج.م</span>
          <span v-if="form.compareAtPrice" class="text-xs text-muted line-through">{{ form.compareAtPrice }} ج.م</span>
        </div>
        
        <div class="mt-2 flex items-center gap-1 text-[10px] font-bold text-success">
          <div class="w-2 h-2 rounded-full bg-success"></div>
          متوفر
        </div>
      </div>
    </div>
    
    <div class="px-5 pb-5">
      <button class="w-full py-2 bg-primary flex items-center justify-center gap-2 text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm">
        <Icon name="ph:arrow-square-out-bold" class="w-4 h-4" />
        عرض في المتجر
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductForm } from '~/composables/useProductForm'
const { form } = useProductForm()
</script>
