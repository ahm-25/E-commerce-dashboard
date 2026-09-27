<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden p-6">
    <div class="mb-6">
      <h2 class="text-lg font-black text-primary-navy dark:text-white">المتغيرات</h2>
      <p class="text-muted text-sm mt-1">أضف خيارات المنتج مثل اللون أو المقاس.</p>
    </div>
    
    <div class="border border-border-light dark:border-border-dark rounded-xl p-4 flex flex-col gap-4">
      <div v-for="(opt, idx) in options" :key="idx" class="border border-border-light dark:border-border-dark rounded-lg p-4 bg-bg/50 dark:bg-bg-dark/50">
        <div class="flex items-center justify-between mb-3">
          <input 
            v-model="opt.name"
            placeholder="اسم الخيار (مثال: اللون)" 
            class="px-3 py-1.5 rounded border border-border-light dark:border-border-dark bg-white dark:bg-bg-dark text-sm font-bold text-primary-navy dark:text-white w-1/3"
          >
          <button @click="removeOption(idx)" class="text-danger hover:bg-danger/10 p-1.5 rounded"><Icon name="ph:trash-bold" /></button>
        </div>
        
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="(val, vIdx) in opt.values" 
            :key="vIdx"
            class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            {{ val }}
            <button @click="removeOptionValue(idx, vIdx)" class="text-muted hover:text-danger"><Icon name="ph:x-bold" class="w-3 h-3" /></button>
          </span>
          <input 
            type="text" 
            placeholder="أضف قيمة..." 
            @keydown.enter.prevent="(e) => addOptionValue(idx, e)"
            class="px-3 py-1 rounded-full border border-dashed border-border-light dark:border-border-dark bg-transparent text-sm w-32 focus:outline-none focus:border-primary"
          >
        </div>
      </div>
      
      <button @click="addOption" class="text-primary font-bold text-sm flex items-center justify-center gap-2 py-3 border border-dashed border-border-light dark:border-border-dark rounded-lg hover:bg-primary/5 transition-colors">
        <Icon name="ph:plus-bold" />
        إضافة خيار آخر
      </button>
    </div>
    
    <div v-if="form.variants.length > 0" class="mt-8">
      <h3 class="font-bold text-primary-navy dark:text-white mb-4">المتغيرات الناتجة</h3>
      <div class="overflow-x-auto border border-border-light dark:border-border-dark rounded-xl">
        <table class="w-full text-right text-sm">
          <thead class="bg-bg dark:bg-bg-dark border-b border-border-light dark:border-border-dark">
            <tr>
              <th class="px-4 py-3 font-bold text-primary-navy dark:text-white">المتغير</th>
              <th class="px-4 py-3 font-bold text-primary-navy dark:text-white">SKU</th>
              <th class="px-4 py-3 font-bold text-primary-navy dark:text-white text-left">السعر</th>
              <th class="px-4 py-3 font-bold text-primary-navy dark:text-white text-left">المخزون</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border-light dark:divide-border-dark">
            <tr v-for="(variant, idx) in form.variants" :key="idx" class="hover:bg-bg/50 dark:hover:bg-bg-dark/50 transition-colors">
              <td class="px-4 py-3 font-medium">{{ getVariantName(variant) }}</td>
              <td class="px-4 py-2">
                <input v-model="variant.sku" type="text" class="w-full px-2 py-1.5 rounded border border-border-light dark:border-border-dark text-sm bg-white dark:bg-surface-dark" dir="ltr">
              </td>
              <td class="px-4 py-2">
                <input v-model="variant.price" type="number" class="w-full px-2 py-1.5 rounded border border-border-light dark:border-border-dark text-sm bg-white dark:bg-surface-dark text-left" dir="ltr" placeholder="السعر الافتراضي">
              </td>
              <td class="px-4 py-2">
                <input v-model="variant.stock" type="number" class="w-full px-2 py-1.5 rounded border border-border-light dark:border-border-dark text-sm bg-white dark:bg-surface-dark text-left" dir="ltr" placeholder="0">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useProductForm, type ProductVariant } from '~/composables/useProductForm'

const { form, isDirty } = useProductForm()

const options = ref([
  { name: 'اللون', values: ['أسود', 'أبيض'] },
  { name: 'المقاس', values: ['S', 'M', 'L'] }
])

const addOption = () => {
  options.value.push({ name: '', values: [] })
  isDirty.value = true
}

const removeOption = (idx: number) => {
  options.value.splice(idx, 1)
  isDirty.value = true
  generateVariants()
}

const addOptionValue = (idx: number, e: Event) => {
  const input = e.target as HTMLInputElement
  const val = input.value.trim()
  if (val && !options.value[idx].values.includes(val)) {
    options.value[idx].values.push(val)
    input.value = ''
    isDirty.value = true
    generateVariants()
  }
}

const removeOptionValue = (optIdx: number, valIdx: number) => {
  options.value[optIdx].values.splice(valIdx, 1)
  isDirty.value = true
  generateVariants()
}

const generateVariants = () => {
  // Very simplified mock generation for UI purposes
  if (options.value.length === 0 || options.value.every(o => o.values.length === 0)) {
    form.variants = []
    return
  }
  
  // Create combinations
  const generate = (idx: number, current: Record<string, string>): ProductVariant[] => {
    if (idx === options.value.length) {
      return [{
        options: { ...current },
        sku: `EDX-${Object.values(current).map(v => v.charAt(0).toUpperCase()).join('-')}`,
        price: form.price,
        stock: null
      }]
    }
    
    const opt = options.value[idx]
    if (!opt.name || opt.values.length === 0) return generate(idx + 1, current)
    
    const res: ProductVariant[] = []
    for (const val of opt.values) {
      current[opt.name] = val
      res.push(...generate(idx + 1, current))
    }
    return res
  }
  
  form.variants = generate(0, {})
}

// Initial mock gen
if (form.variants.length === 0) {
  generateVariants()
}

const getVariantName = (variant: ProductVariant) => {
  return Object.values(variant.options).join(' / ')
}
</script>
