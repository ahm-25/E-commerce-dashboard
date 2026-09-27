<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden p-6">
    <h2 class="text-lg font-black text-primary-navy dark:text-white mb-6">نوع المنتج</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label 
        class="border-2 rounded-xl p-4 cursor-pointer flex gap-4 transition-colors"
        :class="form.type === 'simple' ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-border-light dark:border-border-dark hover:border-primary/50'"
      >
        <input type="radio" value="simple" v-model="form.type" class="hidden" />
        <div class="mt-0.5 text-primary">
          <Icon v-if="form.type === 'simple'" name="ph:check-circle-fill" class="w-5 h-5" />
          <Icon v-else name="ph:cube" class="w-5 h-5 text-muted" />
        </div>
        <div>
          <div class="font-bold text-primary-navy dark:text-white mb-1">منتج عادي</div>
          <p class="text-muted text-sm">منتج له سعر ومخزون واحد.</p>
        </div>
      </label>

      <label 
        class="border-2 rounded-xl p-4 cursor-pointer flex gap-4 transition-colors"
        :class="form.type === 'variable' ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-border-light dark:border-border-dark hover:border-primary/50'"
      >
        <input type="radio" value="variable" v-model="form.type" class="hidden" />
        <div class="mt-0.5 text-primary">
          <Icon v-if="form.type === 'variable'" name="ph:check-circle-fill" class="w-5 h-5" />
          <Icon v-else name="ph:squares-four" class="w-5 h-5 text-muted" />
        </div>
        <div>
          <div class="font-bold text-primary-navy dark:text-white mb-1">منتج بمتغيرات</div>
          <p class="text-muted text-sm">منتج له خيارات مثل اللون أو المقاس.</p>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductForm } from '~/composables/useProductForm'
const { form } = useProductForm()
</script>
