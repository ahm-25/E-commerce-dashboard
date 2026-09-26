<template>
  <aside 
    :class="[
      'flex flex-col bg-[#0B1626] text-white transition-all duration-300 shadow-xl lg:shadow-none z-40 flex-shrink-0',
      isCollapsed ? 'w-[72px]' : 'w-[260px]',
      isMobile ? 'w-[260px] h-full absolute right-0 top-0' : 'relative h-screen'
    ]"
  >
    <!-- Header -->
    <div class="h-[72px] flex items-center px-4 border-b border-white/5 flex-shrink-0">
      <div v-if="!isCollapsed" class="flex items-center gap-3 w-full">
        <span class="font-black text-2xl text-white tracking-wider font-ibm">EDIX</span>
        <div class="flex-1 flex items-center gap-2 bg-white/5 rounded-lg p-2 border border-white/10">
          <div class="w-8 h-8 rounded bg-primary-light/10 flex items-center justify-center text-primary">
            <Icon name="ph:storefront-bold" class="w-5 h-5" />
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-bold leading-tight">متجر أحمد</span>
            <span class="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
              متجرك يعمل
            </span>
          </div>
        </div>
      </div>
      <div v-else class="w-full flex justify-center">
        <span class="font-black text-2xl text-white font-ibm">E</span>
      </div>
      <button v-if="isMobile" @click="$emit('close')" class="absolute left-4 text-gray-400 hover:text-white">
        <Icon name="ph:x-bold" class="w-5 h-5" />
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto py-6 flex flex-col gap-6 px-3 custom-scrollbar">
      <!-- Section: الرئيسية -->
      <div class="flex flex-col gap-1">
        <div v-if="!isCollapsed" class="text-[11px] font-bold text-gray-500 mb-2 px-2 uppercase tracking-wider">الرئيسية</div>
        <NuxtLink to="/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative" exact-active-class="bg-primary text-white" :class="$route.path === '/dashboard' ? '' : 'text-gray-400 hover:bg-white/5 hover:text-white'">
          <Icon name="ph:squares-four" class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed" class="font-semibold text-sm">لوحة التحكم</span>
          
          <!-- Tooltip for collapsed state -->
          <div v-if="isCollapsed" class="absolute right-full mr-2 px-2 py-1 bg-white text-primary-navy text-xs font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-50 transition-all shadow-lg">
            لوحة التحكم
          </div>
        </NuxtLink>
      </div>

      <!-- Section: المتجر -->
      <div class="flex flex-col gap-1">
        <div v-if="!isCollapsed" class="text-[11px] font-bold text-gray-500 mb-2 px-2 uppercase tracking-wider">المتجر</div>
        <NuxtLink v-for="item in storeLinks" :key="item.path" :to="item.path" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors group relative" active-class="bg-primary !text-white">
          <Icon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed" class="font-semibold text-sm">{{ item.name }}</span>
          
          <div v-if="isCollapsed" class="absolute right-full mr-2 px-2 py-1 bg-white text-primary-navy text-xs font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-50 transition-all shadow-lg">
            {{ item.name }}
          </div>
        </NuxtLink>
      </div>

      <!-- Section: إدارة المتجر -->
      <div class="flex flex-col gap-1">
        <div v-if="!isCollapsed" class="text-[11px] font-bold text-gray-500 mb-2 px-2 uppercase tracking-wider">إدارة المتجر</div>
        <NuxtLink v-for="item in manageLinks" :key="item.path" :to="item.path" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors group relative" active-class="bg-primary !text-white">
          <Icon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed" class="font-semibold text-sm">{{ item.name }}</span>
          
          <div v-if="isCollapsed" class="absolute right-full mr-2 px-2 py-1 bg-white text-primary-navy text-xs font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-50 transition-all shadow-lg">
            {{ item.name }}
          </div>
        </NuxtLink>
      </div>
      
      <!-- Section: التحليلات -->
      <div class="flex flex-col gap-1">
        <div v-if="!isCollapsed" class="text-[11px] font-bold text-gray-500 mb-2 px-2 uppercase tracking-wider">التحليلات</div>
        <NuxtLink v-for="item in analyticsLinks" :key="item.path" :to="item.path" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors group relative" active-class="bg-primary !text-white">
          <Icon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed" class="font-semibold text-sm">{{ item.name }}</span>
          
          <div v-if="isCollapsed" class="absolute right-full mr-2 px-2 py-1 bg-white text-primary-navy text-xs font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-50 transition-all shadow-lg">
            {{ item.name }}
          </div>
        </NuxtLink>
      </div>
      
      <!-- Section: النظام -->
      <div class="flex flex-col gap-1">
        <div v-if="!isCollapsed" class="text-[11px] font-bold text-gray-500 mb-2 px-2 uppercase tracking-wider">النظام</div>
        <NuxtLink v-for="item in systemLinks" :key="item.path" :to="item.path" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors group relative" active-class="bg-primary !text-white">
          <Icon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed" class="font-semibold text-sm">{{ item.name }}</span>
          
          <div v-if="isCollapsed" class="absolute right-full mr-2 px-2 py-1 bg-white text-primary-navy text-xs font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap z-50 transition-all shadow-lg">
            {{ item.name }}
          </div>
        </NuxtLink>
      </div>
    </nav>

    <!-- Footer Toggle -->
    <div v-if="!isMobile" class="p-3 border-t border-white/5 flex-shrink-0">
      <button @click="$emit('toggle')" class="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
        <Icon :name="isCollapsed ? 'ph:caret-left-bold' : 'ph:caret-right-bold'" class="w-4 h-4 flex-shrink-0" />
        <span v-if="!isCollapsed" class="text-sm font-semibold">طي القائمة</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  isCollapsed?: boolean
  isMobile?: boolean
}>()

defineEmits(['toggle', 'close'])

const storeLinks = [
  { name: 'المنتجات', path: '/dashboard/products', icon: 'ph:package' },
  { name: 'الأقسام', path: '/dashboard/categories', icon: 'ph:folders' },
  { name: 'الطلبات', path: '/dashboard/orders', icon: 'ph:shopping-cart' },
  { name: 'العملاء', path: '/dashboard/customers', icon: 'ph:users' },
  { name: 'العروض والخصومات', path: '/dashboard/discounts', icon: 'ph:ticket' },
  { name: 'التقييمات', path: '/dashboard/reviews', icon: 'ph:star' },
]

const manageLinks = [
  { name: 'المظهر', path: '/dashboard/appearance', icon: 'ph:palette' },
  { name: 'الصفحات', path: '/dashboard/pages', icon: 'ph:browser' },
  { name: 'إعدادات المتجر', path: '/dashboard/settings', icon: 'ph:storefront' },
  { name: 'الشحن', path: '/dashboard/shipping', icon: 'ph:truck' },
  { name: 'طرق الدفع', path: '/dashboard/payments', icon: 'ph:credit-card' },
]

const analyticsLinks = [
  { name: 'التحليلات', path: '/dashboard/analytics', icon: 'ph:chart-line-up' },
  { name: 'التقارير', path: '/dashboard/reports', icon: 'ph:file-text' },
]

const systemLinks = [
  { name: 'الإشعارات', path: '/dashboard/notifications', icon: 'ph:bell' },
  { name: 'الدعم', path: '/dashboard/support', icon: 'ph:headset' },
  { name: 'الإعدادات', path: '/dashboard/system-settings', icon: 'ph:gear' },
]
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
}
:deep(.dark) .custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #475569;
}
</style>
