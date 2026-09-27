<template>
  <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
    <!-- إجمالي الطلبات -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2 relative overflow-hidden">
      <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center absolute top-4 left-4">
        <Icon name="ph:shopping-bag-bold" class="w-5 h-5" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">إجمالي الطلبات</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.totalOrders.toLocaleString('ar-EG') }}</div>
        <div class="text-xs font-bold mt-2 text-success flex items-center gap-1">
          <Icon name="ph:trend-up-bold" class="w-3 h-3" />
          +14.7%
        </div>
      </div>
    </div>
    
    <!-- طلبات جديدة -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2 relative overflow-hidden">
      <div class="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center absolute top-4 left-4">
        <Icon name="ph:file-text-bold" class="w-5 h-5" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">طلبات جديدة</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.newCount.toLocaleString('ar-EG') }}</div>
        <div class="text-xs font-bold mt-2 text-success flex items-center gap-1">
          <Icon name="ph:trend-up-bold" class="w-3 h-3" />
          +23.1%
        </div>
      </div>
    </div>
    
    <!-- قيد التنفيذ -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2 relative overflow-hidden">
      <div class="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center absolute top-4 left-4">
        <Icon name="ph:truck-bold" class="w-5 h-5" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">قيد التنفيذ</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.processingCount.toLocaleString('ar-EG') }}</div>
        <div class="text-xs font-bold mt-2 text-success flex items-center gap-1">
          <Icon name="ph:trend-up-bold" class="w-3 h-3" />
          +8.3%
        </div>
      </div>
    </div>
    
    <!-- تم التسليم -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2 relative overflow-hidden">
      <div class="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center absolute top-4 left-4">
        <Icon name="ph:check-circle-bold" class="w-5 h-5" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">تم التسليم</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.deliveredCount.toLocaleString('ar-EG') }}</div>
        <div class="text-xs font-bold mt-2 text-success flex items-center gap-1">
          <Icon name="ph:trend-up-bold" class="w-3 h-3" />
          +12.5%
        </div>
      </div>
    </div>

    <!-- ملغاة -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2 relative overflow-hidden">
      <div class="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center absolute top-4 left-4">
        <Icon name="ph:x-circle-bold" class="w-5 h-5" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">ملغاة</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.cancelledCount.toLocaleString('ar-EG') }}</div>
        <div class="text-xs font-bold mt-2 text-danger flex items-center gap-1">
          <Icon name="ph:trend-down-bold" class="w-3 h-3" />
          -5.2%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrdersStore } from '~/stores/orders'

const store = useOrdersStore()
</script>
