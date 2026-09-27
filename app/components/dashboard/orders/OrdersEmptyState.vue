<template>
  <div class="flex flex-col items-center justify-center text-center py-12 px-4">
    <div class="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
      <Icon name="ph:shopping-bag-open-bold" class="w-10 h-10 text-primary opacity-80" />
    </div>
    
    <h3 class="text-xl font-bold text-primary-navy dark:text-white mb-2 font-ibm">
      لا توجد طلبات حتى الآن
    </h3>
    
    <p class="text-muted max-w-md mx-auto mb-8 text-sm font-medium leading-relaxed">
      عندما يبدأ العملاء في الشراء، ستظهر طلباتهم هنا. يمكنك إنشاء طلب يدوي لاختبار النظام.
    </p>
    
    <div class="flex items-center gap-4">
      <NuxtLink to="/dashboard/orders/create" class="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm">
        <Icon name="ph:plus-bold" class="w-4 h-4" />
        إنشاء طلب
      </NuxtLink>
    </div>
  </div>
</template>
