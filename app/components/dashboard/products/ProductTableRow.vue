<template>
  <tr class="group hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors">
    <td class="py-3 px-4">
      <div class="flex items-center justify-center">
        <input 
          type="checkbox" 
          :checked="store.selectedProducts.includes(product.id)"
          @change="store.toggleProductSelection(product.id)"
          class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
        >
      </div>
    </td>
    
    <td class="py-3 px-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark flex items-center justify-center shrink-0 overflow-hidden">
          <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
          <Icon v-else name="ph:image-square-bold" class="w-5 h-5 text-muted/50" />
        </div>
        <div class="flex flex-col">
          <span class="text-primary-navy dark:text-white font-bold group-hover:text-primary transition-colors cursor-pointer" @click="openPreview">
            {{ product.name }}
          </span>
        </div>
      </div>
    </td>
    
    <td class="py-3 px-4 font-ibm text-muted font-medium text-xs">{{ product.sku }}</td>
    
    <td class="py-3 px-4 text-primary-navy dark:text-white font-medium text-sm">
      {{ product.category?.name || '—' }}
    </td>
    
    <td class="py-3 px-4 font-ibm text-primary-navy dark:text-white font-bold">
      {{ product.price.toLocaleString() }} ج.م
    </td>
    
    <td class="py-3 px-4">
      <span class="px-2 py-1 rounded-md text-[11px] font-bold inline-flex items-center" :class="stockClass(product.stock)">
        {{ stockText(product.stock) }}
        <span class="font-ibm ml-1" v-if="product.stock > 0">({{ product.stock }})</span>
      </span>
    </td>
    
    <td class="py-3 px-4">
      <span class="px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1.5" :class="statusClass(product.status)">
        <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(product.status)"></span>
        {{ statusText(product.status) }}
      </span>
    </td>
    
    <td class="py-3 px-4 text-muted font-medium text-xs">
      {{ product.updatedAt }}
    </td>
    
    <td class="py-3 px-4">
      <div class="flex items-center justify-end gap-1">
        <button class="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-colors" title="عرض" @click="openPreview">
          <Icon name="ph:eye-bold" class="w-4 h-4" />
        </button>
        <NuxtLink v-if="canManage" :to="`/dashboard/products/${product.id}/edit`" class="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-primary/10 transition-colors" title="تعديل">
          <Icon name="ph:pencil-simple-bold" class="w-4 h-4" />
        </NuxtLink>
        
        <div v-if="canManage" class="relative group">
          <button class="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Icon name="ph:dots-three-vertical-bold" class="w-4 h-4" />
          </button>
          
          <div class="absolute left-0 top-full mt-1 w-40 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
            <div class="p-1 flex flex-col">
              <NuxtLink :to="`/dashboard/products/${product.id}/edit`" class="flex items-center gap-2 text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Icon name="ph:pencil-simple" class="w-4 h-4 text-muted" />
                تعديل
              </NuxtLink>
              <button class="flex items-center gap-2 text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" @click="openPreview">
                <Icon name="ph:eye" class="w-4 h-4 text-muted" />
                عرض المنتج
              </button>
              <button class="flex items-center gap-2 text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Icon name="ph:copy" class="w-4 h-4 text-muted" />
                نسخ المنتج
              </button>
              <div class="h-px bg-border-light dark:bg-border-dark my-1 mx-2"></div>
              <button class="flex items-center gap-2 text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Icon name="ph:archive" class="w-4 h-4 text-muted" />
                أرشفة
              </button>
              <button @click="confirmDelete" class="flex items-center gap-2 text-right px-3 py-2 rounded-lg text-sm font-semibold text-danger hover:bg-danger/10 transition-colors">
                <Icon name="ph:trash" class="w-4 h-4" />
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </td>
  </tr>
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
    case 'published': return 'bg-success/10 text-success'
    case 'draft': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
    case 'archived': return 'bg-warning/10 text-warning'
    default: return 'bg-gray-100 text-gray-600'
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
  // Logic to open preview drawer using a shared state or emit
  // Assuming there's a global composable for modals or emitting an event
  const event = new CustomEvent('open-product-preview', { detail: props.product })
  window.dispatchEvent(event)
}

const confirmDelete = () => {
  const event = new CustomEvent('open-delete-dialog', { detail: props.product })
  window.dispatchEvent(event)
}

const canManage = useCanManage('products')
</script>
