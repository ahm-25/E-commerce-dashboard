<template>
  <div class="flex items-center justify-end gap-2">
    <button @click="store.actionTarget = item; store.isAdjustmentDialogOpen = true" class="w-8 h-8 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors" title="تعديل المخزون">
      <Icon name="ph:plus-minus-bold" class="w-4 h-4" />
    </button>
    <NuxtLink :to="`/dashboard/products/${item.productId}`" class="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="عرض المنتج">
      <Icon name="ph:eye" class="w-4 h-4" />
    </NuxtLink>
    <button class="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="سجل الحركة">
      <Icon name="ph:clock-counter-clockwise" class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useInventoryStore, type InventoryItem } from '~/stores/inventory'

defineProps<{
  item: InventoryItem
}>()

const store = useInventoryStore()
</script>
