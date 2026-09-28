<template>
  <div class="p-4 border-b border-border-light dark:border-border-dark flex flex-col xl:flex-row xl:items-center justify-between gap-4">
    <!-- View Toggle & Sort -->
    <div class="flex items-center gap-3 order-3 xl:order-1">
      <div class="relative group hidden sm:block" ref="sortDropdownRef">
        <button 
          @click="isSortOpen = !isSortOpen"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon name="ph:sort-ascending-bold" class="w-4 h-4 text-muted" />
          {{ sortBy }}
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        
        <div 
          v-if="isSortOpen"
          class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg transition-all z-20 overflow-hidden"
        >
          <div class="p-1 flex flex-col">
            <button v-for="option in sortOptions" :key="option" @click="sortBy = option; isSortOpen = false" class="text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" :class="{ 'bg-primary/5 text-primary': sortBy === option }">
              {{ option }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 overflow-x-auto pb-1 xl:pb-0 order-2 flex-1 xl:justify-center">
      <!-- حالة العميل -->
      <div class="relative shrink-0" ref="statusDropdownRef">
        <button @click="isStatusOpen = !isStatusOpen" class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon name="ph:user-circle-bold" class="w-4 h-4 text-muted" />
          حالة العميل
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        <div v-if="isStatusOpen" class="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg transition-all z-20 overflow-hidden">
          <div class="p-2 flex flex-col gap-1">
            <label v-for="option in statusOptions" :key="option.value" class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <input type="checkbox" :checked="store.selectedStatuses.includes(option.value)" @change="store.toggleStatusFilter(option.value)" class="rounded border-gray-300 text-primary focus:ring-primary" />
              <span class="text-sm">{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- نوع العميل -->
      <div class="relative shrink-0" ref="typeDropdownRef">
        <button @click="isTypeOpen = !isTypeOpen" class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon name="ph:star-bold" class="w-4 h-4 text-muted" />
          نوع العميل
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        <div v-if="isTypeOpen" class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg transition-all z-20 overflow-hidden">
          <div class="p-2 flex flex-col gap-1">
            <label v-for="option in typeOptions" :key="option.value" class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <input type="checkbox" :checked="store.selectedTypes.includes(option.value)" @change="store.toggleTypeFilter(option.value)" class="rounded border-gray-300 text-primary focus:ring-primary" />
              <span class="text-sm">{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- تاريخ التسجيل -->
      <div class="relative shrink-0" ref="dateDropdownRef">
        <button @click="isDateOpen = !isDateOpen" class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Icon name="ph:calendar-blank-bold" class="w-4 h-4 text-muted" />
          تاريخ التسجيل
          <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted" />
        </button>
        <div v-if="isDateOpen" class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-lg transition-all z-20 overflow-hidden">
          <div class="p-1 flex flex-col">
            <button v-for="option in ['اليوم', 'آخر 7 أيام', 'آخر 30 يوم', 'هذا الشهر', 'تاريخ مخصص']" :key="option" @click="store.selectedDateRange = option; isDateOpen = false" class="text-right px-3 py-2 rounded-lg text-sm font-semibold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" :class="{ 'bg-primary/5 text-primary': store.selectedDateRange === option }">
              {{ option }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="relative order-1 xl:order-3 w-full xl:w-80">
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <Icon name="ph:magnifying-glass-bold" class="w-5 h-5 text-muted" />
      </div>
      <input 
        type="text" 
        v-model="searchInput"
        @input="handleSearch"
        class="bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pr-10 p-2.5 transition-colors font-medium placeholder:font-normal" 
        placeholder="ابحث باسم العميل، البريد، أو الهاتف..."
      >
      <button 
        v-if="searchInput"
        @click="clearSearch"
        class="absolute inset-y-0 left-0 flex items-center pl-3 text-muted hover:text-primary-navy dark:hover:text-white transition-colors"
      >
        <Icon name="ph:x-circle-fill" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCustomersStore } from '~/stores/customers'

const store = useCustomersStore()
const searchInput = ref(store.searchQuery)
let searchTimeout: any = null

const sortOptions = ['الأحدث تسجيلًا', 'الأقدم تسجيلًا', 'الأكثر إنفاقًا', 'الأقل إنفاقًا', 'الأكثر طلبات', 'الاسم']
const sortBy = ref('الأحدث تسجيلًا')

const statusOptions = [
  { label: 'نشط', value: 'active' },
  { label: 'غير نشط', value: 'inactive' },
  { label: 'محظور', value: 'blocked' }
]

const typeOptions = [
  { label: 'جديد', value: 'new' },
  { label: 'عميل متكرر', value: 'returning' },
  { label: 'VIP', value: 'vip' }
]

const isSortOpen = ref(false)
const isStatusOpen = ref(false)
const isTypeOpen = ref(false)
const isDateOpen = ref(false)

const sortDropdownRef = ref<HTMLElement | null>(null)
const statusDropdownRef = ref<HTMLElement | null>(null)
const typeDropdownRef = ref<HTMLElement | null>(null)
const dateDropdownRef = ref<HTMLElement | null>(null)

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    store.setSearchQuery(searchInput.value)
  }, 300)
}

const clearSearch = () => {
  searchInput.value = ''
  store.setSearchQuery('')
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  
  if (sortDropdownRef.value && !sortDropdownRef.value.contains(target)) isSortOpen.value = false
  if (statusDropdownRef.value && !statusDropdownRef.value.contains(target)) isStatusOpen.value = false
  if (typeDropdownRef.value && !typeDropdownRef.value.contains(target)) isTypeOpen.value = false
  if (dateDropdownRef.value && !dateDropdownRef.value.contains(target)) isDateOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
