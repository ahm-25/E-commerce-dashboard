<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm text-right">
      <thead class="text-xs text-text-muted dark:text-text-muted-dark bg-surface-50 dark:bg-surface-dark-hover border-b border-border-light dark:border-border-dark">
        <tr>
          <th scope="col" class="p-4 w-12"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-4 rounded"></div></th>
          <th scope="col" class="px-4 py-3"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-16"></div></th>
          <th scope="col" class="px-4 py-3"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-16"></div></th>
          <th scope="col" class="px-4 py-3"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-16"></div></th>
          <th scope="col" class="px-4 py-3"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-16"></div></th>
          <th scope="col" class="px-4 py-3"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-20"></div></th>
          <th scope="col" class="px-4 py-3"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-24"></div></th>
          <th scope="col" class="px-4 py-3"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-24"></div></th>
          <th scope="col" class="px-4 py-3"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-12"></div></th>
          <th scope="col" class="px-4 py-3 w-16"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 5" :key="i" class="border-b border-border-light dark:border-border-dark">
          <td class="p-4"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-4 rounded"></div></td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-10 w-10 rounded-lg shrink-0"></div>
              <div class="space-y-2">
                <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-24"></div>
                <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-3 w-16"></div>
              </div>
            </div>
          </td>
          <td class="px-4 py-3"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-6 w-20 rounded-md"></div></td>
          <td class="px-4 py-3"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-6 w-16 rounded-md"></div></td>
          <td class="px-4 py-3"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-12"></div></td>
          <td class="px-4 py-3"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-20"></div></td>
          <td class="px-4 py-3"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-2 w-full max-w-[100px] rounded-full"></div></td>
          <td class="px-4 py-3 space-y-1">
            <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-3 w-20"></div>
            <div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-3 w-20"></div>
          </td>
          <td class="px-4 py-3"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-6 w-16 rounded-md"></div></td>
          <td class="px-4 py-3 text-left"><div class="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-8 w-8 rounded-md"></div></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
