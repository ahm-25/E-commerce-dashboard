<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <DiscountsHeader />
      <DiscountsStats />
      
      <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden flex flex-col">
        <DiscountsTabs />
        <DiscountsToolbar />
        <ActiveDiscountFilters v-if="store.hasActiveFilters" />
        <DiscountsBulkActions v-if="store.selectedDiscounts.length > 0" />
        
        <div v-if="store.loading" class="p-6">
          <DiscountsSkeleton />
        </div>
        
        <div v-else-if="store.error" class="p-12">
          <DiscountsErrorState :error="store.error" @retry="store.fetchDiscounts" />
        </div>
        
        <div v-else-if="store.discounts.length === 0 && !store.hasActiveFilters" class="p-12">
          <DiscountsEmptyState />
        </div>
        
        <div v-else-if="store.filteredDiscounts.length === 0" class="p-12">
          <DiscountsNoResults />
        </div>
        
        <div v-else class="flex flex-col h-full">
          <!-- Desktop/Mobile Table -->
          <!-- In a real app, mobile cards view would go here. For now we use the responsive table -->
          <DiscountsTable />
          
          <DiscountsPagination />
        </div>
      </div>
    </div>
    
    <DiscountDeleteDialog />
    <DiscountDisableDialog />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '#imports'
import { useDiscountsStore } from '~/stores/discounts'
import DiscountsHeader from '~/components/dashboard/discounts/DiscountsHeader.vue'
import DiscountsStats from '~/components/dashboard/discounts/DiscountsStats.vue'
import DiscountsTabs from '~/components/dashboard/discounts/DiscountsTabs.vue'
import DiscountsToolbar from '~/components/dashboard/discounts/DiscountsToolbar.vue'
import ActiveDiscountFilters from '~/components/dashboard/discounts/ActiveDiscountFilters.vue'
import DiscountsBulkActions from '~/components/dashboard/discounts/DiscountsBulkActions.vue'
import DiscountsTable from '~/components/dashboard/discounts/DiscountsTable.vue'
import DiscountsPagination from '~/components/dashboard/discounts/DiscountsPagination.vue'
import DiscountsSkeleton from '~/components/dashboard/discounts/DiscountsSkeleton.vue'
import DiscountsErrorState from '~/components/dashboard/discounts/DiscountsErrorState.vue'
import DiscountsEmptyState from '~/components/dashboard/discounts/DiscountsEmptyState.vue'
import DiscountsNoResults from '~/components/dashboard/discounts/DiscountsNoResults.vue'
import DiscountDeleteDialog from '~/components/dashboard/discounts/DiscountDeleteDialog.vue'
import DiscountDisableDialog from '~/components/dashboard/discounts/DiscountDisableDialog.vue'

const store = useDiscountsStore()

useHead({
  title: 'العروض والخصومات | لوحة التحكم'
})

onMounted(() => {
  store.fetchDiscounts()
})
</script>
