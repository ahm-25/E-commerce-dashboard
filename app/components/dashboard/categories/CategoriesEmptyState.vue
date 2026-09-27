<template>
  <div class="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
    <div class="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
      <Icon name="ph:folder-plus-bold" class="w-10 h-10" />
    </div>
    
    <h3 class="text-xl font-black text-primary-navy dark:text-white font-ibm mb-2">لم تضف أي أقسام بعد</h3>
    <p class="text-muted text-sm leading-relaxed mb-6">
      أنشئ أقسامًا لتنظيم منتجات متجرك وتسهيل التصفح على العملاء.
    </p>
    
    <NuxtLink to="/dashboard/categories/create" class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-sm">
      <Icon name="ph:plus-bold" class="w-4 h-4" />
      إضافة قسم
    </NuxtLink>
  </div>
</template>
