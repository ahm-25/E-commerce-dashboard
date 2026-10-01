import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import type { PermissionModule } from '~/stores/system'

export type NotificationType = 'order' | 'stock' | 'review' | 'customer' | 'payment' | 'system'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  link: string | null
  createdAt: string
  read: boolean
}

export interface ChannelPreference {
  inApp: boolean
  email: boolean
}

export const NOTIFICATION_TYPES: Record<NotificationType, { label: string, description: string, icon: string, iconClass: string, module: PermissionModule | null }> = {
  order: { label: 'الطلبات', description: 'طلب جديد، إلغاء، أو طلب استرجاع', icon: 'ph:shopping-bag-bold', iconClass: 'bg-primary/10 text-primary', module: 'orders' },
  stock: { label: 'المخزون', description: 'منتج قرب يخلص أو خلص', icon: 'ph:package-bold', iconClass: 'bg-warning/10 text-warning', module: 'products' },
  review: { label: 'التقييمات', description: 'تقييم جديد بانتظار المراجعة', icon: 'ph:star-bold', iconClass: 'bg-warning/10 text-warning', module: 'reviews' },
  customer: { label: 'العملاء', description: 'تسجيل عميل جديد', icon: 'ph:user-plus-bold', iconClass: 'bg-success/10 text-success', module: 'customers' },
  payment: { label: 'المدفوعات', description: 'فشل دفع أو مشكلة في بوابة الدفع', icon: 'ph:credit-card-bold', iconClass: 'bg-danger/10 text-danger', module: 'storeSettings' },
  system: { label: 'النظام', description: 'تحديثات الحساب والأمان', icon: 'ph:info-bold', iconClass: 'bg-gray-100 dark:bg-gray-800 text-muted', module: null }
}

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString()

// TODO: Replace with the API (and a websocket/SSE stream for live updates)
const seedNotifications = (): AppNotification[] => [
  { id: 'n1', type: 'order', title: 'طلب جديد رقم EDX-10482', body: 'أحمد محمد طلب 3 منتجات بإجمالي 2,450 ج.م', link: '/dashboard/orders/1', createdAt: minutesAgo(4), read: false },
  { id: 'n2', type: 'stock', title: 'مخزون منخفض: ساعة ذكية', body: 'فاضل 8 قطع بس', link: '/dashboard/inventory', createdAt: minutesAgo(35), read: false },
  { id: 'n3', type: 'review', title: 'تقييم جديد بانتظار المراجعة', body: 'أحمد محمد قيّم Samsung Galaxy S24 Ultra بـ 5 نجوم', link: '/dashboard/reviews', createdAt: minutesAgo(80), read: false },
  { id: 'n4', type: 'payment', title: 'بوابة Paymob تحتاج إعداد', body: 'المحافظ الإلكترونية مش هتظهر للعملاء لحد ما تكمّل ربط المفاتيح', link: '/dashboard/store/payments', createdAt: minutesAgo(60 * 5), read: false },
  { id: 'n5', type: 'customer', title: 'عميل جديد', body: 'نور الدين ياسر سجّل في المتجر', link: '/dashboard/customers', createdAt: minutesAgo(60 * 9), read: true },
  { id: 'n6', type: 'order', title: 'طلب ملغي رقم EDX-10475', body: 'العميل ألغى الطلب قبل الشحن', link: '/dashboard/orders', createdAt: minutesAgo(60 * 26), read: true },
  { id: 'n7', type: 'stock', title: 'نفد المخزون: كيبورد ميكانيكي', body: 'المنتج اتخفى من المتجر تلقائياً', link: '/dashboard/inventory', createdAt: minutesAgo(60 * 30), read: true },
  { id: 'n8', type: 'system', title: 'تسجيل دخول من جهاز جديد', body: 'Safari على iPhone من القاهرة', link: '/dashboard/system-settings?tab=security', createdAt: minutesAgo(60 * 50), read: true },
  { id: 'n9', type: 'order', title: 'طلب استرجاع رقم EDX-10460', body: 'العميل طلب استرجاع منتج واحد', link: '/dashboard/orders', createdAt: minutesAgo(60 * 24 * 4), read: true }
]

const defaultPreferences = (): Record<NotificationType, ChannelPreference> => ({
  order: { inApp: true, email: true },
  stock: { inApp: true, email: true },
  review: { inApp: true, email: false },
  customer: { inApp: true, email: false },
  payment: { inApp: true, email: true },
  system: { inApp: true, email: true }
})

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    all: seedNotifications(),
    preferences: defaultPreferences()
  }),

  getters: {
    // Only types the user may see and has turned on in-app
    items(state): AppNotification[] {
      const auth = useAuthStore()
      return state.all
        .filter(n => {
          const module = NOTIFICATION_TYPES[n.type].module
          return (!module || auth.can(module)) && state.preferences[n.type].inApp
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },

    unreadCount(): number {
      return this.items.filter(n => !n.read).length
    }
  },

  actions: {
    markRead(id: string) {
      const n = this.all.find(x => x.id === id)
      if (n) n.read = true
    },

    markAllRead() {
      this.items.forEach(n => { n.read = true })
    },

    remove(id: string) {
      this.all = this.all.filter(n => n.id !== id)
    },

    async savePreferences(preferences: Record<NotificationType, ChannelPreference>) {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 600))
      this.preferences = structuredClone(preferences)
    }
  }
})
