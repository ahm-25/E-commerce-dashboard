<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="p-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm transition-all hover:shadow-md">
      <div class="flex items-center justify-between mb-1">
        <div class="text-sm text-gray-500 font-medium">طرق الدفع النشطة</div>
        <div class="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
          <Icon name="heroicons:credit-card" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ store.paymentMethods.filter(m => m.status === 'active').length }}
      </div>
    </div>
    
    <div class="p-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm transition-all hover:shadow-md">
      <div class="flex items-center justify-between mb-1">
        <div class="text-sm text-gray-500 font-medium">بوابات الدفع المتصلة</div>
        <div class="p-1.5 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
          <Icon name="heroicons:link" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-bold text-green-600">
        {{ store.paymentGateways.filter(g => g.status === 'connected').length }}
      </div>
    </div>
    
    <div class="p-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm transition-all hover:shadow-md">
      <div class="flex items-center justify-between mb-1">
        <div class="text-sm text-gray-500 font-medium">الدفع عند الاستلام</div>
        <div class="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
          <Icon name="heroicons:truck" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-bold text-gray-700 dark:text-gray-300">
        {{ store.paymentMethods.find(m => m.type === 'cod')?.status === 'active' ? 'مفعل' : 'غير مفعل' }}
      </div>
    </div>
    
    <div class="p-4 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm transition-all hover:shadow-md">
      <div class="flex items-center justify-between mb-1">
        <div class="text-sm text-gray-500 font-medium">تحتاج إلى إعداد</div>
        <div class="p-1.5 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
          <Icon name="heroicons:exclamation-triangle" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-bold text-amber-600">
        {{ store.paymentMethods.filter(m => m.status === 'setup_required').length + store.paymentGateways.filter(g => g.status === 'setup_required').length }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePaymentsStore } from '~/stores/payments'

const store = usePaymentsStore()
</script>
