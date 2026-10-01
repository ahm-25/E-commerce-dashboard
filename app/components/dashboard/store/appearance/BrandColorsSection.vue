<template>
  <div class="bg-surface dark:bg-surface-dark p-5 md:p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-primary-navy dark:text-white">ألوان العلامة التجارية</h2>
    </div>
    
    <DashboardStoreAppearanceThemePresets class="mb-6" />
    
    <div class="space-y-4">
      <DashboardStoreAppearanceColorField 
        label="اللون الأساسي" 
        field="primary" 
        description="لون الأزرار الأساسية والعناصر الرئيسية"
      />
      <DashboardStoreAppearanceColorField 
        label="اللون الثانوي" 
        field="secondary" 
        description="لون العناصر الثانوية في الهيدر والفوتر"
      />
      <DashboardStoreAppearanceColorField 
        label="لون التمييز" 
        field="accent" 
        description="لون التنبيهات وشريط الإعلانات"
      />
      <DashboardStoreAppearanceColorField 
        label="لون النص" 
        field="text" 
        description="لون النصوص الأساسية في المتجر"
      />
      <DashboardStoreAppearanceColorField 
        label="لون الخلفية" 
        field="background" 
        description="لون خلفية صفحات المتجر"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Logic in children
</script>
