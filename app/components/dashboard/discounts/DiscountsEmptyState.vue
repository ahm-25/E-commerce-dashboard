<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div class="w-16 h-16 bg-surface-50 dark:bg-surface-dark-hover rounded-full flex items-center justify-center text-text-muted dark:text-text-muted-dark mb-4">
      <UIcon name="i-heroicons-ticket" class="w-8 h-8" />
    </div>
    <h3 class="text-lg font-bold text-text dark:text-text-dark mb-2">لا توجد عروض أو خصومات</h3>
    <p class="text-sm text-text-muted dark:text-text-muted-dark max-w-sm mb-6">
      أنشئ أول خصم أو كوبون لبدء تقديم عروض لعملائك.
    </p>
    <UButton
      color="primary"
      variant="solid"
      icon="i-heroicons-plus"
      to="/dashboard/discounts/create"
    >
      إنشاء خصم
    </UButton>
  </div>
</template>
