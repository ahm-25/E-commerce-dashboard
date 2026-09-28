<template>
  <div class="flex flex-col gap-6 w-full animate-pulse">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <div>
        <div class="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-2"></div>
        <div class="h-4 w-32 bg-gray-100 dark:bg-gray-800/50 rounded"></div>
      </div>
      <div class="flex gap-2">
        <div class="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        <div class="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      </div>
    </div>

    <!-- Stepper -->
    <div class="h-24 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6">
      <div class="flex justify-between items-center h-full">
        <div v-for="i in 5" :key="i" class="flex flex-col items-center gap-2">
          <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800"></div>
          <div class="w-20 h-3 bg-gray-100 dark:bg-gray-800/50 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="flex flex-col xl:flex-row gap-6">
      <!-- Content (Left side in RTL) -->
      <div class="flex-1 space-y-6">
        <!-- Items -->
        <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 h-64">
          <div class="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
          <div v-for="i in 2" :key="i" class="flex items-center gap-4 mb-4">
            <div class="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 w-1/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div class="h-3 w-1/4 bg-gray-100 dark:bg-gray-800/50 rounded"></div>
            </div>
          </div>
        </div>
        
        <!-- Pricing -->
        <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 h-48">
          <div class="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-6"></div>
          <div class="space-y-4">
            <div v-for="i in 3" :key="i" class="flex justify-between">
              <div class="h-4 w-20 bg-gray-100 dark:bg-gray-800/50 rounded"></div>
              <div class="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar (Right side in RTL) -->
      <div class="w-full xl:w-[380px] shrink-0 space-y-6">
        <!-- Customer -->
        <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 h-48">
          <div class="flex gap-4 mb-6">
            <div class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800"></div>
            <div class="space-y-2 flex-1 pt-2">
              <div class="h-5 w-1/2 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div class="h-4 w-3/4 bg-gray-100 dark:bg-gray-800/50 rounded"></div>
            </div>
          </div>
          <div class="flex gap-2">
            <div v-for="i in 4" :key="i" class="flex-1 h-16 bg-gray-100 dark:bg-gray-800/50 rounded-xl"></div>
          </div>
        </div>
        
        <!-- Payment -->
        <div class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 h-32">
          <div class="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
          <div class="space-y-3">
            <div class="h-4 w-full bg-gray-100 dark:bg-gray-800/50 rounded"></div>
            <div class="h-4 w-2/3 bg-gray-100 dark:bg-gray-800/50 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
