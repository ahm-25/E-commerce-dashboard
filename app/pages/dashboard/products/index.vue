<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <ProductsHeader />
      <ProductsStats />
      
      <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden flex flex-col">
        <ProductsToolbar />
        <ActiveFilters v-if="store.hasActiveFilters" />
        <ProductsBulkActions v-if="store.selectedProducts.length > 0" />
        
        <div v-if="store.loading" class="p-6">
          <ProductsSkeleton />
        </div>
        
        <div v-else-if="store.error" class="p-12">
          <ProductsErrorState :error="store.error" @retry="store.fetchProducts" />
        </div>
        
        <div v-else-if="store.products.length === 0" class="p-12">
          <ProductsEmptyState />
        </div>
        
        <div v-else-if="store.filteredProducts.length === 0" class="p-12">
          <ProductsNoResults />
        </div>
        
        <div v-else>
          <!-- Desktop Table View -->
          <div v-if="store.viewMode === 'table'" class="hidden md:block">
            <ProductsTable />
          </div>
          
          <!-- Desktop Grid View / Mobile View -->
          <div v-else-if="store.viewMode === 'grid'" class="p-6">
            <ProductGrid />
          </div>
          
          <!-- Mobile Cards View (Always shown on mobile instead of table) -->
          <div class="md:hidden p-4" v-if="store.viewMode === 'table'">
            <div class="flex flex-col gap-4">
              <ProductCard v-for="product in store.filteredProducts" :key="product.id" :product="product" />
            </div>
          </div>
        </div>
        
        <ProductsPagination v-if="store.products.length > 0 && store.filteredProducts.length > 0" />
      </div>
    </div>
    
    <ProductDeleteDialog />
    <ProductPreviewDrawer />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
import ProductsHeader from '~/components/dashboard/products/ProductsHeader.vue'
import ProductsStats from '~/components/dashboard/products/ProductsStats.vue'
import ProductsToolbar from '~/components/dashboard/products/ProductsToolbar.vue'
import ActiveFilters from '~/components/dashboard/products/ActiveFilters.vue'
import ProductsTable from '~/components/dashboard/products/ProductsTable.vue'
import ProductGrid from '~/components/dashboard/products/ProductGrid.vue'
import ProductCard from '~/components/dashboard/products/ProductCard.vue'
import ProductsPagination from '~/components/dashboard/products/ProductsPagination.vue'
import ProductsEmptyState from '~/components/dashboard/products/ProductsEmptyState.vue'
import ProductsNoResults from '~/components/dashboard/products/ProductsNoResults.vue'
import ProductsErrorState from '~/components/dashboard/products/ProductsErrorState.vue'
import ProductsSkeleton from '~/components/dashboard/products/ProductsSkeleton.vue'
import ProductsBulkActions from '~/components/dashboard/products/ProductsBulkActions.vue'
import ProductDeleteDialog from '~/components/dashboard/products/ProductDeleteDialog.vue'
import ProductPreviewDrawer from '~/components/dashboard/products/ProductPreviewDrawer.vue'

const store = useProductsStore()

useHead({
  title: 'المنتجات | لوحة التحكم'
})

onMounted(() => {
  store.fetchProducts()
})
</script>
