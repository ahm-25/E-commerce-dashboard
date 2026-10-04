import type { Review } from '~/stores/reviews'
import type { OrderDetails } from '~/stores/orders'
import type { StoredProduct } from './catalog'

// Reviews are stored with the product id only; product name/image/SKU are joined on read,
// so renaming a product doesn't leave stale copies behind.

export type ReviewStatus = Review['status']

export interface StoredReview {
  id: string
  productId: string
  customerId: string | null // null for guests
  customerName: string
  customerEmail?: string
  rating: number
  title?: string
  content: string
  verifiedPurchase: boolean
  status: ReviewStatus
  reply?: { id: string, content: string, createdAt: string, updatedAt?: string, authorName: string }
  createdAt: string
  updatedAt: string
}

export class ReviewError extends Error {}

// ---------- Seed ----------

const TEXTS: Record<number, string[]> = {
  5: [
    'الخامة ممتازة والتشطيب نظيف جداً، والحجم مناسب للاستخدام اليومي. أنصح بها بشدة.',
    'وصلت في ميعادها والتغليف كان محترم. شكلها في الحقيقة أحلى من الصور.',
    'تاني مرة أطلب من المتجر والجودة ثابتة. شكراً على الاهتمام.',
    'اللون مطابق للصور تماماً والجلد طري. تستاهل كل جنيه.'
  ],
  4: [
    'المنتج حلو والخامة كويسة، بس التوصيل اتأخر يوم عن المتوقع.',
    'عملية جداً وفيها مساحة كبيرة، كنت أتمنى يكون فيها جيب داخلي زيادة.',
    'جودة كويسة مقابل السعر، والتعامل مع خدمة العملاء كان سريع.'
  ],
  3: [
    'المنتج مقبول، اللون أفتح شوية من الصور.',
    'كويسة بس السلسلة محتاجة تكون أتقل من كده.'
  ],
  2: ['المقاس أصغر من المتوقع، ومش مناسب للابتوب زي ما كنت فاكر.'],
  1: ['وصلتني فيها خدش في الجنب، وطلبت استبدال.']
}

const NAMES = ['منى عبد الله', 'أحمد محمود', 'سارة أحمد', 'ياسمين علي', 'محمد حسن', 'نورهان سمير', 'كريم عادل', 'هبة مصطفى', 'عمر خالد', 'دينا فؤاد', 'مريم ياسر', 'مصطفى إبراهيم']

// [productId, ratings...]: one review per rating, oldest first
const SEED: [string, ...number[]][] = [
  ['p-luxury-leather', 5, 5, 4, 5, 3, 5],
  ['p-classic-tote', 5, 4, 4],
  ['p-mini-handbag', 5, 4],
  ['p-structured-bag', 5, 5],
  ['p-black-crossbody', 4, 5, 3],
  ['p-stylish-shoulder', 5, 5, 5, 4],
  ['p-chain-shoulder', 4, 3],
  ['p-comfort-backpack', 5, 4, 2],
  ['p-laptop-backpack', 4, 5, 2],
  ['p-evening-clutch', 5, 5, 4],
  ['p-pearl-clutch', 5],
  ['p-leather-wallet', 5, 4, 5, 1],
  ['p-card-holder', 4, 5]
]

export const seedReviews = (): StoredReview[] => {
  const reviews: StoredReview[] = []
  let n = 0
  const base = Date.UTC(2026, 8, 30)

  for (const [productId, ...ratings] of SEED) {
    ratings.forEach((rating, i) => {
      n++
      const createdAt = new Date(base - (ratings.length - i) * 4 * 86_400_000 - n * 3_600_000).toISOString()
      const texts = TEXTS[rating]!
      const name = NAMES[n % NAMES.length]!
      // The newest few are waiting for moderation; low ratings get a reply from the store
      const status: ReviewStatus = n % 11 === 0 ? 'pending' : rating === 1 ? 'hidden' : 'approved'

      reviews.push({
        id: `REV-${10400 + n}`,
        productId,
        customerId: name === 'أحمد محمود' ? 'usr_123' : `c-seed-${n}`,
        customerName: name,
        rating,
        content: texts[n % texts.length]!,
        verifiedPurchase: n % 3 !== 0,
        status,
        reply: rating <= 3 && status === 'approved'
          ? { id: `rep-${n}`, content: 'شكراً على ملاحظتك، تواصلنا معك هاتفياً لحل المشكلة.', createdAt, authorName: 'إدارة المتجر' }
          : undefined,
        createdAt,
        updatedAt: createdAt
      })
    })
  }
  // Two fresh ones so the "pending" tab isn't empty on a new install
  const now = new Date(base).toISOString()
  reviews.push(
    { id: 'REV-10498', productId: 'p-evening-clutch', customerId: null, customerName: 'رنا شريف', rating: 5, title: 'أحلى كلاتش', content: 'لبستها في فرح أختي وكل الناس سألتني جبتها منين!', verifiedPurchase: false, status: 'pending', createdAt: now, updatedAt: now },
    { id: 'REV-10499', productId: 'p-laptop-backpack', customerId: 'usr_123', customerName: 'أحمد محمود', rating: 3, content: 'كويسة بس الحمالات محتاجة تبطين أكتر.', verifiedPurchase: true, status: 'pending', createdAt: now, updatedAt: now }
  )
  return reviews
}

// ---------- Ratings ----------

export function ratingSummary(reviews: StoredReview[], productId: string) {
  const approved = reviews.filter(r => r.productId === productId && r.status === 'approved')
  const count = approved.length
  const rating = count ? Math.round(approved.reduce((s, r) => s + r.rating, 0) / count * 10) / 10 : 0
  const distribution = [5, 4, 3, 2, 1].map(stars => {
    const c = approved.filter(r => r.rating === stars).length
    return { rating: stars, count: c, percentage: count ? Math.round(c / count * 100) : 0 }
  })
  return { rating, reviewsCount: count, distribution }
}

// Keeps the product's cached rating in line with its approved reviews
export function syncProductRatings(products: StoredProduct[], reviews: StoredReview[], productIds: string[]) {
  for (const id of new Set(productIds)) {
    const product = products.find(p => p.id === id)
    if (!product) continue
    const { rating, reviewsCount } = ratingSummary(reviews, id)
    product.rating = rating
    product.reviewsCount = reviewsCount
  }
}

// A customer counts as a buyer once an order with the product reached them
export const hasPurchased = (orders: OrderDetails[], customerId: string | null | undefined, productId: string) =>
  !!customerId && orders.some(o => o.customer.id === customerId &&
    (o.status === 'delivered' || o.status === 'completed') &&
    o.items.some(i => i.productId === productId))

// ---------- Storefront ----------

export interface ReviewInput {
  customerId?: string | null
  name: string
  email?: string
  rating: number
  title?: string
  content: string
}

export function createReview(input: ReviewInput, product: StoredProduct, reviews: StoredReview[], orders: OrderDetails[]): StoredReview {
  const name = input.name?.trim() ?? ''
  const content = input.content?.trim() ?? ''
  const title = input.title?.trim() || undefined
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) throw new ReviewError('اختر تقييماً من 1 إلى 5 نجوم')
  if (name.length < 2 || name.length > 60) throw new ReviewError('يرجى إدخال اسمك')
  if (content.length < 10) throw new ReviewError('اكتب رأيك في 10 أحرف على الأقل')
  if (content.length > 1000 || (title && title.length > 100)) throw new ReviewError('التقييم أطول من المسموح')

  const customerId = input.customerId || null
  if (customerId && reviews.some(r => r.productId === product.id && r.customerId === customerId && r.status !== 'rejected')) {
    throw new ReviewError('لقد قمت بتقييم هذا المنتج من قبل')
  }

  const now = new Date().toISOString()
  const max = Math.max(10000, ...reviews.map(r => Number(r.id.replace(/\D/g, '')) || 0))
  return {
    id: `REV-${max + 1}`,
    productId: product.id,
    customerId,
    customerName: name,
    customerEmail: input.email?.trim() || undefined,
    rating: input.rating,
    title,
    content,
    verifiedPurchase: hasPurchased(orders, customerId, product.id),
    status: 'pending', // every review is moderated from the dashboard before it shows
    createdAt: now,
    updatedAt: now
  }
}

const formatDate = (iso: string) => new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))

// Approved reviews for the product page, newest first
export function storefrontReviews(reviews: StoredReview[], productId: string, limit = 20) {
  return reviews
    .filter(r => r.productId === productId && r.status === 'approved')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map(r => ({
      id: r.id,
      author: r.customerName,
      rating: r.rating,
      date: formatDate(r.createdAt),
      title: r.title,
      content: r.content,
      verified: r.verifiedPurchase,
      reply: r.reply ? { content: r.reply.content, date: formatDate(r.reply.createdAt) } : undefined
    }))
}

// ---------- Dashboard ----------

export function toAdminReview(r: StoredReview, products: StoredProduct[]): Review {
  const product = products.find(p => p.id === r.productId)
  return {
    id: r.id,
    productId: r.productId,
    productName: product?.form.name ?? 'منتج محذوف',
    productImage: product?.form.images[0]?.url,
    productSku: product?.form.sku,
    customerId: r.customerId ?? 'guest',
    customerName: r.customerName,
    customerEmail: r.customerEmail,
    rating: r.rating,
    title: r.title,
    content: r.content,
    verifiedPurchase: r.verifiedPurchase,
    status: r.status,
    reply: r.reply,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt
  }
}

export const REVIEW_STATUSES: ReviewStatus[] = ['pending', 'approved', 'hidden', 'rejected']
