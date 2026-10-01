<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-muted">
        <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
        <Icon name="ph:caret-left" class="w-4 h-4" />
        <NuxtLink to="/dashboard/customers" class="hover:text-primary transition-colors">العملاء</NuxtLink>
        <Icon name="ph:caret-left" class="w-4 h-4" />
        <span class="font-bold text-primary-navy dark:text-white">{{ customer?.name || customerId }}</span>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        <div class="h-80 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        <div class="lg:col-span-2 flex flex-col gap-6">
          <div class="h-28 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
          <div class="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="customersStore.error" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 shadow-sm">
        <CustomersErrorState :error="customersStore.error" @retry="loadData" />
      </div>

      <!-- Not Found State -->
      <div v-else-if="!customer" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center shadow-sm">
        <Icon name="ph:user-circle-dashed" class="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
        <h1 class="text-2xl font-bold text-primary-navy dark:text-white mb-2">العميل غير موجود</h1>
        <p class="text-muted max-w-md mx-auto mb-6">
          لم نتمكن من العثور على هذا العميل. قد يكون تم حذفه أو أن الرابط غير صحيح.
        </p>
        <NuxtLink to="/dashboard/customers" class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold text-sm">
          العودة إلى العملاء
        </NuxtLink>
      </div>

      <!-- Customer Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <!-- Profile Card -->
        <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-6 flex flex-col gap-6">
          <div class="flex flex-col items-center text-center">
            <div class="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl mb-4 shadow-inner">
              <img v-if="customer.avatar" :src="customer.avatar" :alt="customer.name" class="w-full h-full rounded-full object-cover" />
              <template v-else>{{ customer.name.charAt(0) }}</template>
            </div>
            <h1 class="text-xl font-bold text-primary-navy dark:text-white mb-1 font-ibm">{{ customer.name }}</h1>
            <div class="text-muted text-sm mb-3">{{ customer.id }}</div>
            <div class="flex items-center gap-2">
              <CustomerStatusBadge :status="customer.status" />
              <CustomerTypeBadge v-if="customer.customerType" :type="customer.customerType" />
            </div>
          </div>

          <div class="flex gap-2">
            <button
              v-if="canManage" @click="customersStore.openEditCustomer(customer)"
              class="flex-1 bg-gray-50 dark:bg-gray-800 text-primary-navy dark:text-white border border-border-light dark:border-border-dark rounded-xl py-2.5 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon name="ph:pencil-simple-bold" class="w-4 h-4" />
              تعديل
            </button>
            <a
              v-if="customer.email"
              :href="`mailto:${customer.email}`"
              class="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl py-2.5 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Icon name="ph:envelope-simple-bold" class="w-4 h-4" />
              مراسلة
            </a>
          </div>

          <div class="h-px bg-border-light dark:bg-border-dark"></div>

          <!-- Contact Info -->
          <div class="flex flex-col gap-4">
            <h2 class="font-bold text-primary-navy dark:text-white flex items-center gap-2">
              <Icon name="ph:address-book-bold" class="w-5 h-5 text-muted" />
              بيانات التواصل
            </h2>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex flex-col gap-3">
              <div v-for="field in contactFields" :key="field.label" class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-white dark:bg-surface-dark flex items-center justify-center text-muted shadow-sm shrink-0">
                  <Icon :name="field.icon" class="w-4 h-4" />
                </div>
                <div class="flex flex-col gap-0.5 min-w-0">
                  <span class="text-xs text-muted font-bold">{{ field.label }}</span>
                  <span class="text-sm font-medium text-primary-navy dark:text-white truncate" :dir="field.ltr ? 'ltr' : undefined">{{ field.value || 'غير متوفر' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Column -->
        <div class="lg:col-span-2 flex flex-col gap-6">
          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="stat in stats" :key="stat.label" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm p-4 flex flex-col gap-1">
              <span class="text-xs text-muted font-bold">{{ stat.label }}</span>
              <span class="text-xl font-black text-primary-navy dark:text-white font-ibm">
                {{ stat.value }}
                <span v-if="stat.unit" class="text-xs">{{ stat.unit }}</span>
              </span>
            </div>
          </div>

          <!-- Orders -->
          <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
              <h2 class="font-bold text-primary-navy dark:text-white flex items-center gap-2">
                <Icon name="ph:shopping-bag-bold" class="w-5 h-5 text-muted" />
                الطلبات
              </h2>
              <NuxtLink :to="`/dashboard/orders?customerId=${customer.id}`" class="text-sm text-primary hover:underline font-medium">
                عرض الكل
              </NuxtLink>
            </div>

            <div v-if="customerOrders.length === 0" class="p-8 text-center text-sm text-muted">
              لا توجد طلبات لهذا العميل حتى الآن
            </div>
            <div v-else class="overflow-x-auto">
              <table class="w-full text-sm text-right">
                <thead class="bg-gray-50 dark:bg-gray-800/50 text-muted">
                  <tr>
                    <th class="px-6 py-3 font-bold">رقم الطلب</th>
                    <th class="px-6 py-3 font-bold">التاريخ</th>
                    <th class="px-6 py-3 font-bold">الحالة</th>
                    <th class="px-6 py-3 font-bold">الدفع</th>
                    <th class="px-6 py-3 font-bold">الإجمالي</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border-light dark:divide-border-dark">
                  <tr v-for="order in customerOrders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td class="px-6 py-3">
                      <NuxtLink :to="`/dashboard/orders/${order.id}`" class="font-bold text-primary-navy dark:text-white hover:text-primary" dir="ltr">
                        {{ order.orderNumber }}
                      </NuxtLink>
                    </td>
                    <td class="px-6 py-3 text-muted">{{ order.createdAt }}</td>
                    <td class="px-6 py-3"><OrderStatusBadge :status="order.status" /></td>
                    <td class="px-6 py-3"><OrderPaymentBadge :status="order.paymentStatus" /></td>
                    <td class="px-6 py-3 font-bold text-primary-navy dark:text-white">{{ order.total.toLocaleString() }} {{ order.currency }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Reviews -->
          <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-border-light dark:border-border-dark">
              <h2 class="font-bold text-primary-navy dark:text-white flex items-center gap-2">
                <Icon name="ph:star-bold" class="w-5 h-5 text-muted" />
                التقييمات
              </h2>
            </div>

            <div v-if="customerReviews.length === 0" class="p-8 text-center text-sm text-muted">
              لم يكتب هذا العميل أي تقييمات
            </div>
            <div v-else class="divide-y divide-border-light dark:divide-border-dark">
              <div v-for="review in customerReviews" :key="review.id" class="px-6 py-4 flex flex-col gap-2">
                <div class="flex items-center justify-between gap-4">
                  <span class="font-bold text-primary-navy dark:text-white text-sm truncate">{{ review.productName }}</span>
                  <ReviewStatusBadge :status="review.status" />
                </div>
                <div class="flex items-center gap-0.5 text-warning">
                  <Icon v-for="n in 5" :key="n" :name="n <= review.rating ? 'ph:star-fill' : 'ph:star'" class="w-4 h-4" />
                </div>
                <p class="text-sm text-muted line-clamp-2">{{ review.content }}</p>
                <span class="text-xs text-muted">{{ formatDate(review.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CustomerForm />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { computed, onMounted } from 'vue'
import { useCustomersStore } from '~/stores/customers'
import { useOrdersStore } from '~/stores/orders'
import { useReviewsStore } from '~/stores/reviews'
import CustomerStatusBadge from '~/components/dashboard/customers/CustomerStatusBadge.vue'
import CustomerTypeBadge from '~/components/dashboard/customers/CustomerTypeBadge.vue'
import CustomersErrorState from '~/components/dashboard/customers/CustomersErrorState.vue'
import CustomerForm from '~/components/dashboard/customers/CustomerForm.vue'
import OrderStatusBadge from '~/components/dashboard/orders/OrderStatusBadge.vue'
import OrderPaymentBadge from '~/components/dashboard/orders/OrderPaymentBadge.vue'
import ReviewStatusBadge from '~/components/dashboard/reviews/ReviewStatusBadge.vue'

const route = useRoute()
const customersStore = useCustomersStore()
const ordersStore = useOrdersStore()
const reviewsStore = useReviewsStore()

const customerId = computed(() => route.params.id as string)
const customer = computed(() => customersStore.customerById(customerId.value))

const isLoading = computed(() => customersStore.loading || ordersStore.loading || reviewsStore.loading)

const customerOrders = computed(() =>
  ordersStore.orders.filter(o => o.customer.id === customerId.value)
)

const customerReviews = computed(() =>
  reviewsStore.reviews.filter(r => r.customerId === customerId.value)
)

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: 'short', day: 'numeric' })

const contactFields = computed(() => {
  if (!customer.value) return []
  return [
    { label: 'البريد الإلكتروني', icon: 'ph:envelope-simple-bold', value: customer.value.email, ltr: true },
    { label: 'رقم الهاتف', icon: 'ph:phone-bold', value: customer.value.phone, ltr: true },
    { label: 'تاريخ التسجيل', icon: 'ph:calendar-blank-bold', value: formatDate(customer.value.createdAt) }
  ]
})

const stats = computed(() => {
  if (!customer.value) return []
  const c = customer.value
  const avgOrder = c.ordersCount > 0 ? Math.round(c.totalSpent / c.ordersCount) : 0
  return [
    { label: 'عدد الطلبات', value: c.ordersCount },
    { label: 'إجمالي الإنفاق', value: c.totalSpent.toLocaleString(), unit: c.currency },
    { label: 'متوسط الطلب', value: avgOrder.toLocaleString(), unit: c.currency },
    { label: 'آخر طلب', value: c.lastOrder ? formatDate(c.lastOrder.createdAt) : '—' }
  ]
})

const loadData = () => {
  const tasks: Promise<unknown>[] = []
  if (customersStore.customers.length === 0 || customersStore.error) tasks.push(customersStore.fetchCustomers())
  if (ordersStore.orders.length === 0) tasks.push(ordersStore.fetchOrders())
  if (reviewsStore.reviews.length === 0) tasks.push(reviewsStore.fetchReviews())
  return Promise.all(tasks)
}

useHead({
  title: computed(() => `${customer.value?.name || 'العميل'} | لوحة التحكم`)
})

onMounted(() => {
  loadData()
})

const canManage = useCanManage('customers')
</script>
