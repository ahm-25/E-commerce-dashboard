<template>
  <div class="flex h-screen overflow-hidden bg-bg dark:bg-bg-dark">
    <!-- Desktop Sidebar -->
    <DashboardSidebar class="hidden md:flex" :is-collapsed="isSidebarCollapsed" @toggle="toggleSidebar" />
    
    <!-- Mobile Drawer -->
    <div v-if="isMobileDrawerOpen" class="fixed inset-0 z-50 flex md:hidden">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-primary-navy/50 backdrop-blur-sm" @click="isMobileDrawerOpen = false"></div>
      
      <!-- Drawer Sidebar -->
      <DashboardSidebar class="relative z-10" is-mobile @close="isMobileDrawerOpen = false" />
    </div>

    <!-- Main Content -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <DashboardTopbar @toggle-mobile="isMobileDrawerOpen = true" />
      
      <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardSidebar from '~/components/dashboard/DashboardSidebar.vue'
import DashboardTopbar from '~/components/dashboard/DashboardTopbar.vue'

const isSidebarCollapsed = ref(false)
const isMobileDrawerOpen = ref(false)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>
