<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5">
    <h3 class="font-black text-primary-navy dark:text-white mb-4">التصنيف</h3>
    
    <div>
      <div class="relative">
        <select 
          v-model="form.categoryId"
          @change="isDirty = true"
          class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none"
        >
          <option :value="null" disabled>اختر القسم</option>
          <option value="electronics">إلكترونيات</option>
          <option value="clothing">ملابس</option>
          <option value="home">المنزل</option>
        </select>
        <Icon name="ph:caret-down" class="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      </div>
      
      <button class="mt-3 text-primary font-bold text-sm flex items-center gap-1 hover:underline">
        <Icon name="ph:plus" />
        إضافة قسم
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductForm } from '~/composables/useProductForm'
const { form, isDirty } = useProductForm()
</script>
