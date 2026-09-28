<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    <!-- Total Discounts -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <Icon name="ph:tag" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">إجمالي الخصومات</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.totalDiscounts }}</div>
      </div>
    </div>
    
    <!-- Active Discounts -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center">
        <Icon name="ph:check-circle" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">الخصومات النشطة</div>
        <div class="text-2xl font-black text-success font-ibm">{{ store.activeDiscounts }}</div>
      </div>
    </div>
    
    <!-- Scheduled -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-info/10 text-info flex items-center justify-center">
        <Icon name="ph:calendar-blank" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">المجدولة</div>
        <div class="text-2xl font-black text-info font-ibm">{{ store.scheduledDiscounts }}</div>
      </div>
    </div>
    
    <!-- Expired -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-gray-500/10 text-gray-500 flex items-center justify-center">
        <Icon name="ph:x-circle" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">المنتهية</div>
        <div class="text-2xl font-black text-gray-500 font-ibm">{{ store.expiredDiscounts }}</div>
      </div>
    </div>
    
    <!-- Total Uses -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
        <Icon name="ph:users" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">إجمالي الاستخدامات</div>
        <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ store.totalUses.toLocaleString() }}</div>
      </div>
    </div>
    
    <!-- Discount Value -->
    <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <Icon name="ph:currency-circle-dollar" class="w-4 h-4" />
      </div>
      <div>
        <div class="text-sm text-muted font-bold mb-1">قيمة الخصومات</div>
        <div class="text-2xl font-black text-primary font-ibm">{{ store.totalValue.toLocaleString() }} ج.م</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDiscountsStore } from '~/stores/discounts'
const store = useDiscountsStore()
</script>
