<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <CustomersHeader />
      <CustomersStats />
      
      <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden flex flex-col">
        <CustomersToolbar />
        <ActiveCustomerFilters v-if="store.hasActiveFilters" />
        <CustomersBulkActions v-if="store.selectedCustomers.length > 0" />
        
        <div v-if="store.loading" class="p-6">
          <CustomersSkeleton />
        </div>
        
        <div v-else-if="store.error" class="p-12">
          <CustomersErrorState :error="store.error" @retry="store.fetchCustomers" />
        </div>
        
        <div v-else-if="store.customers.length === 0" class="p-12">
          <CustomersEmptyState />
        </div>
        
        <div v-else-if="store.filteredCustomers.length === 0" class="p-12">
          <CustomersNoResults />
        </div>
        
        <div v-else>
          <!-- Desktop Table View -->
          <div class="hidden md:block">
            <CustomersTable />
          </div>
          
          <!-- Mobile Cards View -->
          <div class="md:hidden p-4">
            <div class="flex flex-col gap-4">
              <CustomerCard v-for="customer in store.filteredCustomers" :key="customer.id" :customer="customer" />
            </div>
          </div>
        </div>
        
        <CustomersPagination v-if="store.customers.length > 0 && store.filteredCustomers.length > 0" />
      </div>
    </div>
    
    <CustomerPreviewDrawer />
    <CustomerForm />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useCustomersStore } from '~/stores/customers'
import CustomersHeader from '~/components/dashboard/customers/CustomersHeader.vue'
import CustomersStats from '~/components/dashboard/customers/CustomersStats.vue'
import CustomersToolbar from '~/components/dashboard/customers/CustomersToolbar.vue'
import ActiveCustomerFilters from '~/components/dashboard/customers/ActiveCustomerFilters.vue'
import CustomersTable from '~/components/dashboard/customers/CustomersTable.vue'
import CustomerCard from '~/components/dashboard/customers/CustomerCard.vue'
import CustomersPagination from '~/components/dashboard/customers/CustomersPagination.vue'
import CustomersEmptyState from '~/components/dashboard/customers/CustomersEmptyState.vue'
import CustomersNoResults from '~/components/dashboard/customers/CustomersNoResults.vue'
import CustomersErrorState from '~/components/dashboard/customers/CustomersErrorState.vue'
import CustomersSkeleton from '~/components/dashboard/customers/CustomersSkeleton.vue'
import CustomersBulkActions from '~/components/dashboard/customers/CustomersBulkActions.vue'
import CustomerPreviewDrawer from '~/components/dashboard/customers/CustomerPreviewDrawer.vue'
import CustomerForm from '~/components/dashboard/customers/CustomerForm.vue'

const store = useCustomersStore()

useHead({
  title: 'العملاء | لوحة التحكم'
})

onMounted(() => {
  store.fetchCustomers()
})
</script>
