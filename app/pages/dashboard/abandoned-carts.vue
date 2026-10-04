<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-sm text-muted mb-2">
            <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
            <Icon name="ph:caret-left" class="w-3 h-3" />
            <span class="text-primary-navy dark:text-white font-medium">السلات المتروكة</span>
          </div>
          <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">السلات المتروكة</h1>
          <p class="text-sm text-muted mt-1">عملاء أدخلوا رقم موبايلهم في صفحة الدفع ولم يكملوا الطلب. تواصل معهم على واتساب برابط يرجع لهم السلة كما هي.</p>
        </div>
        <button @click="store.fetchCarts()" :disabled="store.loading" class="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark text-sm font-bold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">
          <Icon name="ph:arrow-clockwise-bold" class="w-4 h-4" :class="{ 'animate-spin': store.loading }" />
          تحديث
        </button>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="s in statCards" :key="s.label" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 shadow-sm">
          <div class="flex items-center gap-2 text-sm text-muted mb-2">
            <Icon :name="s.icon" class="w-4 h-4" :class="s.color" />
            {{ s.label }}
          </div>
          <div class="text-2xl font-black text-primary-navy dark:text-white" dir="ltr" style="text-align: right">{{ s.value }}</div>
          <div v-if="s.sub" class="text-xs text-muted mt-1">{{ s.sub }}</div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div class="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg self-start overflow-x-auto max-w-full">
          <button
            v-for="t in tabs"
            :key="t.id"
            @click="store.tab = t.id"
            class="px-4 py-1.5 rounded-md text-sm font-bold whitespace-nowrap transition-colors"
            :class="store.tab === t.id ? 'bg-white dark:bg-surface-dark text-primary-navy dark:text-white shadow-sm' : 'text-muted hover:text-primary-navy dark:hover:text-white'"
          >
            {{ t.label }}
            <span class="text-xs font-semibold opacity-70">({{ t.count }})</span>
          </button>
        </div>
        <div class="relative md:w-72">
          <Icon name="ph:magnifying-glass" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input v-model="store.search" type="search" placeholder="ابحث بالاسم أو الموبايل أو المنتج" class="w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm rounded-lg pr-9 pl-3 py-2 text-primary-navy dark:text-white focus:ring-primary focus:border-primary" />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="store.loading && !store.carts.length" class="flex flex-col gap-3 animate-pulse">
        <div v-for="i in 3" :key="i" class="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
      </div>

      <!-- Error -->
      <div v-else-if="store.error" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center shadow-sm">
        <Icon name="ph:warning-circle" class="w-16 h-16 text-danger mx-auto mb-4" />
        <p class="text-muted mb-6">{{ store.error }}</p>
        <button @click="store.fetchCarts()" class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm">إعادة المحاولة</button>
      </div>

      <!-- Empty -->
      <div v-else-if="!store.filtered.length" class="bg-surface dark:bg-surface-dark border border-dashed border-border-light dark:border-border-dark rounded-xl p-12 text-center">
        <Icon name="ph:shopping-cart-simple" class="w-14 h-14 text-muted mx-auto mb-3" />
        <h2 class="font-bold text-primary-navy dark:text-white mb-1">لا توجد سلات هنا</h2>
        <p class="text-sm text-muted">{{ store.search ? 'لا توجد نتائج مطابقة للبحث.' : 'ستظهر هنا السلات التي لم يكمل أصحابها الطلب بعد ' + ABANDONED_AFTER + ' دقيقة.' }}</p>
      </div>

      <!-- List -->
      <div v-else class="flex flex-col gap-3">
        <article
          v-for="cart in store.filtered"
          :key="cart.token"
          class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5 flex flex-col lg:flex-row gap-5"
        >
          <!-- Customer -->
          <div class="lg:w-64 shrink-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold text-primary-navy dark:text-white">{{ cart.customer.name || 'بدون اسم' }}</span>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded-full" :class="STAGES[cart.stage].classes">{{ STAGES[cart.stage].label }}</span>
            </div>
            <a :href="`tel:${cart.customer.phone}`" class="text-sm text-muted hover:text-primary font-mono" dir="ltr">{{ cart.customer.phone }}</a>
            <div v-if="cart.governorate" class="text-xs text-muted mt-1 flex items-center gap-1">
              <Icon name="ph:map-pin" class="w-3.5 h-3.5" /> {{ cart.governorate }}
            </div>
            <div class="text-xs text-muted mt-2">آخر نشاط {{ formatRelativeTime(cart.updatedAt) }}</div>
            <div v-if="cart.contactedAt" class="text-xs text-success mt-1 flex items-center gap-1">
              <Icon name="ph:check-circle" class="w-3.5 h-3.5" />
              تم التواصل {{ cart.contactCount > 1 ? `${cart.contactCount} مرات، آخرها` : '' }} {{ formatRelativeTime(cart.contactedAt) }}
            </div>
          </div>

          <!-- Items -->
          <div class="flex-1 min-w-0 flex flex-col gap-2">
            <div v-for="item in cart.items" :key="`${item.productId}-${item.variantId}`" class="flex items-center gap-3">
              <img :src="item.image" :alt="item.name" class="w-11 h-11 rounded-lg object-cover bg-gray-100 dark:bg-gray-800 shrink-0" loading="lazy" />
              <div class="min-w-0 flex-1">
                <div class="text-sm font-semibold text-primary-navy dark:text-white truncate">{{ item.name }}</div>
                <div class="text-xs text-muted">
                  {{ [item.color, item.size].filter(Boolean).join(' / ') }}
                  <span v-if="!item.inStock" class="text-danger font-semibold">· نفذت الكمية</span>
                </div>
              </div>
              <div class="text-sm text-muted whitespace-nowrap">× {{ item.quantity }}</div>
              <div class="text-sm font-bold text-primary-navy dark:text-white whitespace-nowrap w-24 text-left">{{ money(item.price * item.quantity) }}</div>
            </div>
            <div v-if="!cart.items.length" class="text-sm text-muted">المنتجات لم تعد متاحة في المتجر.</div>
          </div>

          <!-- Value + actions -->
          <div class="lg:w-56 shrink-0 flex flex-col gap-2 lg:border-r lg:border-border-light lg:dark:border-border-dark lg:pr-5">
            <div class="text-xs text-muted">قيمة السلة</div>
            <div class="text-xl font-black text-primary-navy dark:text-white mb-1">{{ money(cart.value) }}</div>

            <template v-if="cart.stage === 'recovered'">
              <NuxtLink v-if="cart.recoveredOrderId" :to="`/dashboard/orders/${cart.recoveredOrderId}`" class="inline-flex items-center gap-1 text-sm font-bold text-success hover:underline">
                <Icon name="ph:receipt" class="w-4 h-4" /> طلب {{ cart.recoveredOrderNumber }}
              </NuxtLink>
              <span v-else class="text-sm font-bold text-success">طلب {{ cart.recoveredOrderNumber }}</span>
            </template>
            <template v-else-if="canManage">
              <button
                @click="contact(cart)"
                :disabled="!cart.items.length"
                class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold text-sm transition-colors disabled:opacity-40"
              >
                <Icon name="ph:whatsapp-logo-bold" class="w-4 h-4" />
                تواصل عبر واتساب
              </button>
              <div class="flex gap-2">
                <button @click="copyLink(cart)" class="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-xs font-bold text-primary-navy dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Icon :name="copied === cart.token ? 'ph:check-bold' : 'ph:link'" class="w-3.5 h-3.5" />
                  {{ copied === cart.token ? 'تم النسخ' : 'نسخ الرابط' }}
                </button>
                <button @click="remove(cart)" class="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-danger hover:bg-danger/10" aria-label="حذف السلة" title="حذف">
                  <Icon name="ph:trash" class="w-4 h-4" />
                </button>
              </div>
            </template>
          </div>
        </article>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAbandonedCartsStore, type AbandonedCart, type CartStage } from '~/stores/abandonedCarts'
import { useCanManage } from '~/composables/useCanManage'
import { formatRelativeTime } from '~/composables/useRelativeTime'

const ABANDONED_AFTER = 30 // minutes, same as server/utils/abandonedCarts.ts

const store = useAbandonedCartsStore()
const canManage = useCanManage('orders')
const { storefrontUrl } = useRuntimeConfig().public
const copied = ref<string | null>(null)

const STAGES: Record<CartStage, { label: string, classes: string }> = {
  abandoned: { label: 'متروكة', classes: 'bg-warning/15 text-warning' },
  active: { label: 'في صفحة الدفع الآن', classes: 'bg-primary/10 text-primary' },
  recovered: { label: 'تم الطلب', classes: 'bg-success/10 text-success' }
}

const money = (n: number) => `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })} ج.م`

const statCards = computed(() => [
  { label: 'سلات متروكة', value: store.stats.abandonedCount.toLocaleString('en-US'), icon: 'ph:shopping-cart-simple', color: 'text-warning' },
  { label: 'مبيعات معلّقة', value: money(store.stats.abandonedValue), icon: 'ph:coins', color: 'text-warning', sub: 'قيمة السلات المتروكة' },
  { label: 'تم استرجاعها', value: store.stats.recoveredCount.toLocaleString('en-US'), icon: 'ph:arrow-u-up-left', color: 'text-success', sub: money(store.stats.recoveredValue) },
  { label: 'نسبة الاسترجاع', value: `${store.stats.recoveryRate}%`, icon: 'ph:chart-line-up', color: 'text-primary' }
])

const tabs = computed(() => [
  { id: 'abandoned' as const, label: 'متروكة', count: store.carts.filter(c => c.stage === 'abandoned').length },
  { id: 'active' as const, label: 'في الدفع الآن', count: store.carts.filter(c => c.stage === 'active').length },
  { id: 'recovered' as const, label: 'تم الطلب', count: store.carts.filter(c => c.stage === 'recovered').length },
  { id: 'all' as const, label: 'الكل', count: store.carts.length }
])

const recoveryLink = (cart: AbandonedCart) => `${storefrontUrl}/recover-cart/${cart.token}`

// Egyptian mobile -> wa.me international form
const waNumber = (phone: string) => `20${phone.replace(/\D/g, '').replace(/^(0020|20)/, '').replace(/^0/, '')}`

const message = (cart: AbandonedCart) => [
  `مرحباً ${cart.customer.name || ''}`.trim() + '،',
  'لاحظنا أنك لم تكمل طلبك، والمنتجات ما زالت محفوظة في سلتك:',
  ...cart.items.map(i => `• ${i.name}${i.color || i.size ? ` (${[i.color, i.size].filter(Boolean).join(' / ')})` : ''} × ${i.quantity}`),
  '',
  `يمكنك إكمال الطلب من هنا: ${recoveryLink(cart)}`,
  'إذا كان لديك أي استفسار، رد على هذه الرسالة وسنساعدك.'
].join('\n')

const contact = async (cart: AbandonedCart) => {
  // Open WhatsApp first: browsers block popups opened after an await
  window.open(`https://wa.me/${waNumber(cart.customer.phone)}?text=${encodeURIComponent(message(cart))}`, '_blank', 'noopener')
  try {
    await store.markContacted(cart.token)
  } catch {
    // Contact tracking is a convenience; WhatsApp already opened
  }
}

const copyLink = async (cart: AbandonedCart) => {
  try {
    await navigator.clipboard.writeText(recoveryLink(cart))
    copied.value = cart.token
    setTimeout(() => { if (copied.value === cart.token) copied.value = null }, 2000)
  } catch {
    prompt('انسخ الرابط:', recoveryLink(cart))
  }
}

const remove = async (cart: AbandonedCart) => {
  if (!confirm(`حذف سلة ${cart.customer.name || cart.customer.phone}؟`)) return
  try {
    await store.deleteCart(cart.token)
  } catch (err) {
    alert(apiError(err, 'تعذر حذف السلة'))
  }
}

useHead({ title: 'السلات المتروكة | لوحة التحكم' })

onMounted(() => store.fetchCarts())
</script>
