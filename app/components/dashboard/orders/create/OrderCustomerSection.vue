<template>
  <section class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5">
    <div class="flex items-center justify-between gap-4 mb-4">
      <h2 class="font-bold text-primary-navy dark:text-white font-ibm">العميل</h2>
      <div class="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1" role="radiogroup" aria-label="نوع العميل">
        <button
          v-for="mode in modes"
          :key="mode.value"
          type="button"
          role="radio"
          :aria-checked="form.customerMode === mode.value"
          @click="form.customerMode = mode.value"
          class="px-3 py-1 rounded-md text-xs font-bold transition-colors"
          :class="form.customerMode === mode.value ? 'bg-white dark:bg-surface-dark text-primary-navy dark:text-white shadow-sm' : 'text-muted'"
        >
          {{ mode.label }}
        </button>
      </div>
    </div>

    <!-- Existing customer -->
    <template v-if="form.customerMode === 'existing'">
      <div v-if="form.customer" class="flex items-center justify-between gap-4 p-3 rounded-lg border border-primary/30 bg-primary/5">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">{{ form.customer.name.charAt(0) }}</div>
          <div class="min-w-0">
            <div class="font-bold text-primary-navy dark:text-white">{{ form.customer.name }}</div>
            <div class="text-xs text-muted" dir="ltr">{{ [form.customer.phone, form.customer.email].filter(Boolean).join(' · ') }}</div>
          </div>
        </div>
        <button type="button" @click="form.customer = null" class="text-sm font-bold text-primary hover:underline shrink-0">تغيير</button>
      </div>

      <div v-else class="relative">
        <Icon name="ph:magnifying-glass" class="w-4 h-4 text-muted absolute right-3 top-3 pointer-events-none" />
        <input
          v-model="query"
          type="search"
          placeholder="ابحث بالاسم أو الموبايل أو الإيميل"
          aria-label="ابحث عن عميل"
          :class="[inputClass, 'pr-9']"
        />
        <div class="mt-2 border border-border-light dark:border-border-dark rounded-lg divide-y divide-border-light dark:divide-border-dark max-h-60 overflow-y-auto">
          <div v-if="customers.loading" class="p-4 text-sm text-muted text-center">جاري تحميل العملاء...</div>
          <button
            v-for="c in results"
            :key="c.id"
            type="button"
            :disabled="c.status === 'blocked'"
            @click="form.customer = c"
            class="w-full text-right px-3 py-2.5 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="min-w-0">
              <span class="block text-sm font-bold text-primary-navy dark:text-white">{{ c.name }}</span>
              <span class="block text-xs text-muted" dir="ltr">{{ [c.phone, c.email].filter(Boolean).join(' · ') }}</span>
            </span>
            <span v-if="c.status === 'blocked'" class="text-xs font-bold text-danger shrink-0">محظور</span>
            <span v-else class="text-xs text-muted shrink-0">{{ c.ordersCount }} طلب</span>
          </button>
          <div v-if="!customers.loading && !results.length" class="p-4 text-sm text-muted text-center">
            مفيش عميل بالبيانات دي.
            <button type="button" @click="startNew" class="text-primary font-bold hover:underline">ضيفه كعميل جديد</button>
          </div>
        </div>
      </div>
    </template>

    <!-- New customer -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label :class="labelClass">الاسم <span class="text-danger">*</span></label>
        <input v-model="form.newCustomer.name" type="text" :class="inputClass" />
      </div>
      <div>
        <label :class="labelClass">الموبايل <span class="text-danger">*</span></label>
        <input v-model="form.newCustomer.phone" type="tel" dir="ltr" placeholder="01xxxxxxxxx" :class="inputClass" />
      </div>
      <div class="sm:col-span-2">
        <label :class="labelClass">الإيميل</label>
        <input v-model="form.newCustomer.email" type="email" dir="ltr" placeholder="اختياري" :class="inputClass" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCustomersStore } from '~/stores/customers'
import { useManualOrder } from '~/composables/useManualOrder'

const { form } = useManualOrder()
const customers = useCustomersStore()

const modes = [
  { value: 'existing', label: 'عميل حالي' },
  { value: 'new', label: 'عميل جديد' }
] as const

const query = ref('')

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = customers.customers
  if (!q) return list.slice(0, 8)
  return list.filter(c =>
    c.name.toLowerCase().includes(q) || c.phone?.includes(q) || c.email?.toLowerCase().includes(q)
  )
})

// Carry what was typed over to the new-customer form
const startNew = () => {
  const q = query.value.trim()
  if (/^[\d+]+$/.test(q)) form.newCustomer.phone = q
  else if (q.includes('@')) form.newCustomer.email = q
  else form.newCustomer.name = q
  form.customerMode = 'new'
}

onMounted(() => {
  if (!customers.customers.length) customers.fetchCustomers()
})

const labelClass = 'block text-sm font-bold text-primary-navy dark:text-white mb-2'
const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors'
</script>
