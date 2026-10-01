<template>
  <div class="flex flex-col items-center justify-center text-center max-w-md mx-auto">
    <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
      <Icon name="ph:users-three-duotone" class="w-10 h-10 text-primary" />
    </div>
    <h3 class="text-xl font-bold text-primary-navy dark:text-white mb-2">لا يوجد عملاء حتى الآن</h3>
    <p class="text-muted mb-8 leading-relaxed">
      عندما يبدأ العملاء بالتسجيل أو إجراء الطلبات، ستظهر بياناتهم هنا. يمكنك أيضاً إضافة عميل يدوياً.
    </p>
    <button 
      v-if="canManage" @click="store.openAddCustomer()"
      class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm shadow-primary/20"
    >
      <Icon name="ph:plus-bold" class="w-5 h-5" />
      إضافة أول عميل
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { useCustomersStore } from '~/stores/customers'

const store = useCustomersStore()

const canManage = useCanManage('customers')
</script>
