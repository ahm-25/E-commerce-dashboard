<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <CategoriesHeader />
      <CategoriesStats />
      
      <div class="flex flex-col xl:flex-row gap-6">
        <!-- Main Content -->
        <div class="flex-1 bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden flex flex-col">
          <CategoriesToolbar />
          <ActiveCategoryFilters v-if="store.hasActiveFilters" />
          <CategoryBulkActions v-if="store.selectedCategories.length > 0" />
          
          <div v-if="store.loading" class="p-6">
            <CategoriesSkeleton />
          </div>
          
          <div v-else-if="store.error" class="p-12">
            <CategoriesErrorState :error="store.error" @retry="store.fetchCategories" />
          </div>
          
          <div v-else-if="store.categories.length === 0 && !store.hasActiveFilters" class="p-12">
            <CategoriesEmptyState />
          </div>
          
          <div v-else-if="store.filteredCategories.length === 0" class="p-12">
            <CategoriesNoResults />
          </div>
          
          <div v-else>
            <!-- Desktop Tree/Table View -->
            <div class="hidden md:block">
              <CategoriesTree />
            </div>
            
            <!-- Mobile Cards View -->
            <div class="md:hidden p-4">
              <div class="flex flex-col gap-4">
                <CategoryCard v-for="category in store.filteredCategories" :key="category.id" :category="category" :level="0" />
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Info Panel (Desktop Only) -->
        <div class="hidden xl:block w-[300px]">
          <div class="bg-primary/5 border border-primary/20 rounded-xl p-5 sticky top-6">
            <div class="flex items-center gap-3 mb-4 text-primary">
              <Icon name="ph:folder-open" class="w-6 h-6" />
              <h3 class="font-bold">إدارة الأقسام</h3>
            </div>
            <p class="text-sm text-text-muted dark:text-text-muted-dark mb-6 leading-relaxed">
              نظّم أقسام متجرك لتحسين تجربة التصفح وتسهيل وصول العملاء للمنتجات.
            </p>
            <div class="flex flex-col gap-3">
                            <NuxtLink v-if="canManage" to="/dashboard/categories/create" class="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm">
                <Icon name="ph:plus-bold" class="w-4 h-4" />
                إضافة قسم
              </NuxtLink>
                            <button v-if="canManage" class="w-full inline-flex items-center justify-center gap-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm">
                <Icon name="ph:arrows-down-up" class="w-4 h-4" />
                إعادة ترتيب الأقسام
              </button>
                            <NuxtLink to="/" target="_blank" class="w-full inline-flex items-center justify-center gap-2 text-muted hover:text-primary-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors">
                <Icon name="ph:arrow-square-out" class="w-4 h-4" />
                عرض المتجر
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <CategoryDeleteDialog />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { useCategoriesStore } from '~/stores/categories'
import CategoriesHeader from '~/components/dashboard/categories/CategoriesHeader.vue'
import CategoriesStats from '~/components/dashboard/categories/CategoriesStats.vue'
import CategoriesToolbar from '~/components/dashboard/categories/CategoriesToolbar.vue'
import ActiveCategoryFilters from '~/components/dashboard/categories/ActiveCategoryFilters.vue'
import CategoriesTree from '~/components/dashboard/categories/CategoriesTree.vue'
import CategoryCard from '~/components/dashboard/categories/CategoryCard.vue'
import CategoriesEmptyState from '~/components/dashboard/categories/CategoriesEmptyState.vue'
import CategoriesNoResults from '~/components/dashboard/categories/CategoriesNoResults.vue'
import CategoriesErrorState from '~/components/dashboard/categories/CategoriesErrorState.vue'
import CategoriesSkeleton from '~/components/dashboard/categories/CategoriesSkeleton.vue'
import CategoryBulkActions from '~/components/dashboard/categories/CategoryBulkActions.vue'
import CategoryDeleteDialog from '~/components/dashboard/categories/CategoryDeleteDialog.vue'

const store = useCategoriesStore()

useHead({
  title: 'الأقسام | لوحة التحكم'
})

onMounted(() => {
  store.fetchCategories()
})

const canManage = useCanManage('products')
</script>
