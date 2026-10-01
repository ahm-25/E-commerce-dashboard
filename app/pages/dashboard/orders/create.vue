<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <div>
        <div class="flex items-center gap-2 text-sm text-muted mb-2">
          <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
          <Icon name="ph:caret-left" class="w-3 h-3" />
          <NuxtLink to="/dashboard/orders" class="hover:text-primary transition-colors">الطلبات</NuxtLink>
          <Icon name="ph:caret-left" class="w-3 h-3" />
          <span class="text-primary-navy dark:text-white font-medium">طلب يدوي</span>
        </div>
        <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">إنشاء طلب يدوي</h1>
        <p class="text-sm text-muted mt-1">لطلبات التليفون والواتساب والبيع من المحل.</p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div class="xl:col-span-2 flex flex-col gap-6">
          <OrderCustomerSection />
          <OrderItemsSection />
          <OrderShippingSection />
        </div>
        <OrderSummarySection @created="onCreated" />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { provideManualOrder } from '~/composables/useManualOrder'
import { useStoreSettingsStore } from '~/stores/storeSettings'
import OrderCustomerSection from '~/components/dashboard/orders/create/OrderCustomerSection.vue'
import OrderItemsSection from '~/components/dashboard/orders/create/OrderItemsSection.vue'
import OrderShippingSection from '~/components/dashboard/orders/create/OrderShippingSection.vue'
import OrderSummarySection from '~/components/dashboard/orders/create/OrderSummarySection.vue'

const { form } = provideManualOrder()
const settings = useStoreSettingsStore()

let created = false
const onCreated = async (id: string) => {
  created = true
  await navigateTo(`/dashboard/orders/${id}`)
}

onBeforeRouteLeave(() => {
  const hasWork = form.items.length || form.customer || form.newCustomer.name
  if (!created && hasWork && !confirm('الطلب ماتحفظش. تخرج وتتجاهله؟')) return false
})

useHead({
  title: 'طلب يدوي | لوحة التحكم'
})

onMounted(() => {
  // Tax rules come from the store settings
  if (!settings.settings) settings.fetchSettings()
})
</script>
