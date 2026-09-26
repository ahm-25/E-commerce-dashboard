<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-bold text-primary-navy dark:text-white font-ibm">أحدث الطلبات</h2>
      <NuxtLink to="/dashboard/orders" class="text-sm font-bold text-primary hover:text-primary-navy dark:hover:text-white transition-colors flex items-center gap-1">
        عرض الكل
        <Icon name="ph:caret-left-bold" class="w-3.5 h-3.5" />
      </NuxtLink>
    </div>
    
    <div class="overflow-x-auto flex-1">
      <table class="w-full text-sm text-right">
        <thead class="text-muted border-b border-border-light dark:border-border-dark text-xs uppercase tracking-wider">
          <tr>
            <th class="pb-3 font-semibold px-2">رقم الطلب</th>
            <th class="pb-3 font-semibold px-2">العميل</th>
            <th class="pb-3 font-semibold px-2">التاريخ</th>
            <th class="pb-3 font-semibold px-2">الإجمالي</th>
            <th class="pb-3 font-semibold px-2">الحالة</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-light dark:divide-border-dark">
          <tr v-for="order in orders" :key="order.id" class="group hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors">
            <td class="py-3.5 px-2 font-ibm text-primary-navy dark:text-white font-semibold group-hover:text-primary transition-colors cursor-pointer">#{{ order.id }}</td>
            <td class="py-3.5 px-2">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-primary-light dark:bg-primary-navy/50 flex items-center justify-center text-primary text-xs font-bold border border-primary/10">
                  {{ order.customer.charAt(0) }}
                </div>
                <span class="text-primary-navy dark:text-white font-semibold">{{ order.customer }}</span>
              </div>
            </td>
            <td class="py-3.5 px-2 text-muted font-medium">{{ order.date }}</td>
            <td class="py-3.5 px-2 text-primary-navy dark:text-white font-bold">{{ order.total.toLocaleString() }} ج.م</td>
            <td class="py-3.5 px-2">
              <span class="px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1.5" :class="statusClass(order.status)">
                <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(order.status)"></span>
                {{ order.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const orders = [
  { id: '10284', customer: 'أحمد محمد', date: '23 سبتمبر', total: 1250, status: 'مكتمل' },
  { id: '10283', customer: 'سارة علي', date: '22 سبتمبر', total: 890, status: 'قيد التنفيذ' },
  { id: '10282', customer: 'محمد أحمد', date: '20 سبتمبر', total: 2430, status: 'قيد الشحن' },
  { id: '10281', customer: 'نورا خالد', date: '18 سبتمبر', total: 560, status: 'مكتمل' },
  { id: '10280', customer: 'خالد سعيد', date: '15 سبتمبر', total: 1760, status: 'ملغي' },
]

const statusClass = (status: string) => {
  switch (status) {
    case 'مكتمل': return 'bg-success/10 text-success'
    case 'قيد التنفيذ': return 'bg-warning/10 text-warning'
    case 'قيد الشحن': return 'bg-primary/10 text-primary'
    case 'ملغي': return 'bg-danger/10 text-danger'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const statusDotClass = (status: string) => {
  switch (status) {
    case 'مكتمل': return 'bg-success'
    case 'قيد التنفيذ': return 'bg-warning'
    case 'قيد الشحن': return 'bg-primary'
    case 'ملغي': return 'bg-danger'
    default: return 'bg-gray-400'
  }
}
</script>
