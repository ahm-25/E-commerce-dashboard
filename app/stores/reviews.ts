import { defineStore } from 'pinia'

export interface Review {
  id: string

  productId: string
  productName: string
  productImage?: string
  productSku?: string

  customerId: string
  customerName: string
  customerEmail?: string
  customerAvatar?: string

  rating: number

  title?: string
  content: string

  media?: {
    id: string
    type: 'image' | 'video'
    url: string
    thumbnailUrl?: string
  }[]

  status: 'pending' | 'approved' | 'hidden' | 'rejected'

  reply?: {
    id: string
    content: string
    createdAt: string
    updatedAt?: string
    authorName?: string
  }

  createdAt: string
  updatedAt: string
}

export interface ReviewStats {
  total: number
  averageRating: number
  pending: number
  approved: number
  hidden: number
  rejected: number
  unanswered: number

  distribution: {
    rating: 1 | 2 | 3 | 4 | 5
    count: number
    percentage: number
  }[]
}

interface ReviewsState {
  reviews: Review[]
  stats: ReviewStats | null
  loading: boolean
  error: string | null
  
  // Filters
  searchQuery: string
  selectedStatuses: string[]
  selectedRatings: number[]
  selectedProducts: string[]
  selectedDateRange: string
  hasMediaOnly: boolean
  
  // Tabs
  currentTab: string // 'all', 'pending', 'approved', 'hidden', 'rejected', 'unanswered'

  // Sort
  sortBy: string // 'newest', 'oldest', 'highest', 'lowest', 'unanswered', 'updated'
  
  // Pagination
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  
  // Selection
  selectedReviews: string[]
  
  // Details Drawer
  previewReviewId: string | null
  
  // Dialogs
  isApproveDialogOpen: boolean
  isHideDialogOpen: boolean
  isRejectDialogOpen: boolean
  isReplyDialogOpen: boolean
  reviewToActOn: Review | null
}

export const useReviewsStore = defineStore('reviews', {
  state: (): ReviewsState => ({
    reviews: [],
    stats: null,
    loading: false,
    error: null,
    
    searchQuery: '',
    selectedStatuses: [],
    selectedRatings: [],
    selectedProducts: [],
    selectedDateRange: 'all',
    hasMediaOnly: false,
    
    currentTab: 'all',

    sortBy: 'newest',

    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    
    selectedReviews: [],
    
    previewReviewId: null,
    
    isApproveDialogOpen: false,
    isHideDialogOpen: false,
    isRejectDialogOpen: false,
    isReplyDialogOpen: false,
    reviewToActOn: null,
  }),
  
  getters: {
    filteredReviews: (state) => {
      let result = [...state.reviews]
      
      // Filter by Tab
      if (state.currentTab === 'pending') result = result.filter(r => r.status === 'pending')
      else if (state.currentTab === 'approved') result = result.filter(r => r.status === 'approved')
      else if (state.currentTab === 'hidden') result = result.filter(r => r.status === 'hidden')
      else if (state.currentTab === 'rejected') result = result.filter(r => r.status === 'rejected')
      else if (state.currentTab === 'unanswered') result = result.filter(r => !r.reply)

      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        result = result.filter(r => 
          r.customerName.toLowerCase().includes(query) || 
          (r.customerEmail && r.customerEmail.toLowerCase().includes(query)) ||
          r.productName.toLowerCase().includes(query) ||
          r.content.toLowerCase().includes(query) ||
          r.id.toLowerCase().includes(query)
        )
      }
      
      if (state.selectedStatuses.length > 0) {
        result = result.filter(r => state.selectedStatuses.includes(r.status))
      }

      if (state.selectedRatings.length > 0) {
        result = result.filter(r => state.selectedRatings.includes(r.rating))
      }
      
      if (state.hasMediaOnly) {
        result = result.filter(r => r.media && r.media.length > 0)
      }
      
      // Apply Sorting
      result.sort((a, b) => {
        if (state.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        if (state.sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        if (state.sortBy === 'highest') return b.rating - a.rating
        if (state.sortBy === 'lowest') return a.rating - b.rating
        if (state.sortBy === 'unanswered') return (!b.reply ? 1 : 0) - (!a.reply ? 1 : 0)
        if (state.sortBy === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        return 0
      })

      return result
    },
    
    hasActiveFilters: (state) => {
      return state.selectedStatuses.length > 0 || 
             state.selectedRatings.length > 0 ||
             state.selectedProducts.length > 0 ||
             state.selectedDateRange !== 'all' ||
             state.hasMediaOnly
    },
    
    previewReview: (state) => {
      if (!state.previewReviewId) return null
      return state.reviews.find(r => r.id === state.previewReviewId) || null
    }
  },
  
  actions: {
    async fetchReviews() {
      this.loading = true
      this.error = null
      
      try {
        // TODO: Replace with API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data
        this.reviews = [
          {
            id: 'REV-10482',
            productId: 'PROD-001',
            productName: 'Samsung Galaxy S24 Ultra',
            productSku: 'SAM-S24U-256',
            customerId: 'CUS-009281',
            customerName: 'أحمد محمد',
            customerEmail: 'ahmed@example.com',
            rating: 5,
            content: 'الهاتف ممتاز جداً والخامة رائعة. الشاشة مذهلة والتصوير فوق الوصف. أنصح به بشدة.',
            media: [
              { id: 'm1', type: 'image', url: 'https://picsum.photos/400/300?random=1' },
              { id: 'm2', type: 'image', url: 'https://picsum.photos/400/300?random=2' }
            ],
            status: 'pending',
            createdAt: '2026-09-28T14:30:00Z',
            updatedAt: '2026-09-28T14:30:00Z'
          },
          {
            id: 'REV-10483',
            productId: 'PROD-002',
            productName: 'Apple MacBook Pro M3',
            productSku: 'APP-MBP-M3',
            customerId: 'CUS-009282',
            customerName: 'سارة خالد',
            customerEmail: 'sara.k@example.com',
            rating: 4,
            content: 'اللابتوب قوي جداً وسريع، لكن السعر مرتفع بعض الشيء مقارنة بالمواصفات. البطارية تدوم طويلاً.',
            status: 'approved',
            reply: {
              id: 'rep-1',
              content: 'شكراً سارة على تقييمك الجميل. نأمل أن تستمتعي بتجربة الاستخدام.',
              createdAt: '2026-09-27T10:15:00Z',
              authorName: 'إدارة المتجر'
            },
            createdAt: '2026-09-26T09:15:00Z',
            updatedAt: '2026-09-27T10:15:00Z'
          },
          {
            id: 'REV-10484',
            productId: 'PROD-003',
            productName: 'Sony WH-1000XM5',
            productSku: 'SON-WH5',
            customerId: 'CUS-009283',
            customerName: 'محمود علي',
            rating: 2,
            content: 'العزل جيد لكن الصوت غير نقي. واجهت مشكلة في التوصيل بالبلوتوث أكثر من مرة.',
            status: 'hidden',
            createdAt: '2026-09-20T16:45:00Z',
            updatedAt: '2026-09-20T16:45:00Z'
          },
          {
            id: 'REV-10485',
            productId: 'PROD-004',
            productName: 'Logitech MX Master 3S',
            productSku: 'LOG-MX3S',
            customerId: 'CUS-009284',
            customerName: 'نور الدين ياسر',
            rating: 5,
            content: 'أفضل ماوس استخدمته على الإطلاق للعمل. مريح جداً.',
            status: 'approved',
            createdAt: '2026-09-25T12:00:00Z',
            updatedAt: '2026-09-25T12:00:00Z'
          },
          {
            id: 'REV-10486',
            productId: 'PROD-001',
            productName: 'Samsung Galaxy S24 Ultra',
            productSku: 'SAM-S24U-256',
            customerId: 'CUS-009285',
            customerName: 'كمال منصور',
            rating: 1,
            content: 'وصلني الجهاز مفتوح وتم إرجاعه.',
            status: 'rejected',
            createdAt: '2026-09-15T11:00:00Z',
            updatedAt: '2026-09-16T12:00:00Z'
          }
        ]
        
        this.totalItems = 2486
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
        
        // Fetch stats as well
        await this.fetchReviewStats()
        
      } catch (err: any) {
        this.error = err.message || 'حدث خطأ أثناء تحميل التقييمات'
      } finally {
        this.loading = false
      }
    },
    
    async fetchReviewStats() {
      // TODO: Replace with API call
      this.stats = {
        total: 2486,
        averageRating: 4.6,
        pending: 24,
        approved: 2318,
        hidden: 107,
        rejected: 37,
        unanswered: 37,
        distribution: [
          { rating: 5, count: 1842, percentage: 74 },
          { rating: 4, count: 421, percentage: 17 },
          { rating: 3, count: 143, percentage: 6 },
          { rating: 2, count: 51, percentage: 2 },
          { rating: 1, count: 29, percentage: 1 },
        ]
      }
    },

    setTab(tab: string) {
      this.currentTab = tab
      this.currentPage = 1
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },
    
    toggleStatusFilter(status: string) {
      const index = this.selectedStatuses.indexOf(status)
      if (index === -1) this.selectedStatuses.push(status)
      else this.selectedStatuses.splice(index, 1)
    },

    toggleRatingFilter(rating: number) {
      const index = this.selectedRatings.indexOf(rating)
      if (index === -1) this.selectedRatings.push(rating)
      else this.selectedRatings.splice(index, 1)
    },
    
    clearFilters() {
      this.selectedStatuses = []
      this.selectedRatings = []
      this.selectedProducts = []
      this.selectedDateRange = 'all'
      this.hasMediaOnly = false
    },
    
    selectAll(selected: boolean) {
      if (selected) {
        this.selectedReviews = this.filteredReviews.map(r => r.id)
      } else {
        this.selectedReviews = []
      }
    },
    
    toggleSelection(id: string) {
      const index = this.selectedReviews.indexOf(id)
      if (index === -1) this.selectedReviews.push(id)
      else this.selectedReviews.splice(index, 1)
    },
    
    openPreview(id: string) {
      this.previewReviewId = id
    },
    
    closePreview() {
      this.previewReviewId = null
    },
    
    openApproveDialog(review: Review) {
      this.reviewToActOn = review
      this.isApproveDialogOpen = true
    },
    
    closeApproveDialog() {
      this.isApproveDialogOpen = false
      this.reviewToActOn = null
    },
    
    openHideDialog(review: Review) {
      this.reviewToActOn = review
      this.isHideDialogOpen = true
    },
    
    closeHideDialog() {
      this.isHideDialogOpen = false
      this.reviewToActOn = null
    },
    
    openRejectDialog(review: Review) {
      this.reviewToActOn = review
      this.isRejectDialogOpen = true
    },
    
    closeRejectDialog() {
      this.isRejectDialogOpen = false
      this.reviewToActOn = null
    },
    
    openReplyDialog(review: Review) {
      this.reviewToActOn = review
      this.isReplyDialogOpen = true
    },
    
    closeReplyDialog() {
      this.isReplyDialogOpen = false
      this.reviewToActOn = null
    },
    
    setPage(page: number) {
      this.currentPage = page
      // In real app, re-fetch data
    },

    async approveReview(id: string) {
      const review = this.reviews.find(r => r.id === id)
      if (review) {
        // TODO: API Call
        review.status = 'approved'
        if (this.stats) {
          this.stats.approved++
          if (review.status === 'pending') this.stats.pending--
        }
      }
    },

    async hideReview(id: string) {
      const review = this.reviews.find(r => r.id === id)
      if (review) {
        // TODO: API Call
        review.status = 'hidden'
      }
    },

    async rejectReview(id: string, reason?: string) {
      const review = this.reviews.find(r => r.id === id)
      if (review) {
        // TODO: API Call
        review.status = 'rejected'
      }
    },

    async replyToReview(id: string, payload: { content: string }) {
      const review = this.reviews.find(r => r.id === id)
      if (review) {
        // TODO: API Call
        review.reply = {
          id: 'rep-' + Date.now(),
          content: payload.content,
          createdAt: new Date().toISOString(),
          authorName: 'إدارة المتجر'
        }
      }
    },
    
    async bulkApproveReviews(ids: string[]) {
      // TODO: API Call
      ids.forEach(id => {
        const review = this.reviews.find(r => r.id === id)
        if (review) review.status = 'approved'
      })
      this.selectedReviews = []
    },

    async bulkHideReviews(ids: string[]) {
      // TODO: API Call
      ids.forEach(id => {
        const review = this.reviews.find(r => r.id === id)
        if (review) review.status = 'hidden'
      })
      this.selectedReviews = []
    },

    async bulkRejectReviews(ids: string[]) {
      // TODO: API Call
      ids.forEach(id => {
        const review = this.reviews.find(r => r.id === id)
        if (review) review.status = 'rejected'
      })
      this.selectedReviews = []
    }
  }
})
