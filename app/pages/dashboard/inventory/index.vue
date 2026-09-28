<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <InventoryHeader />
      <InventoryStats />
      <InventoryHealth />
      
      <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden flex flex-col">
        <InventoryTabs />
        <InventoryToolbar />
        <InventoryBulkActions v-if="store.selectedItems.length > 0" />
        
        <div v-if="store.loading" class="p-12 text-center text-muted">
          جاري التحميل...
        </div>
        <div v-else-if="store.error" class="p-12 text-center text-danger font-bold">
          {{ store.error }}
        </div>
        <div v-else-if="store.inventoryItems.length === 0" class="p-12 text-center text-muted">
          لا توجد بيانات مخزون. ستظهر بيانات المخزون هنا بعد إضافة المنتجات.
        </div>
        <div v-else-if="store.filteredItems.length === 0" class="p-12 text-center text-muted">
          لم يتم العثور على منتجات. جرّب تغيير البحث أو إزالة بعض الفلاتر.
        </div>
        <InventoryTable v-else />
      </div>
    </div>
    
    <StockAdjustmentDialog />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useInventoryStore } from '~/stores/inventory'
import InventoryHeader from '~/components/dashboard/inventory/InventoryHeader.vue'
import InventoryStats from '~/components/dashboard/inventory/InventoryStats.vue'
import InventoryHealth from '~/components/dashboard/inventory/InventoryHealth.vue'
import InventoryTabs from '~/components/dashboard/inventory/InventoryTabs.vue'
import InventoryToolbar from '~/components/dashboard/inventory/InventoryToolbar.vue'
import InventoryTable from '~/components/dashboard/inventory/InventoryTable.vue'
import InventoryBulkActions from '~/components/dashboard/inventory/InventoryBulkActions.vue'
import StockAdjustmentDialog from '~/components/dashboard/inventory/StockAdjustmentDialog.vue'

const store = useInventoryStore()

useHead({
  title: 'المخزون | لوحة التحكم'
})

onMounted(() => {
  store.fetchInventory()
})
</script>
