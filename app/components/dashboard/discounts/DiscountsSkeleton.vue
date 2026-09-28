<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm text-right">
      <thead class="text-xs text-text-muted dark:text-text-muted-dark bg-surface-50 dark:bg-surface-dark-hover border-b border-border-light dark:border-border-dark">
        <tr>
          <th scope="col" class="p-4 w-12"><USkeleton class="h-4 w-4 rounded" /></th>
          <th scope="col" class="px-4 py-3"><USkeleton class="h-4 w-16" /></th>
          <th scope="col" class="px-4 py-3"><USkeleton class="h-4 w-16" /></th>
          <th scope="col" class="px-4 py-3"><USkeleton class="h-4 w-16" /></th>
          <th scope="col" class="px-4 py-3"><USkeleton class="h-4 w-16" /></th>
          <th scope="col" class="px-4 py-3"><USkeleton class="h-4 w-20" /></th>
          <th scope="col" class="px-4 py-3"><USkeleton class="h-4 w-24" /></th>
          <th scope="col" class="px-4 py-3"><USkeleton class="h-4 w-24" /></th>
          <th scope="col" class="px-4 py-3"><USkeleton class="h-4 w-12" /></th>
          <th scope="col" class="px-4 py-3 w-16"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 5" :key="i" class="border-b border-border-light dark:border-border-dark">
          <td class="p-4"><USkeleton class="h-4 w-4 rounded" /></td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <USkeleton class="h-10 w-10 rounded-lg shrink-0" />
              <div class="space-y-2">
                <USkeleton class="h-4 w-24" />
                <USkeleton class="h-3 w-16" />
              </div>
            </div>
          </td>
          <td class="px-4 py-3"><USkeleton class="h-6 w-20 rounded-md" /></td>
          <td class="px-4 py-3"><USkeleton class="h-6 w-16 rounded-md" /></td>
          <td class="px-4 py-3"><USkeleton class="h-4 w-12" /></td>
          <td class="px-4 py-3"><USkeleton class="h-4 w-20" /></td>
          <td class="px-4 py-3"><USkeleton class="h-2 w-full max-w-[100px] rounded-full" /></td>
          <td class="px-4 py-3 space-y-1">
            <USkeleton class="h-3 w-20" />
            <USkeleton class="h-3 w-20" />
          </td>
          <td class="px-4 py-3"><USkeleton class="h-6 w-16 rounded-md" /></td>
          <td class="px-4 py-3 text-left"><USkeleton class="h-8 w-8 rounded-md" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
