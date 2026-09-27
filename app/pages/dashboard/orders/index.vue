<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <OrdersHeader />
      <OrdersStats />
      
      <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden flex flex-col">
        <OrdersToolbar />
        <ActiveOrderFilters v-if="store.hasActiveFilters" />
        <OrdersBulkActions v-if="store.selectedOrders.length > 0" />
        
        <div v-if="store.loading" class="p-6">
          <OrdersSkeleton />
        </div>
        
        <div v-else-if="store.error" class="p-12">
          <OrdersErrorState :error="store.error" @retry="store.fetchOrders" />
        </div>
        
        <div v-else-if="store.orders.length === 0" class="p-12">
          <OrdersEmptyState />
        </div>
        
        <div v-else-if="store.filteredOrders.length === 0" class="p-12">
          <OrdersNoResults />
        </div>
        
        <div v-else>
          <!-- Desktop Table View -->
          <div class="hidden md:block">
            <OrdersTable />
          </div>
          
          <!-- Mobile Cards View -->
          <div class="md:hidden p-4">
            <div class="flex flex-col gap-4">
              <OrderCard v-for="order in store.filteredOrders" :key="order.id" :order="order" />
            </div>
          </div>
        </div>
        
        <OrdersPagination v-if="store.orders.length > 0 && store.filteredOrders.length > 0" />
      </div>
    </div>
    
    <OrderPreviewDrawer />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useOrdersStore } from '~/stores/orders'
import OrdersHeader from '~/components/dashboard/orders/OrdersHeader.vue'
import OrdersStats from '~/components/dashboard/orders/OrdersStats.vue'
import OrdersToolbar from '~/components/dashboard/orders/OrdersToolbar.vue'
import ActiveOrderFilters from '~/components/dashboard/orders/ActiveOrderFilters.vue'
import OrdersTable from '~/components/dashboard/orders/OrdersTable.vue'
import OrderCard from '~/components/dashboard/orders/OrderCard.vue'
import OrdersPagination from '~/components/dashboard/orders/OrdersPagination.vue'
import OrdersEmptyState from '~/components/dashboard/orders/OrdersEmptyState.vue'
import OrdersNoResults from '~/components/dashboard/orders/OrdersNoResults.vue'
import OrdersErrorState from '~/components/dashboard/orders/OrdersErrorState.vue'
import OrdersSkeleton from '~/components/dashboard/orders/OrdersSkeleton.vue'
import OrdersBulkActions from '~/components/dashboard/orders/OrdersBulkActions.vue'
import OrderPreviewDrawer from '~/components/dashboard/orders/OrderPreviewDrawer.vue'

const store = useOrdersStore()

useHead({
  title: 'الطلبات | لوحة التحكم'
})

onMounted(() => {
  store.fetchOrders()
})
</script>
