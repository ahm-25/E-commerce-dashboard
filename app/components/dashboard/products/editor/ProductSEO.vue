<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-black text-primary-navy dark:text-white">تحسين محركات البحث (SEO)</h2>
    </div>
    
    <div class="flex flex-col gap-4">
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-bold text-primary-navy dark:text-white">عنوان SEO</label>
          <span class="text-xs text-muted">{{ form.seo.title.length }} / 60</span>
        </div>
        <input 
          v-model="form.seo.title" 
          @input="isDirty = true"
          type="text" 
          placeholder="عنوان الصفحة لمحركات البحث" 
          class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        >
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-bold text-primary-navy dark:text-white">وصف SEO</label>
          <span class="text-xs text-muted">{{ form.seo.description.length }} / 160</span>
        </div>
        <textarea 
          v-model="form.seo.description"
          @input="isDirty = true"
          placeholder="وصف مختصر لمحركات البحث..." 
          rows="3"
          class="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        ></textarea>
      </div>
      
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-bold text-primary-navy dark:text-white">رابط المنتج (Slug)</label>
          <button class="text-primary font-bold text-xs hover:underline">تعديل الرابط</button>
        </div>
        <div class="relative">
          <input 
            v-model="form.seo.slug" 
            @input="isDirty = true"
            type="text" 
            placeholder="wireless-headphones-pro" 
            class="w-full pl-4 pr-32 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-left font-mono text-sm"
            dir="ltr"
          >
          <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted text-sm" dir="ltr">
            https://store.com/p/
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductForm } from '~/composables/useProductForm'
const { form, isDirty } = useProductForm()
</script>
