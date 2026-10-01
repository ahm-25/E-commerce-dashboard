<template>
  <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden relative group">
    
    <div class="absolute top-2 right-2 z-10 flex items-center gap-2">
      <input 
        type="checkbox" 
        :checked="store.selectedProducts.includes(product.id)"
        @change="store.toggleProductSelection(product.id)"
        class="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 cursor-pointer shadow-sm bg-white dark:bg-surface-dark"
      >
    </div>
    
    <div class="absolute top-2 left-2 z-10">
      <span class="px-2 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1 shadow-sm bg-white dark:bg-surface-dark" :class="statusClass(product.status)">
        <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(product.status)"></span>
        {{ statusText(product.status) }}
      </span>
    </div>
    
    <div class="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer overflow-hidden group-hover:opacity-90 transition-opacity" @click="openPreview">
      <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
      <Icon v-else name="ph:image-square-bold" class="w-10 h-10 text-muted/50" />
    </div>
    
    <div class="p-4 flex flex-col gap-2 flex-1">
      <div class="flex justify-between items-start gap-2">
        <div class="flex flex-col">
          <span class="text-sm font-bold text-primary-navy dark:text-white cursor-pointer hover:text-primary transition-colors line-clamp-1" @click="openPreview">
            {{ product.name }}
          </span>
          <span class="text-xs text-muted font-medium mt-0.5">{{ product.sku }}</span>
        </div>
        
        <div class="relative group/menu">
          <button class="w-8 h-8 -mr-2 -mt-1 rounded-lg flex items-center justify-center text-muted hover:text-primary-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Icon name="ph:dots-three-vertical-bold" class="w-4 h-4" />
          </button>
          
          <div class="absolute left-0 top-full mt-1 w-40 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
            <div class="p-1 flex flex-col">
              <NuxtLink v-if="canManage" :to="`/dashboard/products/${product.id}/edit`" class="flex items-center gap-2 text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Icon name="ph:pencil-simple" class="w-4 h-4 text-muted" />
                تعديل
              </NuxtLink>
              <button class="flex items-center gap-2 text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" @click="openPreview">
                <Icon name="ph:eye" class="w-4 h-4 text-muted" />
                عرض المنتج
              </button>
              <button v-if="canManage" @click="confirmDelete" class="flex items-center gap-2 text-right px-3 py-2 rounded-lg text-sm font-semibold text-danger hover:bg-danger/10 transition-colors">
                <Icon name="ph:trash" class="w-4 h-4" />
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-auto pt-2 flex items-center justify-between">
        <span class="font-ibm font-bold text-primary-navy dark:text-white">
          {{ product.price.toLocaleString() }} ج.م
        </span>
        
        <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="stockClass(product.stock)">
          {{ stockText(product.stock) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import type { Product } from '~/stores/products'
import { useProductsStore } from '~/stores/products'

const props = defineProps<{
  product: Product
}>()

const store = useProductsStore()

const stockClass = (stock: number) => {
  if (stock > 10) return 'bg-success/10 text-success'
  if (stock > 0) return 'bg-warning/10 text-warning'
  return 'bg-danger/10 text-danger'
}

const stockText = (stock: number) => {
  if (stock > 10) return 'متوفر'
  if (stock > 0) return 'مخزون منخفض'
  return 'نفد المخزون'
}

const statusClass = (status: string) => {
  switch (status) {
    case 'published': return 'text-success'
    case 'draft': return 'text-gray-600 dark:text-gray-400'
    case 'archived': return 'text-warning'
    default: return 'text-gray-600'
  }
}

const statusDotClass = (status: string) => {
  switch (status) {
    case 'published': return 'bg-success'
    case 'draft': return 'bg-gray-400'
    case 'archived': return 'bg-warning'
    default: return 'bg-gray-400'
  }
}

const statusText = (status: string) => {
  switch (status) {
    case 'published': return 'منشور'
    case 'draft': return 'مسودة'
    case 'archived': return 'مؤرشف'
    default: return status
  }
}

const openPreview = () => {
  const event = new CustomEvent('open-product-preview', { detail: props.product })
  window.dispatchEvent(event)
}

const confirmDelete = () => {
  const event = new CustomEvent('open-delete-dialog', { detail: props.product })
  window.dispatchEvent(event)
}

const canManage = useCanManage('products')
</script>
