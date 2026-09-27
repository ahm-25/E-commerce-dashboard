<template>
  <div class="w-full">
    <!-- Desktop Skeleton -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-right">
        <thead>
          <tr class="border-b border-border-light dark:border-border-dark">
            <th class="py-4 px-4 w-12">
              <div class="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse m-auto"></div>
            </th>
            <th class="py-4 px-4"><div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-auto"></div></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-light dark:divide-border-dark">
          <tr v-for="i in 5" :key="i">
            <td class="py-4 px-4">
              <div class="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse m-auto"></div>
            </td>
            <td class="py-4 px-4"><div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
            <td class="py-4 px-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0"></div>
                <div class="flex flex-col gap-1.5">
                  <div class="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div class="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </td>
            <td class="py-4 px-4">
              <div class="flex -space-x-2 rtl:space-x-reverse">
                <div class="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse border border-white dark:border-surface-dark z-10"></div>
                <div class="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse border border-white dark:border-surface-dark z-0"></div>
              </div>
            </td>
            <td class="py-4 px-4"><div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
            <td class="py-4 px-4"><div class="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mx-auto"></div></td>
            <td class="py-4 px-4"><div class="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mx-auto"></div></td>
            <td class="py-4 px-4"><div class="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
            <td class="py-4 px-4"><div class="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
            <td class="py-4 px-4">
              <div class="flex items-center justify-end gap-2">
                <div class="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div class="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Mobile Skeleton -->
    <div class="md:hidden flex flex-col gap-4">
      <div v-for="i in 3" :key="i" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 animate-pulse">
        <div class="flex items-center justify-between mb-4">
          <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
        <div class="flex items-center gap-3 mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
          <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>
          <div class="flex flex-col gap-2 flex-1">
            <div class="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div class="flex justify-between items-center mb-4">
          <div class="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div class="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
