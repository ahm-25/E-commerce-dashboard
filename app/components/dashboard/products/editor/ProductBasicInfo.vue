<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden p-6">
    <h2 class="text-lg font-black text-primary-navy dark:text-white mb-6">معلومات المنتج</h2>
    
    <div class="flex flex-col gap-4">
      <!-- Name -->
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">اسم المنتج <span class="text-danger">*</span></label>
        <input 
          v-model="form.name" 
          @input="isDirty = true"
          type="text" 
          placeholder="مثال: سماعات لاسلكية Pro" 
          class="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          :class="{'border-danger': errors.name}"
        >
        <p v-if="errors.name" class="text-danger text-xs mt-1">{{ errors.name }}</p>
        <p v-else class="text-muted text-xs mt-1">{{ form.name.length }}/255</p>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الوصف <span class="text-danger">*</span></label>
        
        <!-- Mock Rich Text Toolbar -->
        <div class="border border-border-light dark:border-border-dark border-b-0 rounded-t-lg bg-bg dark:bg-bg-dark p-2 flex gap-2">
          <button class="p-1.5 hover:bg-surface dark:hover:bg-surface-dark rounded text-muted hover:text-primary-navy dark:hover:text-white"><Icon name="ph:text-b-bold" /></button>
          <button class="p-1.5 hover:bg-surface dark:hover:bg-surface-dark rounded text-muted hover:text-primary-navy dark:hover:text-white"><Icon name="ph:text-italic-bold" /></button>
          <button class="p-1.5 hover:bg-surface dark:hover:bg-surface-dark rounded text-muted hover:text-primary-navy dark:hover:text-white"><Icon name="ph:list-dashes-bold" /></button>
          <button class="p-1.5 hover:bg-surface dark:hover:bg-surface-dark rounded text-muted hover:text-primary-navy dark:hover:text-white"><Icon name="ph:link-bold" /></button>
        </div>
        
        <textarea 
          v-model="form.description"
          @input="isDirty = true"
          placeholder="اكتب وصفًا واضحًا للمنتج..." 
          rows="6"
          class="w-full px-4 py-3 rounded-b-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        ></textarea>
        <p class="text-muted text-xs mt-1">{{ form.description.length }}/2000</p>
      </div>

      <!-- Short Description -->
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">وصف مختصر</label>
        <textarea 
          v-model="form.shortDescription"
          @input="isDirty = true"
          placeholder="وصف مختصر يظهر في بطاقات المنتجات..." 
          rows="3"
          class="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-primary-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        ></textarea>
        <p class="text-muted text-xs mt-1">{{ form.shortDescription.length }}/160</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductForm } from '~/composables/useProductForm'
const { form, errors, isDirty } = useProductForm()
</script>
