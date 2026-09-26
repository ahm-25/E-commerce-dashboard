<template>
  <div>
    <!-- Backdrop -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
      @click="close"
    ></div>
    
    <!-- Drawer -->
    <div 
      class="fixed inset-y-0 left-0 w-full sm:w-96 bg-white dark:bg-surface-dark shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
      dir="rtl"
    >
      <div v-if="product" class="flex flex-col h-full">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <h2 class="text-lg font-bold text-primary-navy dark:text-white font-ibm">تفاصيل المنتج</h2>
          <button @click="close" class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-muted hover:text-primary-navy dark:hover:text-white flex items-center justify-center transition-colors">
            <Icon name="ph:x-bold" class="w-4 h-4" />
          </button>
        </div>
        
        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <div class="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 flex items-center justify-center overflow-hidden">
            <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
            <Icon v-else name="ph:image-square-bold" class="w-16 h-16 text-muted/30" />
          </div>
          
          <div class="flex items-start justify-between gap-4 mb-2">
            <h3 class="text-xl font-bold text-primary-navy dark:text-white font-ibm">{{ product.name }}</h3>
            <span class="px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1.5 shrink-0" :class="statusClass(product.status)">
              <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(product.status)"></span>
              {{ statusText(product.status) }}
            </span>
          </div>
          
          <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm mb-6">
            {{ product.price.toLocaleString() }} ج.م
          </div>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center py-3 border-b border-border-light dark:border-border-dark">
              <span class="text-muted font-medium text-sm">رقم المنتج (SKU)</span>
              <span class="font-bold text-primary-navy dark:text-white text-sm font-ibm">{{ product.sku }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-border-light dark:border-border-dark">
              <span class="text-muted font-medium text-sm">القسم</span>
              <span class="font-bold text-primary-navy dark:text-white text-sm">{{ product.category?.name || '—' }}</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-border-light dark:border-border-dark">
              <span class="text-muted font-medium text-sm">المخزون</span>
              <span class="font-bold text-sm px-2 py-0.5 rounded" :class="stockClass(product.stock)">
                {{ product.stock > 0 ? product.stock : 'نفد المخزون' }}
              </span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-border-light dark:border-border-dark">
              <span class="text-muted font-medium text-sm">آخر تحديث</span>
              <span class="font-bold text-primary-navy dark:text-white text-sm">{{ product.updatedAt }}</span>
            </div>
          </div>
          
          <div class="mt-6">
            <h4 class="font-bold text-primary-navy dark:text-white mb-2 text-sm">وصف قصير</h4>
            <p class="text-muted text-sm leading-relaxed">
              هذا نص تجريبي لوصف المنتج. يمكنك تعديل هذا الوصف لاحقاً من خلال صفحة تعديل المنتج. الوصف يساعد العملاء على فهم مميزات المنتج بشكل أفضل.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="p-6 border-t border-border-light dark:border-border-dark flex flex-col gap-3 bg-gray-50/50 dark:bg-gray-800/20">
          <button class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Icon name="ph:pencil-simple-bold" class="w-4 h-4" />
            تعديل المنتج
          </button>
          <button class="w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Icon name="ph:storefront-bold" class="w-4 h-4" />
            عرض في المتجر
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Product } from '~/stores/products'

const isOpen = ref(false)
const product = ref<Product | null>(null)

const handleOpen = (e: Event) => {
  const customEvent = e as CustomEvent<Product>
  product.value = customEvent.detail
  isOpen.value = true
  document.body.style.overflow = 'hidden'
}

const close = () => {
  isOpen.value = false
  document.body.style.overflow = ''
  // Keep product data slightly longer for animation
  setTimeout(() => {
    if (!isOpen.value) {
      product.value = null
    }
  }, 300)
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

const stockClass = (stock: number) => {
  if (stock > 10) return 'bg-success/10 text-success'
  if (stock > 0) return 'bg-warning/10 text-warning'
  return 'bg-danger/10 text-danger'
}

onMounted(() => {
  window.addEventListener('open-product-preview', handleOpen)
})

onUnmounted(() => {
  window.removeEventListener('open-product-preview', handleOpen)
  document.body.style.overflow = ''
})
</script>
