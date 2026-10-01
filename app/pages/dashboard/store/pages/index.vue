<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="text-sm text-gray-500 mb-1">لوحة التحكم / المتجر / الصفحات</div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">صفحات المتجر</h1>
          <p class="text-sm text-gray-500 mt-1">أنشئ وأدر صفحات المحتوى الأساسية لمتجرك.</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-surface-dark dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors shadow-sm">
            تصدير
          </button>
          <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-surface-dark dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors shadow-sm">
            معاينة المتجر
          </button>
          <NuxtLink v-if="canManage" to="/dashboard/store/pages/create" class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm">
            <Icon name="heroicons:plus" class="w-4 h-4" />
            إضافة صفحة
          </NuxtLink>
        </div>
      </div>

      <!-- Stats -->
      <DashboardStorePagesStorePagesStats />

      <!-- Main Content (Toolbar + Table) -->
      <div class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm flex flex-col transition-all">
        
        <!-- Toolbar -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-800">
          <DashboardStorePagesStorePagesToolbar />
        </div>

        <!-- Table Section -->
        <DashboardStorePagesStorePagesTable />

      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { useStorePages } from '~/composables/useStorePages'
import DashboardStorePagesStorePagesStats from '~/components/dashboard/store/pages/StorePagesStats.vue'
import DashboardStorePagesStorePagesToolbar from '~/components/dashboard/store/pages/StorePagesToolbar.vue'
import DashboardStorePagesStorePagesTable from '~/components/dashboard/store/pages/StorePagesTable.vue'

// Initialize logic
useStorePages()

const canManage = useCanManage('storefront')
</script>
