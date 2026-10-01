<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div class="w-16 h-16 bg-surface-50 dark:bg-surface-dark-hover rounded-full flex items-center justify-center text-text-muted dark:text-text-muted-dark mb-4">
      <Icon name="ph:ticket" class="w-8 h-8" />
    </div>
    <h3 class="text-lg font-bold text-text dark:text-text-dark mb-2">لا توجد عروض أو خصومات</h3>
    <p class="text-sm text-text-muted dark:text-text-muted-dark max-w-sm mb-6">
      أنشئ أول خصم أو كوبون لبدء تقديم عروض لعملائك.
    </p>
    <NuxtLink to="/dashboard/discounts/create" class="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm">
      <Icon name="ph:plus-bold" class="w-4 h-4" />
      إنشاء خصم
    </NuxtLink>
  </div>
</template>
