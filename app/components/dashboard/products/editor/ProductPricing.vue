<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden p-6">
    <h2 class="text-lg font-black text-primary-navy dark:text-white mb-6">السعر</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Price -->
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">
          {{ form.type === 'variable' ? 'السعر الأساسي' : 'السعر' }}
          <span v-if="form.type === 'simple'" class="text-danger">*</span>
        </label>
        <div class="relative">
          <input 
            v-model="form.price" 
            @input="isDirty = true"
            type="number" 
            step="0.01"
            min="0"
            placeholder="0.00" 
            class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors pr-12 text-left"
            dir="ltr"
            :class="{'border-danger': errors.price}"
          >
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted font-medium bg-bg dark:bg-bg-dark border-l border-border-light dark:border-border-dark rounded-r-lg px-3">
            ج.م
          </div>
        </div>
        <p v-if="errors.price" data-field-error class="text-danger text-xs mt-1">{{ errors.price }}</p>
        <p v-else-if="form.type === 'variable'" class="text-muted text-xs mt-1">للمتغيرات اللي مالهاش سعر خاص</p>
      </div>

      <!-- Compare at Price -->
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">السعر قبل الخصم</label>
        <div class="relative">
          <input 
            v-model="form.compareAtPrice" 
            @input="isDirty = true"
            type="number" 
            step="0.01"
            min="0"
            placeholder="0.00" 
            class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors pr-12 text-left"
            dir="ltr"
            :class="{'border-danger': errors.compareAtPrice}"
          >
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted font-medium bg-bg dark:bg-bg-dark border-l border-border-light dark:border-border-dark rounded-r-lg px-3">
            ج.م
          </div>
        </div>
        <p v-if="errors.compareAtPrice" data-field-error class="text-danger text-xs mt-1">{{ errors.compareAtPrice }}</p>
        <p v-else class="text-muted text-[11px] mt-1">استخدم هذا الحقل لعرض السعر الأصلي قبل الخصم.</p>
      </div>

      <!-- Cost -->
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">تكلفة المنتج</label>
        <div class="relative">
          <input 
            v-model="form.cost" 
            @input="isDirty = true"
            type="number" 
            step="0.01"
            min="0"
            placeholder="0.00" 
            class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors pr-12 text-left"
            dir="ltr"
          >
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted font-medium bg-bg dark:bg-bg-dark border-l border-border-light dark:border-border-dark rounded-r-lg px-3">
            ج.م
          </div>
        </div>
        <p class="text-muted text-[11px] mt-1">تستخدم لحساب هامش الربح.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductForm } from '~/composables/useProductForm'
const { form, errors, isDirty } = useProductForm()
</script>
