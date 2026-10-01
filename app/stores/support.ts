import { defineStore } from 'pinia'
import { useSystemStore } from '~/stores/system'

export type TicketStatus = 'open' | 'awaiting_reply' | 'closed'
export type TicketCategory = 'orders' | 'payments' | 'shipping' | 'technical' | 'billing' | 'other'
export type TicketPriority = 'normal' | 'high' | 'urgent'

export interface TicketMessage {
  id: string
  author: 'me' | 'support'
  authorName: string
  body: string
  createdAt: string
}

export interface Ticket {
  id: string
  number: string
  subject: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  messages: TicketMessage[]
  createdAt: string
  updatedAt: string
}

export interface HelpArticle {
  id: string
  category: string
  question: string
  answer: string
  link?: { label: string, to: string }
}

export const TICKET_CATEGORIES: Record<TicketCategory, string> = {
  orders: 'الطلبات',
  payments: 'الدفع وبوابات الدفع',
  shipping: 'الشحن',
  technical: 'مشكلة تقنية',
  billing: 'الاشتراك والفواتير',
  other: 'أخرى'
}

export const TICKET_PRIORITIES: Record<TicketPriority, string> = {
  normal: 'عادية',
  high: 'مهمة',
  urgent: 'عاجلة (المتجر متوقف)'
}

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString()

export const HELP_ARTICLES: HelpArticle[] = [
  { id: 'a1', category: 'البداية', question: 'إزاي أضيف أول منتج؟', answer: 'من "المنتجات" اضغط "إضافة منتج"، اكتب الاسم والسعر والكمية وارفع الصور، وبعدين اختار "منشور" عشان يظهر للعملاء.', link: { label: 'إضافة منتج', to: '/dashboard/products/create' } },
  { id: 'a2', category: 'البداية', question: 'إزاي أغيّر شكل المتجر والألوان؟', answer: 'من "المظهر" تقدر تختار ثيم جاهز أو تغيّر الألوان والخطوط والشعار، وتشوف المعاينة قبل ما تنشر.', link: { label: 'المظهر', to: '/dashboard/store/appearance' } },
  { id: 'a3', category: 'الطلبات', question: 'إزاي أغيّر حالة الطلب؟', answer: 'افتح الطلب من "الطلبات"، ومن كارت "تحديث الحالة" اختار الحالة الجديدة. العميل بيوصله إشعار بالتغيير.' },
  { id: 'a4', category: 'الطلبات', question: 'العميل عايز يرجّع منتج، أعمل إيه؟', answer: 'افتح الطلب واضغط "استرجاع المبلغ". لو الدفع إلكتروني المبلغ بيرجع على نفس وسيلة الدفع خلال 5 إلى 14 يوم عمل حسب البنك.' },
  { id: 'a5', category: 'الدفع', question: 'إزاي أفعّل الدفع بالبطاقات والمحافظ؟', answer: 'من "طرق الدفع" ← "بوابات الدفع" اربط حسابك في Paymob أو Stripe بمفاتيح الـ API، وبعدها فعّل طريقة الدفع.', link: { label: 'طرق الدفع', to: '/dashboard/store/payments' } },
  { id: 'a6', category: 'الدفع', question: 'إمتى فلوس المبيعات بتوصلني؟', answer: 'بوابة الدفع هي اللي بتحوّل المبالغ لحسابك البنكي حسب دورة التحويل بتاعتها، وغالباً من يومين لأسبوع.' },
  { id: 'a7', category: 'الشحن', question: 'إزاي أحدد أسعار الشحن لكل محافظة؟', answer: 'من "الشحن" اعمل مناطق شحن، كل منطقة فيها محافظات وسعر ثابت أو حسب الوزن، وممكن تخليه مجاني فوق مبلغ معين.', link: { label: 'الشحن', to: '/dashboard/store/shipping' } },
  { id: 'a8', category: 'الشحن', question: 'العميل بيقول مفيش شحن لمحافظته', answer: 'المحافظة دي مش موجودة في أي منطقة شحن مفعّلة. صفحة الشحن بتعرض المحافظات اللي مالهاش شحن، ضيفها لمنطقة.' },
  { id: 'a9', category: 'الحساب', question: 'إزاي أضيف موظف وأحدد صلاحياته؟', answer: 'من "الإعدادات" ← "فريق العمل" ابعت دعوة بالإيميل واختار الدور. تقدر تعدّل صلاحيات كل دور من "الأدوار والصلاحيات".', link: { label: 'فريق العمل', to: '/dashboard/system-settings?tab=team' } },
  { id: 'a10', category: 'الحساب', question: 'نسيت كلمة المرور', answer: 'لو انت المالك تواصل معانا من تذكرة أو واتساب. لو موظف اطلب من مالك المتجر يبعتلك دعوة جديدة.' }
]

const seedTickets = (): Ticket[] => [
  {
    id: 't1', number: 'SUP-2041', subject: 'بوابة Paymob مش بتقبل المفاتيح', category: 'payments', priority: 'high', status: 'awaiting_reply',
    createdAt: minutesAgo(60 * 20), updatedAt: minutesAgo(60 * 3),
    messages: [
      { id: 'm1', author: 'me', authorName: 'أحمد محمد', body: 'حاولت أربط Paymob ودخلت الـ API key والـ integration ID بس بيقولي "مفاتيح غير صالحة".', createdAt: minutesAgo(60 * 20) },
      { id: 'm2', author: 'support', authorName: 'سارة - فريق الدعم', body: 'أهلاً أحمد، اتأكد إنك واخد المفاتيح من وضع Live مش Test، وإن الـ integration ID بتاع المحافظ مختلف عن بتاع البطاقات. لو المشكلة مكملة ابعتلنا صورة من الشاشة.', createdAt: minutesAgo(60 * 3) }
    ]
  },
  {
    id: 't2', number: 'SUP-1987', subject: 'استفسار عن تغيير الدومين', category: 'technical', priority: 'normal', status: 'closed',
    createdAt: minutesAgo(60 * 24 * 9), updatedAt: minutesAgo(60 * 24 * 7),
    messages: [
      { id: 'm3', author: 'me', authorName: 'أحمد محمد', body: 'عايز أربط دومين خاص بالمتجر، إيه الخطوات؟', createdAt: minutesAgo(60 * 24 * 9) },
      { id: 'm4', author: 'support', authorName: 'محمود - فريق الدعم', body: 'ضيف سجل CNAME يشاور على stores.edix.app من لوحة الدومين، وبعدها ابعتلنا اسم الدومين ونفعّله خلال ساعة.', createdAt: minutesAgo(60 * 24 * 8) },
      { id: 'm5', author: 'me', authorName: 'أحمد محمد', body: 'تمام اشتغل، شكراً.', createdAt: minutesAgo(60 * 24 * 7) }
    ]
  }
]

export const useSupportStore = defineStore('support', {
  state: () => ({
    tickets: seedTickets(),
    isNewTicketOpen: false
  }),

  getters: {
    ticketById: (state) => (id: string) => state.tickets.find(t => t.id === id) || null,
    openTicketsCount: (state) => state.tickets.filter(t => t.status !== 'closed').length,
    sortedTickets: (state) => [...state.tickets].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },

  actions: {
    async createTicket(input: { subject: string, category: TicketCategory, priority: TicketPriority, body: string }) {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800))
      const now = new Date().toISOString()
      const nextNumber = Math.max(...this.tickets.map(t => Number(t.number.split('-')[1])), 2000) + 1
      const ticket: Ticket = {
        id: `t-${Date.now()}`,
        number: `SUP-${nextNumber}`,
        subject: input.subject,
        category: input.category,
        priority: input.priority,
        status: 'open',
        createdAt: now,
        updatedAt: now,
        messages: [{ id: `m-${Date.now()}`, author: 'me', authorName: useSystemStore().profile.name, body: input.body, createdAt: now }]
      }
      this.tickets.unshift(ticket)
      return ticket
    },

    async reply(ticketId: string, body: string) {
      await new Promise(resolve => setTimeout(resolve, 600))
      const ticket = this.tickets.find(t => t.id === ticketId)
      if (!ticket) throw new Error('التذكرة غير موجودة')
      const now = new Date().toISOString()
      ticket.messages.push({ id: `m-${Date.now()}`, author: 'me', authorName: useSystemStore().profile.name, body, createdAt: now })
      // Replying reopens a closed ticket and puts it back in support's queue
      ticket.status = 'open'
      ticket.updatedAt = now
    },

    async closeTicket(ticketId: string) {
      const ticket = this.tickets.find(t => t.id === ticketId)
      if (ticket) {
        ticket.status = 'closed'
        ticket.updatedAt = new Date().toISOString()
      }
    }
  }
})
