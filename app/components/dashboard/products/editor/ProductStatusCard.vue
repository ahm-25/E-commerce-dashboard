<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5">
    <h3 class="font-black text-primary-navy dark:text-white mb-4">حالة المنتج</h3>
    
    <div class="flex flex-col gap-3">
      <label class="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors" :class="form.status === 'draft' ? 'border-primary bg-primary/5' : ''">
        <input type="radio" value="draft" v-model="form.status" @change="isDirty = true" class="mt-1" />
        <div>
          <div class="font-bold text-sm text-primary-navy dark:text-white">مسودة</div>
          <div class="text-xs text-muted">لن يظهر في المتجر.</div>
        </div>
      </label>
      
      <label class="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors" :class="form.status === 'published' ? 'border-primary bg-primary/5' : ''">
        <input type="radio" value="published" v-model="form.status" @change="isDirty = true" class="mt-1" />
        <div>
          <div class="font-bold text-sm text-primary-navy dark:text-white">منشور</div>
          <div class="text-xs text-muted">سيظهر للعملاء في المتجر.</div>
        </div>
      </label>
      
      <label class="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors" :class="form.status === 'archived' ? 'border-primary bg-primary/5' : ''">
        <input type="radio" value="archived" v-model="form.status" @change="isDirty = true" class="mt-1" />
        <div>
          <div class="font-bold text-sm text-primary-navy dark:text-white">مؤرشف</div>
          <div class="text-xs text-muted">لن يظهر في القوائم العامة.</div>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductForm } from '~/composables/useProductForm'
const { form, isDirty } = useProductForm()
</script>
