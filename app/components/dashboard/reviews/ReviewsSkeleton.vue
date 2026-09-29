<template>
  <div class="animate-pulse space-y-4">
    <div v-for="i in 5" :key="i" class="flex flex-col md:flex-row gap-4 py-4 border-b border-border-light dark:border-border-dark last:border-0">
      <!-- Checkbox & Avatar -->
      <div class="flex items-center gap-3 w-48 shrink-0">
        <div class="h-4 w-4 bg-surface-alt dark:bg-surface-dark-alt rounded"></div>
        <div class="w-10 h-10 rounded-full bg-surface-alt dark:bg-surface-dark-alt"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 bg-surface-alt dark:bg-surface-dark-alt rounded w-24"></div>
          <div class="h-2 bg-surface-alt dark:bg-surface-dark-alt rounded w-32"></div>
        </div>
      </div>
      
      <!-- Product -->
      <div class="flex items-center gap-3 w-48 shrink-0">
        <div class="w-10 h-10 rounded-md bg-surface-alt dark:bg-surface-dark-alt"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 bg-surface-alt dark:bg-surface-dark-alt rounded w-28"></div>
          <div class="h-2 bg-surface-alt dark:bg-surface-dark-alt rounded w-20"></div>
        </div>
      </div>
      
      <!-- Content -->
      <div class="flex-1 space-y-2 py-1 min-w-[200px]">
        <div class="h-3 bg-surface-alt dark:bg-surface-dark-alt rounded w-16 mb-2"></div>
        <div class="h-2 bg-surface-alt dark:bg-surface-dark-alt rounded w-full"></div>
        <div class="h-2 bg-surface-alt dark:bg-surface-dark-alt rounded w-3/4"></div>
      </div>
      
      <!-- Status -->
      <div class="w-24 shrink-0 flex flex-col gap-2 py-1">
        <div class="h-5 bg-surface-alt dark:bg-surface-dark-alt rounded-full w-20"></div>
        <div class="h-5 bg-surface-alt dark:bg-surface-dark-alt rounded-full w-16"></div>
      </div>
      
      <!-- Date -->
      <div class="w-24 shrink-0 py-1">
        <div class="h-3 bg-surface-alt dark:bg-surface-dark-alt rounded w-20"></div>
      </div>
    </div>
  </div>
</template>
