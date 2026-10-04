<template>
  <div class="print-root min-h-screen bg-gray-200 text-black" dir="rtl">
    <!-- Screen-only toolbar -->
    <div class="no-print sticky top-0 z-10 bg-white border-b border-gray-300 shadow-sm">
      <div class="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <button @click="goBack" class="inline-flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-black">
          <Icon name="ph:arrow-right-bold" class="w-4 h-4" /> رجوع
        </button>
        <div class="flex gap-1 p-1 bg-gray-100 rounded-lg">
          <button
            v-for="t in TYPES"
            :key="t.id"
            @click="setType(t.id)"
            class="px-3 py-1.5 rounded-md text-sm font-bold"
            :class="type === t.id ? 'bg-white shadow-sm text-black' : 'text-gray-500'"
          >
            {{ t.label }}
          </button>
        </div>
        <span class="text-sm text-gray-500">{{ orders.length }} {{ orders.length === 1 ? 'طلب' : 'طلبات' }} · {{ type === 'label' ? 'مقاس 10×15 سم (طابعة حرارية)' : 'مقاس A4' }}</span>
        <button
          @click="print"
          :disabled="loading || !orders.length"
          class="ms-auto inline-flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg font-bold text-sm disabled:opacity-50"
        >
          <Icon name="ph:printer-bold" class="w-4 h-4" /> طباعة
        </button>
      </div>
      <p v-if="failed.length" class="max-w-5xl mx-auto px-4 pb-2 text-sm text-red-600">تعذر تحميل {{ failed.length }} من الطلبات المحددة.</p>
    </div>

    <div v-if="loading" class="no-print py-24 text-center text-gray-500">
      <Icon name="ph:spinner-gap" class="w-8 h-8 animate-spin mx-auto mb-2" /> جاري تجهيز المستندات...
    </div>
    <div v-else-if="!orders.length" class="no-print py-24 text-center text-gray-600">لا توجد طلبات للطباعة.</div>

    <!-- Invoices (A4) -->
    <div v-else-if="type === 'invoice'" class="sheets py-8 flex flex-col items-center gap-8">
      <section v-for="o in orders" :key="o.id" class="sheet invoice bg-white shadow-lg">
        <header class="flex justify-between items-start gap-6 pb-6 border-b-2 border-black">
          <div>
            <h1 class="text-2xl font-black">{{ store.name }}</h1>
            <p class="text-sm text-gray-700 mt-1 leading-relaxed">
              {{ [store.address, store.city, store.country].filter(Boolean).join('، ') }}<br>
              <span dir="ltr">{{ store.phone }}</span> · <span dir="ltr">{{ store.email }}</span>
            </p>
            <p v-if="store.taxNumber" class="text-sm mt-1">الرقم الضريبي: <b dir="ltr">{{ store.taxNumber }}</b></p>
          </div>
          <div class="text-left shrink-0">
            <div class="text-3xl font-black tracking-tight">فاتورة</div>
            <Barcode :value="o.orderNumber" :height="38" class="w-48 h-12 mt-2" />
            <div class="text-sm font-bold text-center" dir="ltr">{{ o.orderNumber }}</div>
          </div>
        </header>

        <div class="grid grid-cols-3 gap-6 py-6 text-sm">
          <div>
            <div class="text-xs font-bold text-gray-500 mb-1">فاتورة إلى</div>
            <div class="font-bold">{{ o.customer.name }}</div>
            <div v-if="o.customer.phone" dir="ltr" class="text-right">{{ o.customer.phone }}</div>
            <div v-if="o.customer.email" dir="ltr" class="text-right">{{ o.customer.email }}</div>
          </div>
          <div>
            <div class="text-xs font-bold text-gray-500 mb-1">عنوان الشحن</div>
            <div class="leading-relaxed">{{ addressLine(o) }}</div>
          </div>
          <div class="space-y-1">
            <div class="flex justify-between gap-2"><span class="text-gray-500">التاريخ</span><b>{{ date(o.createdAt) }}</b></div>
            <div class="flex justify-between gap-2"><span class="text-gray-500">طريقة الدفع</span><b>{{ o.payment.method || '—' }}</b></div>
            <div class="flex justify-between gap-2"><span class="text-gray-500">حالة الدفع</span><b>{{ PAYMENT[o.payment.status] }}</b></div>
            <div v-if="o.shipping?.method" class="flex justify-between gap-2"><span class="text-gray-500">الشحن</span><b>{{ o.shipping.method }}</b></div>
          </div>
        </div>

        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-gray-100 text-right">
              <th class="p-2 border border-gray-300 w-8">#</th>
              <th class="p-2 border border-gray-300">المنتج</th>
              <th class="p-2 border border-gray-300 w-28">SKU</th>
              <th class="p-2 border border-gray-300 w-16 text-center">الكمية</th>
              <th class="p-2 border border-gray-300 w-28">سعر الوحدة</th>
              <th class="p-2 border border-gray-300 w-28">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in o.items" :key="item.id" class="break-inside-avoid">
              <td class="p-2 border border-gray-300 text-center">{{ i + 1 }}</td>
              <td class="p-2 border border-gray-300">
                <div class="font-semibold">{{ item.name }}</div>
                <div v-if="item.variant" class="text-xs text-gray-600">{{ item.variant }}</div>
              </td>
              <td class="p-2 border border-gray-300 font-mono text-xs" dir="ltr">{{ item.sku }}</td>
              <td class="p-2 border border-gray-300 text-center">{{ item.quantity }}</td>
              <td class="p-2 border border-gray-300">{{ money(item.unitPrice, o) }}</td>
              <td class="p-2 border border-gray-300 font-semibold">{{ money(item.total, o) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-between items-start gap-8 mt-6">
          <div class="text-sm text-gray-700 max-w-xs">
            <p v-if="o.couponCode">كود الخصم المستخدم: <b dir="ltr">{{ o.couponCode }}</b></p>
            <p v-if="customerNote(o)" class="mt-2"><span class="text-gray-500">ملاحظات العميل:</span> {{ customerNote(o) }}</p>
          </div>
          <table class="text-sm w-72">
            <tbody>
              <tr><td class="py-1 text-gray-600">المجموع الفرعي</td><td class="py-1 text-left">{{ money(o.pricing.subtotal, o) }}</td></tr>
              <tr v-if="o.pricing.discount"><td class="py-1 text-gray-600">الخصم</td><td class="py-1 text-left">− {{ money(o.pricing.discount, o) }}</td></tr>
              <tr><td class="py-1 text-gray-600">الشحن</td><td class="py-1 text-left">{{ o.pricing.shipping ? money(o.pricing.shipping, o) : 'مجاني' }}</td></tr>
              <tr v-if="o.pricing.tax"><td class="py-1 text-gray-600">ضريبة القيمة المضافة</td><td class="py-1 text-left">{{ money(o.pricing.tax, o) }}</td></tr>
              <tr class="border-t-2 border-black text-base font-black"><td class="pt-2">الإجمالي</td><td class="pt-2 text-left">{{ money(o.pricing.total, o) }}</td></tr>
              <tr v-if="isCod(o)"><td colspan="2" class="pt-2 text-xs font-bold">المبلغ يُدفع نقداً عند الاستلام</td></tr>
            </tbody>
          </table>
        </div>

        <footer class="mt-auto pt-8 text-center text-xs text-gray-500 border-t border-gray-200">
          شكراً لتسوقك من {{ store.name }} · للاستفسار: <span dir="ltr">{{ store.phone }}</span>
        </footer>
      </section>
    </div>

    <!-- Shipping labels (100 × 150 mm) -->
    <div v-else class="sheets py-8 flex flex-wrap justify-center gap-6">
      <section v-for="o in orders" :key="o.id" class="sheet label bg-white shadow-lg">
        <div class="flex justify-between items-center border-b-2 border-black pb-1.5">
          <div class="font-black text-[15px] leading-tight">{{ store.name }}</div>
          <div class="text-[10px] text-left leading-tight">
            <div>المرسل</div>
            <div dir="ltr" class="font-bold">{{ store.phone }}</div>
          </div>
        </div>

        <div class="py-2 border-b border-black">
          <div class="text-[10px] font-bold text-gray-600">المستلم</div>
          <div class="text-[17px] font-black leading-tight">{{ o.shipping?.address?.name || o.customer.name }}</div>
          <div class="text-[19px] font-black tracking-wide" dir="ltr" style="text-align: right">{{ o.shipping?.address?.phone || o.customer.phone }}</div>
          <div class="text-[13px] font-bold mt-1">{{ [o.shipping?.address?.state, o.shipping?.address?.city].filter(Boolean).join(' - ') }}</div>
          <div class="text-[12px] leading-snug">{{ [o.shipping?.address?.region, o.shipping?.address?.street].filter(Boolean).join('، ') }}</div>
        </div>

        <!-- Cash to collect: the number the courier cares about -->
        <div class="my-2 border-2 border-black rounded-md p-2 text-center" :class="isCod(o) ? '' : 'bg-gray-100'">
          <template v-if="isCod(o)">
            <div class="text-[11px] font-bold">المبلغ المطلوب تحصيله</div>
            <div class="text-[26px] font-black leading-none mt-0.5">{{ money(o.pricing.total, o) }}</div>
          </template>
          <template v-else>
            <div class="text-[15px] font-black">مدفوع مسبقاً</div>
            <div class="text-[11px] font-bold">لا يتم تحصيل أي مبلغ</div>
          </template>
        </div>

        <div class="text-[11px] grid grid-cols-2 gap-x-2 gap-y-0.5">
          <div><span class="text-gray-600">التاريخ:</span> <b>{{ date(o.createdAt) }}</b></div>
          <div><span class="text-gray-600">الشحن:</span> <b>{{ o.shipping?.method || '—' }}</b></div>
          <div><span class="text-gray-600">عدد القطع:</span> <b>{{ o.items.reduce((s, i) => s + i.quantity, 0) }}</b></div>
          <div v-if="o.shipping?.trackingNumber"><span class="text-gray-600">التتبع:</span> <b dir="ltr">{{ o.shipping.trackingNumber }}</b></div>
        </div>
        <div class="text-[10px] mt-1 leading-snug line-clamp-2">
          <span class="text-gray-600">المحتوى:</span> {{ o.items.map(i => `${i.name}${i.variant ? ` (${i.variant})` : ''} ×${i.quantity}`).join('، ') }}
        </div>
        <div v-if="customerNote(o)" class="text-[10px] mt-1 leading-snug line-clamp-2"><span class="text-gray-600">ملاحظة:</span> {{ customerNote(o) }}</div>

        <div class="mt-auto pt-2 border-t-2 border-black">
          <Barcode :value="o.shipping?.trackingNumber || o.orderNumber" :height="50" class="w-full h-14" />
          <div class="text-center font-black text-[14px] tracking-widest" dir="ltr">{{ o.shipping?.trackingNumber || o.orderNumber }}</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { OrderDetails } from '~/stores/orders'
import { useStoreSettingsStore } from '~/stores/storeSettings'
import Barcode from '~/components/dashboard/print/Barcode.vue'

// /dashboard/orders/print?ids=a,b&type=invoice|label — opened in a new tab from the orders
// list or an order's page; prints right away (the toolbar stays off the paper).

type DocType = 'invoice' | 'label'
const TYPES: { id: DocType, label: string }[] = [
  { id: 'label', label: 'بوليصة شحن' },
  { id: 'invoice', label: 'فاتورة' }
]

const PAYMENT: Record<OrderDetails['payment']['status'], string> = {
  paid: 'مدفوع', pending: 'في انتظار الدفع', failed: 'فشل الدفع', refunded: 'مسترد'
}

const route = useRoute()
const router = useRouter()
const settingsStore = useStoreSettingsStore()

const type = ref<DocType>(route.query.type === 'invoice' ? 'invoice' : 'label')
const orders = ref<OrderDetails[]>([])
const failed = ref<string[]>([])
const loading = ref(true)

// Store details for the header (store settings aren't on the API yet)
const store = computed(() => ({
  name: settingsStore.settings?.name || 'المتجر',
  phone: settingsStore.settings?.phone || '',
  email: settingsStore.settings?.email || '',
  address: settingsStore.settings?.address || '',
  city: settingsStore.settings?.city || '',
  country: settingsStore.settings?.country || '',
  taxNumber: settingsStore.settings?.taxNumber || ''
}))

const money = (n: number, o: OrderDetails) => `${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${o.pricing.currency}`
const date = (iso: string) => new Date(iso).toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: '2-digit', day: '2-digit' })
// Cash on delivery still to collect
const isCod = (o: OrderDetails) => o.payment.methodType === 'cod' && o.payment.status === 'pending'
const customerNote = (o: OrderDetails) => o.notes?.find(n => n.type === 'customer')?.content
const addressLine = (o: OrderDetails) => {
  const a = o.shipping?.address
  return a ? [a.street, a.region, a.city, a.state, a.country].filter(Boolean).join('، ') : '—'
}

const setType = (t: DocType) => {
  type.value = t
  router.replace({ query: { ...route.query, type: t } })
}

const print = () => window.print()

const goBack = () => {
  if (window.history.length > 1) router.back()
  else window.close()
}

useHead(() => ({
  title: type.value === 'invoice' ? 'طباعة الفواتير' : 'طباعة بوالص الشحن',
  // Paper size follows the document type
  style: [{ key: 'print-page-size', innerHTML: `@page { size: ${type.value === 'invoice' ? 'A4' : '100mm 150mm'}; margin: 0; }` }]
}))

onMounted(async () => {
  const ids = String(route.query.ids ?? '').split(',').map(s => s.trim()).filter(Boolean)
  const [results] = await Promise.all([
    Promise.allSettled(ids.map(id => $fetch<OrderDetails>(`/api/admin/orders/${encodeURIComponent(id)}`))),
    settingsStore.settings ? null : settingsStore.fetchSettings()
  ])
  orders.value = results.flatMap(r => r.status === 'fulfilled' ? [r.value] : [])
  failed.value = ids.filter((_, i) => results[i]!.status === 'rejected')
  loading.value = false

  if (orders.value.length && route.query.auto !== '0') {
    await nextTick()
    // Let the barcodes and the store header render before the print dialog freezes the page
    setTimeout(print, 400)
  }
})
</script>

<style scoped>
.sheet.invoice {
  width: 210mm;
  min-height: 297mm;
  padding: 16mm 14mm;
  display: flex;
  flex-direction: column;
}

.sheet.label {
  width: 100mm;
  height: 150mm;
  padding: 4mm;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Cairo', sans-serif;
}

@media print {
  .no-print {
    display: none !important;
  }
  .print-root,
  .sheets {
    background: #fff !important;
    padding: 0 !important;
    gap: 0 !important;
    display: block !important;
    min-height: 0 !important;
  }
  .sheet {
    box-shadow: none !important;
    break-after: page;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sheet:last-child {
    break-after: auto;
  }
}
</style>
