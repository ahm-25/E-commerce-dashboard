<template>
  <div>
    <!-- Single Delete Dialog -->
    <div v-if="isOpen && product" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>
      <div class="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-xl relative z-10 overflow-hidden" dir="rtl">
        <div class="p-6">
          <div class="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
            <Icon name="ph:trash-bold" class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-primary-navy dark:text-white font-ibm mb-2">حذف المنتج؟</h3>
          <p class="text-muted font-medium mb-6">
            هل أنت متأكد من حذف "{{ product.name }}"؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          
          <div class="flex items-center gap-3">
            <button @click="deleteProduct" class="flex-1 bg-danger hover:bg-danger/90 text-white font-bold py-2.5 rounded-lg transition-colors">
              حذف المنتج
            </button>
            <button @click="close" class="flex-1 bg-gray-100 dark:bg-gray-800 text-primary-navy dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 font-bold py-2.5 rounded-lg transition-colors">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bulk Delete Dialog -->
    <div v-if="isBulkOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeBulk"></div>
      <div class="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-xl relative z-10 overflow-hidden" dir="rtl">
        <div class="p-6">
          <div class="w-12 h-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
            <Icon name="ph:trash-bold" class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-primary-navy dark:text-white font-ibm mb-2">حذف المنتجات المحددة؟</h3>
          <p class="text-muted font-medium mb-6">
            أنت على وشك حذف {{ store.selectedProducts.length }} منتجات. لا يمكن التراجع عن هذا الإجراء.
          </p>
          
          <div class="flex items-center gap-3">
            <button @click="bulkDeleteProducts" class="flex-1 bg-danger hover:bg-danger/90 text-white font-bold py-2.5 rounded-lg transition-colors">
              حذف المنتجات
            </button>
            <button @click="closeBulk" class="flex-1 bg-gray-100 dark:bg-gray-800 text-primary-navy dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 font-bold py-2.5 rounded-lg transition-colors">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Product } from '~/stores/products'
import { useProductsStore } from '~/stores/products'

const store = useProductsStore()

const isOpen = ref(false)
const isBulkOpen = ref(false)
const product = ref<Product | null>(null)

const handleOpen = (e: Event) => {
  const customEvent = e as CustomEvent<Product>
  product.value = customEvent.detail
  isOpen.value = true
}

const handleBulkOpen = () => {
  isBulkOpen.value = true
}

const close = () => {
  isOpen.value = false
  setTimeout(() => {
    product.value = null
  }, 300)
}

const closeBulk = () => {
  isBulkOpen.value = false
}

const deleteProduct = () => {
  if (product.value) {
    store.deleteProduct(product.value.id)
    close()
  }
}

const bulkDeleteProducts = () => {
  store.bulkDelete()
  closeBulk()
}

onMounted(() => {
  window.addEventListener('open-delete-dialog', handleOpen)
  window.addEventListener('open-bulk-delete-dialog', handleBulkOpen)
})

onUnmounted(() => {
  window.removeEventListener('open-delete-dialog', handleOpen)
  window.removeEventListener('open-bulk-delete-dialog', handleBulkOpen)
})
</script>
