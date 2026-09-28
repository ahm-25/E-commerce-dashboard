<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-sm text-text-muted">
        <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">لوحة التحكم</NuxtLink>
        <Icon name="ph:caret-left" class="w-4 h-4" />
        <NuxtLink to="/dashboard/orders" class="hover:text-primary transition-colors">الطلبات</NuxtLink>
        <Icon name="ph:caret-left" class="w-4 h-4" />
        <span class="text-text font-bold">الطلب {{ orderId }}</span>
      </div>

      <!-- Loading State -->
      <OrderDetailsSkeleton v-if="ordersStore.loadingOrder" />

      <!-- Error State -->
      <div v-else-if="ordersStore.orderError" class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center shadow-sm">
        <Icon name="ph:warning-circle" class="w-16 h-16 text-danger mx-auto mb-4" />
        <h1 class="text-2xl font-semibold mb-2">تعذر تحميل بيانات الطلب</h1>
        <p class="text-text-muted max-w-md mx-auto mb-6">{{ ordersStore.orderError }}</p>
        <button @click="loadOrder" class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium">
          <Icon name="ph:arrow-clockwise" class="w-5 h-5" />
          إعادة المحاولة
        </button>
      </div>

      <!-- Not Found State -->
      <div v-else-if="!order" class="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-12 text-center shadow-sm">
        <Icon name="ph:magnifying-glass" class="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
        <h1 class="text-2xl font-semibold mb-2">الطلب غير موجود</h1>
        <p class="text-text-muted max-w-md mx-auto mb-6">
          لم نتمكن من العثور على الطلب المطلوب. قد يكون الطلب قد تم حذفه أو لم يعد متاحًا.
        </p>
        <NuxtLink to="/dashboard/orders" class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium">
          العودة إلى الطلبات
        </NuxtLink>
      </div>

      <!-- Order Content -->
      <template v-else>
        <OrderDetailsHeader 
          :order="order" 
          @print-invoice="printInvoice"
          @print-order="printOrder"
          @cancel-order="showCancelDialog = true"
          @refund-order="showRefundDialog = true"
        />
        
        <OrderStatusStepper :order="order" />

        <div class="flex flex-col xl:flex-row gap-6">
          <!-- Main Content -->
          <div class="flex-1 min-w-0">
            <OrderItems :order="order" />
            <OrderPricingSummary :order="order" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <CustomerInfoCard :order="order" />
              <div class="space-y-6">
                <PaymentInfoCard :order="order" />
                <ShippingInfoCard :order="order" />
              </div>
            </div>
            
            <OrderTimeline :order="order" />
          </div>

          <!-- Sidebar -->
          <div class="w-full xl:w-[380px] shrink-0 space-y-6">
            <OrderStatusUpdate 
              :order="order"
              :isUpdating="isUpdatingStatus"
              @update-status="handleUpdateStatus"
              @cancel="showCancelDialog = true"
              @refund="showRefundDialog = true"
            />
            
            <OrderNotes 
              :order="order"
              @add-note="showNoteDialog = true"
            />
            
            <OrderMetadataCard :order="order" />
          </div>
        </div>
      </template>

      <!-- Dialogs -->
      
      <!-- Cancel Dialog -->
      <div v-if="showCancelDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div class="bg-white dark:bg-surface-dark rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-danger">إلغاء الطلب</h3>
            <button @click="showCancelDialog = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <Icon name="ph:x" class="w-5 h-5" />
            </button>
          </div>
          <p class="text-text mb-4">
            هل أنت متأكد من إلغاء الطلب {{ order?.orderNumber }}؟
            سيتم تحديث حالة الطلب إلى "ملغي".
          </p>
          <div class="mb-6">
            <label class="block text-sm font-medium text-text mb-2">سبب الإلغاء</label>
            <textarea 
              v-model="cancelReason"
              rows="3"
              class="w-full bg-gray-50 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-danger"
              placeholder="اكتب سبب الإلغاء هنا..."
            ></textarea>
          </div>
          <div class="flex items-center gap-3">
            <button @click="showCancelDialog = false" class="flex-1 py-2.5 px-4 rounded-lg border border-border-light dark:border-border-dark font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              تراجع
            </button>
            <button 
              @click="handleCancel"
              :disabled="!cancelReason.trim() || isProcessingAction"
              class="flex-1 py-2.5 px-4 rounded-lg bg-danger text-white font-medium hover:bg-danger/90 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Icon v-if="isProcessingAction" name="ph:spinner" class="w-5 h-5 animate-spin" />
              تأكيد الإلغاء
            </button>
          </div>
        </div>
      </div>

      <!-- Add Note Dialog -->
      <div v-if="showNoteDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div class="bg-white dark:bg-surface-dark rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-primary-navy dark:text-white">إضافة ملاحظة جديدة</h3>
            <button @click="showNoteDialog = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <Icon name="ph:x" class="w-5 h-5" />
            </button>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-text mb-2">نوع الملاحظة</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="newNote.type" value="internal" class="text-primary focus:ring-primary">
                <span class="text-sm">ملاحظة داخلية</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="newNote.type" value="customer" class="text-primary focus:ring-primary">
                <span class="text-sm">ملاحظة للعميل</span>
              </label>
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-text mb-2">تفاصيل الملاحظة</label>
            <textarea 
              v-model="newNote.content"
              rows="4"
              class="w-full bg-gray-50 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="اكتب ملاحظتك هنا..."
            ></textarea>
          </div>
          <div class="flex items-center gap-3">
            <button @click="showNoteDialog = false" class="flex-1 py-2.5 px-4 rounded-lg border border-border-light dark:border-border-dark font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              إلغاء
            </button>
            <button 
              @click="handleAddNote"
              :disabled="!newNote.content.trim() || isProcessingAction"
              class="flex-1 py-2.5 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Icon v-if="isProcessingAction" name="ph:spinner" class="w-5 h-5 animate-spin" />
              حفظ الملاحظة
            </button>
          </div>
        </div>
      </div>

    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersStore } from '~/stores/orders'
import OrderDetailsHeader from '~/components/dashboard/orders/details/OrderDetailsHeader.vue'
import OrderStatusStepper from '~/components/dashboard/orders/details/OrderStatusStepper.vue'
import OrderItems from '~/components/dashboard/orders/details/OrderItems.vue'
import OrderPricingSummary from '~/components/dashboard/orders/details/OrderPricingSummary.vue'
import CustomerInfoCard from '~/components/dashboard/orders/details/CustomerInfoCard.vue'
import PaymentInfoCard from '~/components/dashboard/orders/details/PaymentInfoCard.vue'
import ShippingInfoCard from '~/components/dashboard/orders/details/ShippingInfoCard.vue'
import OrderTimeline from '~/components/dashboard/orders/details/OrderTimeline.vue'
import OrderStatusUpdate from '~/components/dashboard/orders/details/OrderStatusUpdate.vue'
import OrderNotes from '~/components/dashboard/orders/details/OrderNotes.vue'
import OrderMetadataCard from '~/components/dashboard/orders/details/OrderMetadataCard.vue'
import OrderDetailsSkeleton from '~/components/dashboard/orders/details/OrderDetailsSkeleton.vue'

const route = useRoute()
const ordersStore = useOrdersStore()
const orderId = computed(() => route.params.id as string)

const order = computed(() => ordersStore.currentOrder)

const loadOrder = async () => {
  await ordersStore.fetchOrder(orderId.value)
}

onMounted(() => {
  loadOrder()
})

useHead({
  title: computed(() => order.value ? `الطلب ${order.value.orderNumber} | لوحة التحكم` : 'تفاصيل الطلب | لوحة التحكم')
})

// Dialogs state
const showCancelDialog = ref(false)
const cancelReason = ref('')
const showRefundDialog = ref(false)
const showNoteDialog = ref(false)
const newNote = ref<{ type: 'internal' | 'customer', content: string }>({
  type: 'internal',
  content: ''
})

const isUpdatingStatus = ref(false)
const isProcessingAction = ref(false)

const handleUpdateStatus = async (newStatus: string) => {
  isUpdatingStatus.value = true
  try {
    await ordersStore.updateOrderStatus(orderId.value, newStatus)
    // TODO: show success toast
  } catch (error) {
    // TODO: show error toast
  } finally {
    isUpdatingStatus.value = false
  }
}

const handleCancel = async () => {
  if (!cancelReason.value.trim()) return
  
  isProcessingAction.value = true
  try {
    await ordersStore.cancelOrder(orderId.value, cancelReason.value)
    showCancelDialog.value = false
    cancelReason.value = ''
    // TODO: show success toast
  } catch (error) {
    // TODO: show error toast
  } finally {
    isProcessingAction.value = false
  }
}

const handleAddNote = async () => {
  if (!newNote.value.content.trim()) return
  
  isProcessingAction.value = true
  try {
    await ordersStore.addOrderNote(orderId.value, {
      content: newNote.value.content,
      type: newNote.value.type
    })
    showNoteDialog.value = false
    newNote.value.content = ''
    // TODO: show success toast
  } catch (error) {
    // TODO: show error toast
  } finally {
    isProcessingAction.value = false
  }
}

const printInvoice = () => {
  window.print()
}

const printOrder = () => {
  window.print()
}
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  .dashboard-layout {
    display: none;
  }
  /* Show only the main content when printing */
  .min-w-0, .min-w-0 * {
    visibility: visible;
  }
  .min-w-0 {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .shrink-0 {
    display: none;
  }
}
</style>
