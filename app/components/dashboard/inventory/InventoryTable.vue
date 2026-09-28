<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm text-right">
      <thead class="text-xs text-muted bg-surface-50 dark:bg-surface-dark-hover border-b border-border-light dark:border-border-dark">
        <tr>
          <th scope="col" class="p-4 w-12">
            <input 
              type="checkbox"
              class="w-4 h-4 rounded border-border-light text-primary focus:ring-primary"
              :checked="store.selectedItems.length > 0 && store.selectedItems.length === store.filteredItems.length"
              :indeterminate="store.selectedItems.length > 0 && store.selectedItems.length < store.filteredItems.length"
              @change="store.selectAll($event.target.checked)"
            />
          </th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">المنتج</th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">SKU</th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">المخزون</th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">محجوز</th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">متاح</th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">إعادة الطلب</th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">الحالة</th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">تاريخ التحديث</th>
          <th scope="col" class="px-4 py-3 font-bold w-16"></th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="item in store.filteredItems" 
          :key="item.id"
          class="border-b border-border-light dark:border-border-dark hover:bg-surface-50 dark:hover:bg-surface-dark-hover transition-colors"
          :class="{'bg-primary/5 dark:bg-primary/10': store.selectedItems.includes(item.id)}"
        >
          <td class="p-4">
            <input 
              type="checkbox"
              class="w-4 h-4 rounded border-border-light text-primary focus:ring-primary"
              :checked="store.selectedItems.includes(item.id)"
              @change="store.toggleSelection(item.id)"
            />
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark flex items-center justify-center shrink-0 overflow-hidden">
                <img v-if="item.productImage" :src="item.productImage" :alt="item.productName" class="w-full h-full object-cover">
                <Icon v-else name="ph:image" class="w-5 h-5 text-muted" />
              </div>
              <div>
                <NuxtLink :to="`/dashboard/products/${item.productId}`" class="font-bold text-primary-navy dark:text-white hover:text-primary transition-colors">
                  {{ item.productName }}
                </NuxtLink>
                <div v-if="item.variant" class="text-xs text-muted mt-0.5">{{ item.variant.name }}</div>
              </div>
            </div>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-primary-navy dark:text-white font-mono text-xs rounded">{{ item.sku }}</span>
              <button 
                @click="copy(item.sku)"
                class="text-muted hover:text-primary transition-colors"
                title="نسخ SKU"
              >
                <Icon name="ph:copy" class="w-4 h-4" />
              </button>
            </div>
          </td>
          <td class="px-4 py-3 font-bold text-primary-navy dark:text-white">{{ item.currentStock }}</td>
          <td class="px-4 py-3 text-muted">{{ item.reservedStock }}</td>
          <td class="px-4 py-3 font-bold text-success">{{ item.availableStock }}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-1.5">
              <span class="font-medium text-primary-navy dark:text-white">{{ item.reorderLevel }}</span>
              <Icon v-if="item.currentStock <= item.reorderLevel" name="ph:warning-circle-fill" class="w-4 h-4 text-warning" title="تجاوز حد إعادة الطلب" />
            </div>
          </td>
          <td class="px-4 py-3">
             <InventoryStatusBadge :status="item.status" />
          </td>
          <td class="px-4 py-3 text-xs text-muted whitespace-nowrap">
            {{ formatDate(item.updatedAt) }}
          </td>
          <td class="px-4 py-3 text-left">
            <InventoryActions :item="item" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useInventoryStore } from '~/stores/inventory'
import InventoryStatusBadge from './InventoryStatusBadge.vue'
import InventoryActions from './InventoryActions.vue'

const store = useInventoryStore()

const copy = (text: string) => {
  navigator.clipboard.writeText(text)
  alert('تم نسخ SKU: ' + text)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ar-EG', { 
    day: '2-digit', month: 'short', year: 'numeric', 
    hour: 'numeric', minute: '2-digit' 
  }).format(date)
}
</script>
