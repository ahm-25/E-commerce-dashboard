<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    <div class="bg-surface dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div class="text-muted text-sm font-bold">إجمالي العملاء</div>
        <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Icon name="ph:users-bold" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">8,420</div>
      <div class="text-xs text-muted flex items-center gap-1">
        <Icon name="ph:trend-up-bold" class="w-3 h-3 text-green-500" />
        <span class="text-green-500 font-bold">+12%</span>
        <span>منذ الشهر الماضي</span>
      </div>
    </div>
    
    <div class="bg-surface dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div class="text-muted text-sm font-bold">عملاء جدد</div>
        <div class="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
          <Icon name="ph:user-plus-bold" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">186</div>
      <div class="text-xs text-muted">
        <span>هذا الشهر</span>
      </div>
    </div>
    
    <div class="bg-surface dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div class="text-muted text-sm font-bold">العملاء النشطون</div>
        <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
          <Icon name="ph:user-circle-bold" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">6,840</div>
      <div class="text-xs text-muted">
        <span>آخر 30 يوم</span>
      </div>
    </div>
    
    <div class="bg-surface dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div class="text-muted text-sm font-bold">عملاء لديهم طلبات</div>
        <div class="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
          <Icon name="ph:shopping-bag-bold" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">5,920</div>
      <div class="text-xs text-muted">
        <span>إجمالي</span>
      </div>
    </div>
    
    <div class="bg-surface dark:bg-surface-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div class="text-muted text-sm font-bold">متوسط قيمة العميل</div>
        <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <Icon name="ph:currency-circle-dollar-bold" class="w-4 h-4" />
        </div>
      </div>
      <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">4,250 ج.م</div>
      <div class="text-xs text-muted flex items-center gap-1">
        <Icon name="ph:trend-up-bold" class="w-3 h-3 text-green-500" />
        <span class="text-green-500 font-bold">+5%</span>
        <span>منذ الشهر الماضي</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Real implementation would accept stats from the store or props
</script>
