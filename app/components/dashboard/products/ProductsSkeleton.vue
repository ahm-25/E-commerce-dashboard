<template>
  <div class="w-full">
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-right">
        <thead>
          <tr class="border-b border-border-light dark:border-border-dark">
            <th class="py-4 px-4 w-12">
              <div class="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse m-auto"></div>
            </th>
            <th class="py-4 px-4"><div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
            <th class="py-4 px-4"><div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-light dark:divide-border-dark">
          <tr v-for="i in 5" :key="i">
            <td class="py-3 px-4">
              <div class="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse m-auto"></div>
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0"></div>
                <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </td>
            <td class="py-3 px-4"><div class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
            <td class="py-3 px-4"><div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
            <td class="py-3 px-4"><div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
            <td class="py-3 px-4"><div class="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
            <td class="py-3 px-4"><div class="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
            <td class="py-3 px-4"><div class="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></td>
            <td class="py-3 px-4">
              <div class="flex items-center justify-end gap-2">
                <div class="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
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
      <div v-for="i in 3" :key="i" class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 animate-pulse">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0"></div>
          <div class="flex flex-col gap-2 flex-1 pt-1">
            <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <div class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div class="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
