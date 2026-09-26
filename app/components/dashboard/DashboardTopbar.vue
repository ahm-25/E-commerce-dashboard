<template>
  <header class="h-[72px] bg-surface dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
    <div class="flex items-center gap-3 flex-1">
      <!-- Mobile menu button -->
      <button @click="$emit('toggle-mobile')" class="md:hidden p-1 text-muted hover:text-primary-navy dark:hover:text-white transition-colors">
        <Icon name="ph:list-bold" class="w-6 h-6" />
      </button>
      
      <!-- Right Side: EDIX Logo (mobile only) & Search -->
      <div class="flex items-center gap-4 w-full max-w-md">
        <span class="md:hidden font-black text-2xl text-primary-navy dark:text-white tracking-wider font-ibm">EDIX</span>
        
        <div class="hidden md:flex relative w-full text-muted group">
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Icon name="ph:magnifying-glass" class="w-4 h-4 group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="ابحث في لوحة التحكم..." 
            class="w-full bg-[#F3F4F6] dark:bg-gray-800/50 border-none rounded-lg py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:text-white transition-all placeholder:text-gray-400"
          >
        </div>
      </div>
    </div>

    <!-- Left Actions -->
    <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
      <!-- View Store -->
      <a href="#" target="_blank" class="hidden sm:flex items-center gap-2 text-sm font-bold bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-navy transition-colors shadow-sm shadow-primary/20">
        عرض المتجر
        <Icon name="ph:arrow-square-out-bold" class="w-4 h-4" />
      </a>

      <!-- Theme Switcher -->
      <button @click="toggleTheme" class="p-2 text-muted hover:text-primary-navy dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <Icon :name="isDark ? 'ph:moon-stars-bold' : 'ph:sun-bold'" class="w-5 h-5" />
      </button>

      <!-- Notifications -->
      <button class="relative p-2 text-muted hover:text-primary-navy dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <Icon name="ph:bell-bold" class="w-5 h-5" />
        <span class="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-surface dark:border-surface-dark"></span>
      </button>

      <!-- User Menu -->
      <div class="relative flex items-center gap-3 mr-1 sm:mr-2 border-r border-border-light dark:border-border-dark pr-3 sm:pr-4 cursor-pointer group">
        <div class="hidden lg:flex flex-col text-left items-end">
          <div class="font-bold text-primary-navy dark:text-white leading-none mb-1">أحمد محمد</div>
          <div class="text-[11px] text-muted font-bold">مدير المتجر</div>
        </div>
        <div class="w-10 h-10 rounded-full bg-primary-light dark:bg-primary-navy/50 flex items-center justify-center text-primary dark:text-primary font-bold text-sm border border-primary/10 overflow-hidden">
          <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" class="w-full h-full object-cover" />
        </div>
        <Icon name="ph:caret-down-bold" class="w-3 h-3 text-muted hidden lg:block group-hover:text-primary-navy dark:group-hover:text-white transition-colors" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineEmits(['toggle-mobile'])

const isDark = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>
