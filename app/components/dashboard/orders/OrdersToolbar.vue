<template>
  <div class="p-4 border-b border-border-light dark:border-border-dark flex flex-col xl:flex-row xl:items-center justify-between gap-4">
    <!-- View Toggle & Sort -->
    <div class="flex items-center gap-3 order-3 xl:order-1">
      <div class="relative group hidden sm:block">
        <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon name="ph:sort-ascending-bold" class="w-4 h-4 text-muted" />
          {{ store.sortBy }}
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        
        <div class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
          <div class="p-1 flex flex-col">
            <button v-for="option in sortOptions" :key="option" @click="store.sortBy = option" class="text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" :class="{ 'bg-primary/5 text-primary': store.sortBy === option }">
              {{ option }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 overflow-x-auto pb-1 xl:pb-0 order-2 flex-1 xl:justify-center">
      <!-- حالة الطلب -->
      <div class="relative group shrink-0">
        <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon name="ph:clock-bold" class="w-4 h-4 text-muted" />
          حالة الطلب
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        <div class="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
          <div class="p-1 flex flex-col">
            <button v-for="option in ['الكل', 'جديد', 'قيد المراجعة', 'قيد التجهيز', 'تم الشحن', 'تم التسليم', 'مكتمل', 'ملغي', 'مسترجع']" :key="option" @click="store.selectedStatus = option" class="text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" :class="{ 'bg-primary/5 text-primary': store.selectedStatus === option }">
              {{ option }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- حالة الدفع -->
      <div class="relative group shrink-0">
        <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon name="ph:currency-dollar-simple-bold" class="w-4 h-4 text-muted" />
          حالة الدفع
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        <div class="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
          <div class="p-1 flex flex-col">
            <button v-for="option in ['الكل', 'مدفوع', 'قيد الانتظار', 'فشل', 'مسترد']" :key="option" @click="store.selectedPaymentStatus = option" class="text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" :class="{ 'bg-primary/5 text-primary': store.selectedPaymentStatus === option }">
              {{ option }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- طريقة الدفع -->
      <div class="relative group shrink-0 hidden sm:block">
        <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon name="ph:credit-card-bold" class="w-4 h-4 text-muted" />
          طريقة الدفع
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        <div class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
          <div class="p-1 flex flex-col">
            <button v-for="option in ['الكل', 'الدفع عند الاستلام', 'بطاقة بنكية', 'محفظة إلكترونية', 'Online Payment']" :key="option" @click="store.selectedPaymentMethod = option" class="text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" :class="{ 'bg-primary/5 text-primary': store.selectedPaymentMethod === option }">
              {{ option }}
            </button>
          </div>
        </div>
      </div>

      <!-- التاريخ -->
      <div class="relative group shrink-0 hidden md:block">
        <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon name="ph:calendar-blank-bold" class="w-4 h-4 text-muted" />
          التاريخ
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        <div class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
          <div class="p-1 flex flex-col">
            <button v-for="option in ['الكل', 'اليوم', 'آخر 7 أيام', 'آخر 30 يوم', 'هذا الشهر', 'الشهر السابق']" :key="option" @click="store.selectedDateRange = option" class="text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" :class="{ 'bg-primary/5 text-primary': store.selectedDateRange === option }">
              {{ option }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- قيمة الطلب -->
      <div class="relative group shrink-0 hidden lg:block">
        <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon name="ph:wallet-bold" class="w-4 h-4 text-muted" />
          قيمة الطلب
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        <div class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
          <div class="p-1 flex flex-col">
             <button v-for="option in priceOptions" :key="option" @click="store.selectedTotalValue = option" class="text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" :class="{ 'bg-primary/5 text-primary': store.selectedTotalValue === option }">
              {{ option }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="relative w-full xl:w-80 shrink-0 order-1 xl:order-3">
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <Icon name="ph:magnifying-glass-bold" class="w-4 h-4 text-muted" />
      </div>
      <input 
        type="text" 
        v-model="store.searchQuery"
        class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pr-9 p-2.5 font-semibold placeholder:font-medium placeholder:text-muted/70 transition-colors" 
        placeholder="ابحث برقم الطلب أو اسم العميل أو البريد الإلكتروني..." 
      >
      <button v-if="store.searchQuery" @click="store.searchQuery = ''" class="absolute inset-y-0 left-0 flex items-center pl-3 text-muted hover:text-danger transition-colors">
        <Icon name="ph:x-circle-bold" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrdersStore } from '~/stores/orders'

const store = useOrdersStore()

const sortOptions = [
  'الأحدث',
  'الأقدم',
  'الأعلى قيمة',
  'الأقل قيمة',
  'آخر تحديث'
]

const priceOptions = [
  'الكل',
  'أقل من 500 ج.م',
  '500 – 1,000 ج.م',
  '1,000 – 5,000 ج.م',
  'أكثر من 5,000 ج.م'
]
</script>
