<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6">
      
      <!-- Header Area -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <div>
          <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">لوحة التحكم</h1>
          <p class="text-muted text-sm mt-1.5 font-bold">مرحباً بك. إليك نظرة سريعة على أداء متجرك.</p>
        </div>
        <DashboardDateRange />
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardKpiCard 
          title="إجمالي المبيعات"
          value="85,240 ج.م"
          change="+12.5%"
          icon="ph:wallet"
        />
        <DashboardKpiCard 
          title="الطلبات"
          value="1,248"
          change="+8.2%"
          icon="ph:shopping-bag"
        />
        <DashboardKpiCard 
          title="العملاء"
          value="3,842"
          change="+6.4%"
          icon="ph:users"
        />
        <DashboardKpiCard 
          title="معدل التحويل"
          value="4.8%"
          change="+1.2%"
          icon="ph:trend-up"
        />
      </div>
      
      <!-- Charts Area -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div class="xl:col-span-2 h-full">
          <SalesChart />
        </div>
        
        <div class="h-full">
          <OrderStatusChart />
        </div>
      </div>
      
      <!-- Bottom Section -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-8">
        <!-- RTL layout means first element is on the right -->
        <div class="h-full">
          <RecentOrders />
        </div>
        
        <div class="h-full">
          <TopProducts />
        </div>
        
        <div class="flex flex-col gap-6 h-full">
          <LowStockAlert />
          <QuickActions />
        </div>
      </div>

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import DashboardKpiCard from '~/components/dashboard/DashboardKpiCard.vue'
import DashboardDateRange from '~/components/dashboard/DashboardDateRange.vue'
import SalesChart from '~/components/dashboard/SalesChart.vue'
import OrderStatusChart from '~/components/dashboard/OrderStatusChart.vue'
import RecentOrders from '~/components/dashboard/RecentOrders.vue'
import TopProducts from '~/components/dashboard/TopProducts.vue'
import LowStockAlert from '~/components/dashboard/LowStockAlert.vue'
import QuickActions from '~/components/dashboard/QuickActions.vue'
</script>
