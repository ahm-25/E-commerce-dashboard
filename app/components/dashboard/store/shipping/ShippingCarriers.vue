<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div
      v-for="carrier in store.carriers"
      :key="carrier.id"
      class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5 flex flex-col gap-4"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-11 h-11 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary-navy dark:text-white font-black font-ibm shrink-0">
            {{ carrier.name.charAt(0) }}
          </div>
          <div class="min-w-0">
            <h3 class="font-bold text-primary-navy dark:text-white" dir="ltr">{{ carrier.name }}</h3>
            <p class="text-xs text-muted mt-0.5">{{ carrier.description }}</p>
          </div>
        </div>
        <span
          class="px-2 py-0.5 rounded text-xs font-bold shrink-0"
          :class="carrier.status === 'connected' ? 'bg-success/10 text-success' : 'bg-gray-100 dark:bg-gray-800 text-muted'"
        >
          {{ carrier.status === 'connected' ? 'متصلة' : 'غير متصلة' }}
        </span>
      </div>

      <div class="flex flex-wrap gap-2">
        <span v-if="carrier.supportsCod" class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-muted">
          <Icon name="ph:money" class="w-3.5 h-3.5" />
          تحصيل عند الاستلام
        </span>
        <span v-if="carrier.supportsTracking" class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-muted">
          <Icon name="ph:crosshair" class="w-3.5 h-3.5" />
          تتبع الشحنة
        </span>
      </div>

      <button
        @click="toggle(carrier)"
        :disabled="pendingId === carrier.id"
        class="mt-auto w-full py-2.5 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
        :class="carrier.status === 'connected'
          ? 'bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-danger hover:bg-danger/10'
          : 'bg-primary hover:bg-primary/90 text-white shadow-sm'"
      >
        <template v-if="pendingId === carrier.id">جاري التنفيذ...</template>
        <template v-else>{{ carrier.status === 'connected' ? 'فصل الحساب' : 'ربط الحساب' }}</template>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useShippingStore, type ShippingCarrier } from '~/stores/shipping'

const store = useShippingStore()
const pendingId = ref<string | null>(null)

const toggle = async (carrier: ShippingCarrier) => {
  if (carrier.status === 'connected' && !confirm(`فصل حساب ${carrier.name}؟ الشحنات الجديدة لن تُرسل له تلقائياً.`)) {
    return
  }
  pendingId.value = carrier.id
  try {
    await store.toggleCarrier(carrier.id)
  } finally {
    pendingId.value = null
  }
}
</script>
