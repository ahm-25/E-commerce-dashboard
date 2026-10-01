<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden hidden xl:block">
    <div class="p-5 border-b border-border-light dark:border-border-dark">
      <h3 class="font-black text-primary-navy dark:text-white">معاينة المنتج</h3>
    </div>

    <div class="p-5 flex gap-4">
      <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden border border-border-light dark:border-border-dark flex items-center justify-center">
        <img v-if="form.images[0]" :src="form.images[0].url" :alt="form.name" class="w-full h-full object-cover" />
        <Icon v-else name="ph:image" class="w-8 h-8 text-muted opacity-50" />
      </div>
      <div class="flex-1 min-w-0 flex flex-col justify-center">
        <h4 class="font-bold text-sm line-clamp-2" :class="form.name ? 'text-primary-navy dark:text-white' : 'text-muted'">
          {{ form.name || 'اسم المنتج' }}
        </h4>
        <div class="text-xs text-muted mt-1">{{ categoryName || 'بدون قسم' }}</div>
        <div class="mt-2 flex items-center gap-2">
          <span class="font-black text-primary-navy dark:text-white text-sm">{{ priceLabel }}</span>
          <span v-if="compareAt != null && form.type === 'simple'" class="text-xs text-muted line-through">{{ compareAt.toLocaleString('en-US') }} ج.م</span>
        </div>
        <div v-if="form.type === 'variable' && form.variants.length" class="text-xs text-muted mt-1">{{ form.variants.length }} متغير</div>
        <div v-if="form.trackInventory" class="mt-2 flex items-center gap-1 text-[11px] font-bold" :class="stockState.class">
          <div class="w-2 h-2 rounded-full" :class="stockState.dot"></div>
          {{ stockState.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProductForm, toNumber } from '~/composables/useProductForm'
import { useCategoriesStore } from '~/stores/categories'

const { form, priceRange, totalStock } = useProductForm()
const categories = useCategoriesStore()

const categoryName = computed(() => (form.categoryId ? categories.categoryById(form.categoryId)?.name : null))
const compareAt = computed(() => toNumber(form.compareAtPrice))

const priceLabel = computed(() => {
  const range = priceRange.value
  if (!range) return '— ج.م'
  if (range.min === range.max) return `${range.min.toLocaleString('en-US')} ج.م`
  return `من ${range.min.toLocaleString('en-US')} ج.م`
})

const stockState = computed(() => {
  const threshold = toNumber(form.lowStockThreshold) ?? 5
  if (totalStock.value <= 0) return form.allowBackorders
    ? { label: 'متاح للطلب المسبق', class: 'text-warning', dot: 'bg-warning' }
    : { label: 'نفد المخزون', class: 'text-danger', dot: 'bg-danger' }
  if (totalStock.value <= threshold) return { label: `متبقي ${totalStock.value} بس`, class: 'text-warning', dot: 'bg-warning' }
  return { label: `متوفر (${totalStock.value})`, class: 'text-success', dot: 'bg-success' }
})
</script>
