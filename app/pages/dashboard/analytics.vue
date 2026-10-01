<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <!-- Header + filter row (scopes every chart below) -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div class="flex items-center gap-2 text-sm text-muted mb-2">
            <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
            <Icon name="ph:caret-left" class="w-3 h-3" />
            <span class="text-primary-navy dark:text-white font-medium">التحليلات</span>
          </div>
          <h1 class="text-2xl font-black text-primary-navy dark:text-white font-ibm">التحليلات</h1>
          <p class="text-sm text-muted mt-1">أداء المتجر خلال آخر {{ store.period }} يوم مقارنة بالفترة التي قبلها.</p>
        </div>
        <PeriodSelector :model-value="store.period" @update:model-value="store.fetchAnalytics($event)" />
      </div>

      <!-- First load -->
      <div v-if="!data && store.loading" class="flex flex-col gap-6 animate-pulse">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        </div>
        <div class="h-80 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center shadow-sm">
        <Icon name="ph:warning-circle" class="w-16 h-16 text-danger mx-auto mb-4" />
        <h2 class="text-xl font-bold text-primary-navy dark:text-white mb-2">تعذر تحميل التحليلات</h2>
        <p class="text-muted mb-6">{{ store.error }}</p>
        <button @click="store.fetchAnalytics()" class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold text-sm">
          <Icon name="ph:arrow-clockwise-bold" class="w-4 h-4" />
          إعادة المحاولة
        </button>
      </div>

      <!-- Refetches keep the previous render dimmed instead of flashing skeletons -->
      <div v-else-if="data && totals && previousTotals" class="flex flex-col gap-6 transition-opacity" :class="{ 'opacity-50 pointer-events-none': store.loading }">
        <!-- KPIs -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <DashboardKpiCard title="المبيعات" :value="formatCurrency(totals.revenue)" :change="changeLabel(totals.revenue, previousTotals.revenue)" icon="ph:wallet" />
          <DashboardKpiCard title="الطلبات" :value="totals.orders.toLocaleString('en-US')" :change="changeLabel(totals.orders, previousTotals.orders)" icon="ph:shopping-bag" />
          <DashboardKpiCard title="متوسط قيمة الطلب" :value="formatCurrency(totals.aov)" :change="changeLabel(totals.aov, previousTotals.aov)" icon="ph:receipt" />
          <DashboardKpiCard title="معدل التحويل" :value="`${totals.conversionRate.toFixed(2)}%`" :change="changeLabel(totals.conversionRate, previousTotals.conversionRate)" icon="ph:trend-up" />
        </div>

        <!-- Revenue trend -->
        <ChartCard
          title="المبيعات اليومية"
          :subtitle="`${formatCurrency(totals.revenue)} مقابل ${formatCurrency(previousTotals.revenue)} في الفترة السابقة`"
          :columns="trendColumns"
          :rows="trendRows"
        >
          <template #legend>
            <div class="hidden sm:flex items-center gap-4 text-xs font-bold text-muted">
              <span class="flex items-center gap-1.5"><span class="w-3 h-0.5 rounded bg-primary"></span>الفترة الحالية</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-0.5 rounded bg-slate-400 dark:bg-slate-500"></span>الفترة السابقة</span>
            </div>
          </template>
          <RevenueTrendChart :current="data.current" :previous="data.previous" />
        </ChartCard>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard
            title="الطلبات اليومية"
            :subtitle="`${totals.orders.toLocaleString('en-US')} طلب خلال الفترة`"
            :columns="ordersColumns"
            :rows="trendRows"
          >
            <BarChart
              :labels="data.current.map(p => formatShortDate(p.date))"
              :values="data.current.map(p => p.orders)"
              series-label="الطلبات"
            />
          </ChartCard>

          <ChartCard
            title="مسار الشراء"
            :subtitle="`${totals.conversionRate.toFixed(2)}% من الزيارات انتهت بطلب`"
            :columns="funnelColumns"
            :rows="data.funnel"
          >
            <ConversionFunnel :steps="data.funnel" />
          </ChartCard>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard
            title="المبيعات حسب القسم"
            :subtitle="topShare(data.categories)"
            :columns="breakdownColumns('القسم')"
            :rows="data.categories"
          >
            <BarChart
              horizontal
              :labels="data.categories.map(c => c.label)"
              :values="data.categories.map(c => c.revenue)"
              series-label="المبيعات"
              :format-value="formatCurrency"
              :height="240"
            />
          </ChartCard>

          <ChartCard
            title="المبيعات حسب المحافظة"
            :subtitle="topShare(data.regions)"
            :columns="breakdownColumns('المحافظة')"
            :rows="data.regions"
          >
            <BarChart
              horizontal
              :labels="data.regions.map(r => r.label)"
              :values="data.regions.map(r => r.revenue)"
              series-label="المبيعات"
              :format-value="formatCurrency"
              :height="240"
            />
          </ChartCard>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <!-- Top products -->
          <div class="xl:col-span-2 bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
            <div class="px-5 py-4 border-b border-border-light dark:border-border-dark">
              <h2 class="font-bold text-primary-navy dark:text-white font-ibm">المنتجات الأكثر مبيعاً</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-right">
                <thead class="bg-gray-50 dark:bg-gray-800/50 text-muted">
                  <tr>
                    <th class="px-5 py-2.5 font-bold">المنتج</th>
                    <th class="px-5 py-2.5 font-bold">القسم</th>
                    <th class="px-5 py-2.5 font-bold">الكمية</th>
                    <th class="px-5 py-2.5 font-bold">المبيعات</th>
                    <th class="px-5 py-2.5 font-bold w-40">من الإجمالي</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border-light dark:divide-border-dark">
                  <tr v-for="product in data.products" :key="product.name">
                    <td class="px-5 py-3 font-bold text-primary-navy dark:text-white whitespace-nowrap">{{ product.name }}</td>
                    <td class="px-5 py-3 text-muted whitespace-nowrap">{{ product.category }}</td>
                    <td class="px-5 py-3 text-primary-navy dark:text-white tabular-nums">{{ product.units.toLocaleString('en-US') }}</td>
                    <td class="px-5 py-3 text-primary-navy dark:text-white tabular-nums whitespace-nowrap">{{ formatCurrency(product.revenue) }}</td>
                    <td class="px-5 py-3">
                      <div class="flex items-center gap-2">
                        <div class="flex-1 h-1.5 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div class="h-full rounded bg-primary" :style="{ width: `${(product.revenue / totals.revenue) * 100}%` }"></div>
                        </div>
                        <span class="text-xs text-muted tabular-nums w-10">{{ ((product.revenue / totals.revenue) * 100).toFixed(1) }}%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Customers -->
          <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-5 flex flex-col gap-5">
            <h2 class="font-bold text-primary-navy dark:text-white font-ibm">العملاء</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-xs text-muted font-bold mb-1">عملاء جدد</div>
                <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ data.newCustomers.toLocaleString('en-US') }}</div>
              </div>
              <div>
                <div class="text-xs text-muted font-bold mb-1">عملاء عائدون</div>
                <div class="text-2xl font-black text-primary-navy dark:text-white font-ibm">{{ data.returningCustomers.toLocaleString('en-US') }}</div>
              </div>
            </div>
            <div>
              <div class="h-2 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div class="h-full rounded bg-primary" :style="{ width: `${returningShare}%` }"></div>
              </div>
              <p class="text-xs text-muted mt-2">
                <span class="font-bold text-primary-navy dark:text-white">{{ returningShare.toFixed(0) }}%</span>
                من الطلبات جاءت من عملاء اشتروا قبل كده
              </p>
            </div>
            <NuxtLink to="/dashboard/customers" class="mt-auto text-sm font-bold text-primary hover:underline">عرض العملاء</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAnalyticsStore, type BreakdownRow } from '~/stores/analytics'
import { formatCurrency, formatShortDate, percentChange, type TableColumn } from '~/composables/useChartTheme'
import DashboardKpiCard from '~/components/dashboard/DashboardKpiCard.vue'
import ChartCard from '~/components/dashboard/analytics/ChartCard.vue'
import RevenueTrendChart from '~/components/dashboard/analytics/RevenueTrendChart.vue'
import BarChart from '~/components/dashboard/analytics/BarChart.vue'
import ConversionFunnel from '~/components/dashboard/analytics/ConversionFunnel.vue'
import PeriodSelector from '~/components/dashboard/analytics/PeriodSelector.vue'

const store = useAnalyticsStore()

const data = computed(() => store.data)
const totals = computed(() => store.totals)
const previousTotals = computed(() => store.previousTotals)

const changeLabel = (current: number, previous: number) => {
  const change = percentChange(current, previous)
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
}

const returningShare = computed(() => {
  if (!data.value) return 0
  const total = data.value.newCustomers + data.value.returningCustomers
  return total ? (data.value.returningCustomers / total) * 100 : 0
})

const topShare = (rows: BreakdownRow[]) => {
  const total = rows.reduce((s, r) => s + r.revenue, 0)
  const top = [...rows].sort((a, b) => b.revenue - a.revenue)[0]
  return top && total ? `${top.label} ${((top.revenue / total) * 100).toFixed(0)}% من المبيعات` : ''
}

const trendRows = computed(() =>
  (data.value?.current || []).map((p, i) => ({
    ...p,
    previousRevenue: data.value?.previous[i]?.revenue ?? 0
  }))
)

const trendColumns: TableColumn[] = [
  { key: 'date', label: 'اليوم', format: v => formatShortDate(v) },
  { key: 'revenue', label: 'المبيعات', format: v => formatCurrency(v) },
  { key: 'previousRevenue', label: 'الفترة السابقة', format: v => formatCurrency(v) }
]

const ordersColumns: TableColumn[] = [
  { key: 'date', label: 'اليوم', format: v => formatShortDate(v) },
  { key: 'orders', label: 'الطلبات' },
  { key: 'visits', label: 'الزيارات', format: v => v.toLocaleString('en-US') }
]

const funnelColumns: TableColumn[] = [
  { key: 'label', label: 'الخطوة' },
  { key: 'count', label: 'العدد', format: v => v.toLocaleString('en-US') }
]

const breakdownColumns = (label: string): TableColumn[] => [
  { key: 'label', label },
  { key: 'orders', label: 'الطلبات', format: v => v.toLocaleString('en-US') },
  { key: 'revenue', label: 'المبيعات', format: v => formatCurrency(v) }
]

useHead({
  title: 'التحليلات | لوحة التحكم'
})

onMounted(() => {
  if (!store.data) store.fetchAnalytics()
})
</script>
