<template>
  <div class="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
    <!-- Search -->
    <div class="relative w-full md:w-96">
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted dark:text-text-muted-dark">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input 
        v-model="searchInput"
        type="text" 
        class="form-input w-full pr-10 bg-surface-alt dark:bg-surface-dark-alt border-none focus:ring-1 focus:ring-primary rounded-lg py-2"
        placeholder="ابحث باسم العميل، المنتج أو محتوى التقييم..."
        @input="onSearchInput"
      >
      <button 
        v-if="searchInput"
        @click="clearSearch"
        class="absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted hover:text-text-strong dark:text-text-muted-dark dark:hover:text-text-strong-dark"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Filters & Sort -->
    <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
      
      <!-- Sort -->
      <div class="relative">
        <select 
          v-model="store.sortBy"
          class="form-select pl-8 pr-10 py-2 rounded-lg bg-surface-alt dark:bg-surface-dark-alt border-none text-sm focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
        >
          <option value="newest">الأحدث</option>
          <option value="oldest">الأقدم</option>
          <option value="highest">أعلى تقييم</option>
          <option value="lowest">أقل تقييم</option>
          <option value="unanswered">بدون رد</option>
        </select>
        <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-text-muted dark:text-text-muted-dark">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
        </div>
        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted dark:text-text-muted-dark">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Filter Dropdown Trigger -->
      <button 
        @click="isFilterMenuOpen = !isFilterMenuOpen"
        class="btn btn-secondary py-2 flex items-center gap-2 relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        فلاتر
        <span v-if="store.hasActiveFilters" class="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-surface dark:border-surface-dark"></span>
      </button>

      <!-- Filter Menu -->
      <div 
        v-if="isFilterMenuOpen"
        class="absolute top-full left-4 mt-2 w-72 bg-surface dark:bg-surface-dark-alt border border-border-light dark:border-border-dark rounded-xl shadow-lg z-50 overflow-hidden"
      >
        <div class="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
          <h4 class="font-medium text-text-strong dark:text-text-strong-dark">تصفية التقييمات</h4>
          <button @click="store.clearFilters" class="text-xs text-primary hover:underline">مسح الكل</button>
        </div>
        
        <div class="p-4 max-h-96 overflow-y-auto space-y-6">
          <!-- Rating -->
          <div>
            <h5 class="text-xs font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wider mb-3">التقييم</h5>
            <div class="space-y-2">
              <label v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  class="form-checkbox h-4 w-4 text-primary rounded border-border-light dark:border-border-dark bg-surface-alt dark:bg-surface-dark"
                  :checked="store.selectedRatings.includes(rating)"
                  @change="store.toggleRatingFilter(rating)"
                >
                <div class="flex items-center gap-1 text-sm text-text-regular dark:text-text-regular-dark">
                  <span>{{ rating }} نجوم</span>
                  <div class="flex items-center text-warning mb-0.5">
                    <svg v-for="i in rating" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          <!-- Status -->
          <div v-if="store.currentTab === 'all'">
            <h5 class="text-xs font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wider mb-3">الحالة</h5>
            <div class="space-y-2">
              <label v-for="status in [{id:'pending', label:'قيد المراجعة'}, {id:'approved', label:'معتمد'}, {id:'hidden', label:'مخفي'}, {id:'rejected', label:'مرفوض'}]" :key="status.id" class="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  class="form-checkbox h-4 w-4 text-primary rounded border-border-light dark:border-border-dark bg-surface-alt dark:bg-surface-dark"
                  :checked="store.selectedStatuses.includes(status.id)"
                  @change="store.toggleStatusFilter(status.id)"
                >
                <span class="text-sm text-text-regular dark:text-text-regular-dark">{{ status.label }}</span>
              </label>
            </div>
          </div>
          
          <!-- Has Media -->
          <div>
            <h5 class="text-xs font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wider mb-3">المحتوى</h5>
            <label class="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                class="form-checkbox h-4 w-4 text-primary rounded border-border-light dark:border-border-dark bg-surface-alt dark:bg-surface-dark"
                v-model="store.hasMediaOnly"
              >
              <span class="text-sm text-text-regular dark:text-text-regular-dark">يحتوي على صور/مرفقات فقط</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Backdrop for filter menu -->
      <div 
        v-if="isFilterMenuOpen" 
        @click="isFilterMenuOpen = false"
        class="fixed inset-0 z-40"
      ></div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useReviewsStore } from '~/stores/reviews'

const store = useReviewsStore()
const searchInput = ref(store.searchQuery)
const isFilterMenuOpen = ref(false)

// Custom debounce function
let timeout: NodeJS.Timeout
const updateSearch = (val: string) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    store.setSearchQuery(val)
  }, 300)
}

const onSearchInput = () => {
  updateSearch(searchInput.value)
}

const clearSearch = () => {
  searchInput.value = ''
  store.setSearchQuery('')
}

watch(() => store.searchQuery, (newVal) => {
  if (searchInput.value !== newVal) {
    searchInput.value = newVal
  }
})
</script>
