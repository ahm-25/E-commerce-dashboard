<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div class="flex items-center gap-2 text-sm text-muted mb-2">
            <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
            <Icon name="ph:caret-left" class="w-3 h-3" />
            <span class="text-primary-navy dark:text-white font-medium">التقارير</span>
          </div>
          <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">التقارير</h1>
          <p class="text-sm text-muted mt-1">اختر تقريراً واستعرضه أو صدّره كملف CSV يفتح في Excel.</p>
        </div>
        <PeriodSelector :model-value="analytics.period" @update:model-value="analytics.fetchAnalytics($event)" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <!-- Report list -->
        <nav class="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
          <button
            v-for="report in reports"
            :key="report.id"
            @click="selectedId = report.id"
            class="text-right border rounded-xl p-4 transition-colors shrink-0 w-56 lg:w-auto"
            :class="selectedId === report.id
              ? 'bg-primary/5 border-primary text-primary'
              : 'bg-surface dark:bg-surface-dark border-border-light dark:border-border-dark hover:border-primary/40'"
          >
            <div class="flex items-center gap-2 font-bold" :class="selectedId === report.id ? 'text-primary' : 'text-primary-navy dark:text-white'">
              <Icon :name="report.icon" class="w-5 h-5" />
              {{ report.title }}
            </div>
            <p class="text-xs text-muted mt-1">{{ report.description }}</p>
          </button>
        </nav>

        <!-- Report preview -->
        <div class="lg:col-span-3 bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-border-light dark:border-border-dark flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 class="font-bold text-primary-navy dark:text-white font-ibm">{{ selected.title }}</h2>
              <p class="text-xs text-muted mt-0.5">
                آخر {{ analytics.period }} يوم
                <template v-if="rows.length">· {{ rows.length }} صف</template>
              </p>
            </div>
            <button
              @click="exportCsv"
              :disabled="!rows.length || analytics.loading"
              class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              <Icon name="ph:download-simple-bold" class="w-4 h-4" />
              تصدير CSV
            </button>
          </div>

          <div v-if="!analytics.data && analytics.loading" class="p-6 flex flex-col gap-3 animate-pulse">
            <div v-for="i in 6" :key="i" class="h-8 bg-gray-100 dark:bg-gray-800 rounded"></div>
          </div>

          <div v-else-if="analytics.error" class="p-12 text-center">
            <p class="text-muted mb-4">{{ analytics.error }}</p>
            <button @click="analytics.fetchAnalytics()" class="px-5 py-2 bg-primary text-white rounded-lg font-bold text-sm">إعادة المحاولة</button>
          </div>

          <div v-else class="overflow-auto max-h-[600px] transition-opacity" :class="{ 'opacity-50': analytics.loading }">
            <table class="w-full text-sm text-right">
              <thead class="bg-gray-50 dark:bg-gray-800/50 text-muted sticky top-0">
                <tr>
                  <th v-for="col in selected.columns" :key="col.label" class="px-5 py-2.5 font-bold whitespace-nowrap">{{ col.label }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border-light dark:divide-border-dark">
                <tr v-for="(row, i) in rows" :key="i" class="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  <td v-for="col in selected.columns" :key="col.label" class="px-5 py-2.5 text-primary-navy dark:text-white tabular-nums whitespace-nowrap">
                    {{ col.display ? col.display(row) : col.value(row) }}
                  </td>
                </tr>
              </tbody>
              <tfoot v-if="selected.totals && rows.length" class="bg-gray-50 dark:bg-gray-800/50 sticky bottom-0">
                <tr>
                  <td v-for="(cell, i) in selected.totals(rows)" :key="i" class="px-5 py-2.5 font-black text-primary-navy dark:text-white tabular-nums whitespace-nowrap">
                    {{ cell }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsStore, sumTotals, type AnalyticsData } from '~/stores/analytics'
import { useStoreSettingsStore } from '~/stores/storeSettings'
import { formatCurrency, formatShortDate } from '~/composables/useChartTheme'
import { downloadCsv } from '~/composables/useCsvExport'
import PeriodSelector from '~/components/dashboard/analytics/PeriodSelector.vue'

interface ReportColumn {
  label: string
  value: (row: any) => string | number   // raw value, used for CSV
  display?: (row: any) => string         // formatted value for the table
}

interface ReportDefinition {
  id: string
  title: string
  description: string
  icon: string
  rows: (data: AnalyticsData) => any[]
  columns: ReportColumn[]
  totals?: (rows: any[]) => string[]
}

const analytics = useAnalyticsStore()
const settings = useStoreSettingsStore()

// Falls back to Egypt's standard VAT until store settings are loaded
const taxRate = computed(() => (settings.settings?.taxEnabled === false ? 0 : settings.settings?.taxRate ?? 14))

const sum = (rows: any[], key: string) => rows.reduce((s, r) => s + (r[key] || 0), 0)
const money = (v: number) => formatCurrency(v)
const round2 = (v: number) => Math.round(v * 100) / 100

const reports = computed<ReportDefinition[]>(() => [
  {
    id: 'sales',
    title: 'المبيعات اليومية',
    description: 'الطلبات والمبيعات ومتوسط الطلب لكل يوم',
    icon: 'ph:chart-line-up',
    rows: d => [...d.current].reverse().map(p => ({ ...p, aov: p.orders ? p.revenue / p.orders : 0 })),
    columns: [
      { label: 'التاريخ', value: r => r.date, display: r => formatShortDate(r.date) },
      { label: 'الزيارات', value: r => r.visits, display: r => r.visits.toLocaleString('en-US') },
      { label: 'الطلبات', value: r => r.orders },
      { label: 'المبيعات (ج.م)', value: r => r.revenue, display: r => money(r.revenue) },
      { label: 'متوسط الطلب (ج.م)', value: r => round2(r.aov), display: r => money(r.aov) }
    ],
    totals: rows => {
      const t = sumTotals(rows)
      return ['الإجمالي', t.visits.toLocaleString('en-US'), t.orders.toLocaleString('en-US'), money(t.revenue), money(t.aov)]
    }
  },
  {
    id: 'products',
    title: 'المنتجات',
    description: 'الكميات والمبيعات لكل منتج',
    icon: 'ph:package',
    rows: d => d.products,
    columns: [
      { label: 'المنتج', value: r => r.name },
      { label: 'القسم', value: r => r.category },
      { label: 'الكمية المباعة', value: r => r.units },
      { label: 'المبيعات (ج.م)', value: r => r.revenue, display: r => money(r.revenue) }
    ],
    totals: rows => ['الإجمالي', '', sum(rows, 'units').toLocaleString('en-US'), money(sum(rows, 'revenue'))]
  },
  {
    id: 'categories',
    title: 'الأقسام',
    description: 'توزيع المبيعات على الأقسام',
    icon: 'ph:folders',
    rows: d => d.categories,
    columns: [
      { label: 'القسم', value: r => r.label },
      { label: 'الطلبات', value: r => r.orders },
      { label: 'المبيعات (ج.م)', value: r => r.revenue, display: r => money(r.revenue) }
    ],
    totals: rows => ['الإجمالي', sum(rows, 'orders').toLocaleString('en-US'), money(sum(rows, 'revenue'))]
  },
  {
    id: 'regions',
    title: 'المحافظات',
    description: 'المبيعات حسب محافظة الشحن',
    icon: 'ph:map-pin',
    rows: d => d.regions,
    columns: [
      { label: 'المحافظة', value: r => r.label },
      { label: 'الطلبات', value: r => r.orders },
      { label: 'المبيعات (ج.م)', value: r => r.revenue, display: r => money(r.revenue) }
    ],
    totals: rows => ['الإجمالي', sum(rows, 'orders').toLocaleString('en-US'), money(sum(rows, 'revenue'))]
  },
  {
    id: 'tax',
    title: 'الضرائب',
    description: `ضريبة القيمة المضافة المحصّلة (${taxRate.value}%)`,
    icon: 'ph:receipt',
    rows: d => [...d.current].reverse().map(p => {
      // Prices include tax, so the tax is extracted from the gross amount
      const net = p.revenue / (1 + taxRate.value / 100)
      return { date: p.date, gross: p.revenue, net, tax: p.revenue - net }
    }),
    columns: [
      { label: 'التاريخ', value: r => r.date, display: r => formatShortDate(r.date) },
      { label: 'المبيعات شاملة الضريبة (ج.م)', value: r => r.gross, display: r => money(r.gross) },
      { label: 'المبيعات قبل الضريبة (ج.م)', value: r => round2(r.net), display: r => money(r.net) },
      { label: 'الضريبة (ج.م)', value: r => round2(r.tax), display: r => money(r.tax) }
    ],
    totals: rows => ['الإجمالي', money(sum(rows, 'gross')), money(sum(rows, 'net')), money(sum(rows, 'tax'))]
  }
])

const selectedId = ref('sales')
const selected = computed(() => reports.value.find(r => r.id === selectedId.value) || reports.value[0])
const rows = computed(() => (analytics.data ? selected.value.rows(analytics.data) : []))

const exportCsv = () => {
  const today = new Date().toISOString().slice(0, 10)
  downloadCsv(`report-${selected.value.id}-${analytics.period}d-${today}`, selected.value.columns, rows.value)
}

useHead({
  title: 'التقارير | لوحة التحكم'
})

onMounted(() => {
  if (!analytics.data) analytics.fetchAnalytics()
  if (!settings.settings) settings.fetchSettings()
})
</script>
