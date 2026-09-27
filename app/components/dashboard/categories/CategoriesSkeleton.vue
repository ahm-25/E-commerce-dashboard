<template>
  <div class="flex flex-col gap-4">
    <div v-for="i in 5" :key="i" class="flex items-center gap-4 py-3 animate-pulse">
      <div class="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
      <div class="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      <div class="flex-1">
        <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-2"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/6"></div>
      </div>
      <div class="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-full hidden sm:block"></div>
      <div class="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded hidden md:block"></div>
      <div class="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
    </div>
  </div>
</template>
