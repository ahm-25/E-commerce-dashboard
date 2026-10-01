<template>
  <Teleport to="body">
    <div
      v-if="category"
      class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click="close"
    >
      <div class="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl p-6" @click.stop>
        <div class="flex flex-col items-center text-center">
          <div class="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mb-4">
            <Icon name="ph:warning-circle-bold" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-primary-navy dark:text-white mb-2">حذف قسم "{{ category.name }}"؟</h3>
          <p class="text-muted text-sm mb-2">
            لا يمكن التراجع عن هذا الإجراء.
          </p>
          <p v-if="childrenCount > 0" class="text-danger text-sm font-bold mb-2">
            سيتم حذف {{ childrenCount }} قسم فرعي معه.
          </p>
          <p v-if="category.productCount > 0" class="text-muted text-sm mb-2">
            يحتوي القسم على {{ category.productCount }} منتج، ولن يتم حذف المنتجات.
          </p>

          <div class="flex items-center gap-3 w-full mt-4">
            <button
              @click="close"
              :disabled="deleting"
              class="flex-1 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-4 py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              @click="confirmDelete"
              :disabled="deleting"
              class="flex-1 bg-danger hover:bg-danger/90 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
            >
              {{ deleting ? 'جاري الحذف...' : 'حذف القسم' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCategoriesStore } from '~/stores/categories'

const store = useCategoriesStore()
const deleting = ref(false)

const category = computed(() => store.categoryToDelete)
const childrenCount = computed(() => category.value?.children?.length || 0)

const close = () => {
  if (!deleting.value) store.categoryToDelete = null
}

const confirmDelete = async () => {
  if (!category.value) return
  deleting.value = true
  try {
    await store.deleteCategory(category.value.id)
  } finally {
    deleting.value = false
    store.categoryToDelete = null
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

onMounted(() => document.addEventListener('keydown', handleKeyDown))
onUnmounted(() => document.removeEventListener('keydown', handleKeyDown))
</script>
