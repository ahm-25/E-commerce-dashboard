<template>
  <div class="flex flex-col gap-4">
    <!-- Header skeleton hidden on mobile -->
    <div class="hidden md:grid grid-cols-[3rem_2fr_1fr_1fr_1fr_1.5fr_1fr_5rem] gap-4 py-4 px-4 border-b border-border-light dark:border-border-dark">
      <div v-for="i in 8" :key="`header-${i}`" class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
    
    <!-- Rows skeleton -->
    <div v-for="row in 5" :key="`row-${row}`" class="flex flex-col md:grid md:grid-cols-[3rem_2fr_1fr_1fr_1fr_1.5fr_1fr_5rem] gap-4 py-4 px-4 border-b border-border-light dark:border-border-dark">
      <!-- Checkbox -->
      <div class="hidden md:flex items-center justify-center">
        <div class="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      
      <!-- Customer Info -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse shrink-0"></div>
        <div class="flex flex-col gap-2 w-full">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
      
      <!-- Orders/Date/Total -->
      <div v-for="col in 5" :key="`col-${col}`" class="hidden md:flex flex-col justify-center gap-2">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" :class="{'mx-auto': col === 2 || col === 5}"></div>
        <div v-if="col === 4" class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
      </div>
      
      <!-- Actions -->
      <div class="hidden md:flex items-center justify-end gap-2">
        <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    </div>
  </div>
</template>
