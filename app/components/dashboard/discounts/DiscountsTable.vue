<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm text-right">
      <thead class="text-xs text-muted bg-surface-50 dark:bg-surface-dark-hover border-b border-border-light dark:border-border-dark">
        <tr>
          <th scope="col" class="p-4 w-12">
            <input 
              type="checkbox"
              class="w-4 h-4 rounded border-border-light text-primary focus:ring-primary"
              :checked="store.selectedDiscounts.length > 0 && store.selectedDiscounts.length === store.filteredDiscounts.length"
              :indeterminate="store.selectedDiscounts.length > 0 && store.selectedDiscounts.length < store.filteredDiscounts.length"
              @change="store.selectAll($event.target.checked)"
            />
          </th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">الخصم</th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">الكود</th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">النوع</th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">قيمة الخصم</th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">النطاق</th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">الاستخدام</th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">الفترة</th>
          <th scope="col" class="px-4 py-3 font-bold text-primary-navy dark:text-white">الحالة</th>
          <th scope="col" class="px-4 py-3 font-bold w-16"></th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="discount in store.filteredDiscounts" 
          :key="discount.id"
          class="border-b border-border-light dark:border-border-dark hover:bg-surface-50 dark:hover:bg-surface-dark-hover transition-colors"
          :class="{'bg-primary/5 dark:bg-primary/10': store.selectedDiscounts.includes(discount.id)}"
        >
          <td class="p-4">
            <input 
              type="checkbox"
              class="w-4 h-4 rounded border-border-light text-primary focus:ring-primary"
              :checked="store.selectedDiscounts.includes(discount.id)"
              @change="store.toggleDiscountSelection(discount.id)"
            />
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon name="ph:ticket" class="w-5 h-5" />
              </div>
              <div>
                <div class="font-bold text-primary-navy dark:text-white">{{ discount.name }}</div>
                <div class="text-xs text-muted">{{ discount.id }}</div>
              </div>
            </div>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-primary-navy dark:text-white font-mono text-xs rounded">{{ discount.code }}</span>
              <button 
                v-if="discount.method === 'coupon'"
                @click="copy(discount.code)"
                class="text-muted hover:text-primary transition-colors"
                title="نسخ الكود"
              >
                <Icon name="ph:copy" class="w-4 h-4" />
              </button>
            </div>
          </td>
          <td class="px-4 py-3">
             <DiscountTypeBadge :type="discount.type" :value="discount.value" />
          </td>
          <td class="px-4 py-3 font-medium text-primary-navy dark:text-white">
             <span v-if="discount.type === 'percentage'">{{ discount.value }}%</span>
             <span v-else-if="discount.type === 'fixed'">{{ discount.value }} ج.م</span>
             <span v-else>شحن مجاني</span>
          </td>
          <td class="px-4 py-3 text-muted">
             {{ formatScope(discount) }}
          </td>
          <td class="px-4 py-3">
             <DiscountUsageProgress :usage-count="discount.usageCount" :usage-limit="discount.usageLimit" />
          </td>
          <td class="px-4 py-3 text-xs text-muted whitespace-nowrap">
            <div>{{ formatDate(discount.startDate) }}</div>
            <div v-if="discount.endDate">- {{ formatDate(discount.endDate) }}</div>
            <div v-else class="text-gray-400">بدون تاريخ انتهاء</div>
          </td>
          <td class="px-4 py-3">
             <DiscountStatusBadge :status="discount.status" />
          </td>
          <td class="px-4 py-3 text-left">
            <DiscountActions :discount="discount" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useDiscountsStore, type Discount } from '~/stores/discounts'
import DiscountTypeBadge from './DiscountTypeBadge.vue'
import DiscountStatusBadge from './DiscountStatusBadge.vue'
import DiscountUsageProgress from './DiscountUsageProgress.vue'
import DiscountActions from './DiscountActions.vue'

const store = useDiscountsStore()

const copy = (code: string) => {
  navigator.clipboard.writeText(code)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ar-EG', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

const formatScope = (discount: Discount) => {
  if (discount.scope === 'all') return 'جميع المنتجات'
  if (discount.scope === 'products') return `${discount.selectedProducts?.length || 0} منتجات`
  if (discount.scope === 'categories') return `${discount.selectedCategories?.length || 0} أقسام`
  return discount.scope
}
</script>
