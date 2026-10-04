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

  // The customer received an order containing this product
  verifiedPurchase?: boolean

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
    
    totalItems(): number {
      return this.filteredReviews.length
    },

    totalPages(): number {
      return Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage))
    },

    paginatedReviews(): Review[] {
      const page = Math.min(this.currentPage, this.totalPages)
      return this.filteredReviews.slice((page - 1) * this.itemsPerPage, page * this.itemsPerPage)
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
        this.reviews = await $fetch<Review[]>('/api/admin/reviews')
        this.fetchReviewStats()
      } catch (err) {
        this.error = apiError(err, 'حدث خطأ أثناء تحميل التقييمات')
      } finally {
        this.loading = false
      }
    },

    // Stats are derived from the loaded reviews
    fetchReviewStats() {
      const r = this.reviews
      const total = r.length
      const rated = r.filter(x => x.status === 'approved')
      this.stats = {
        total,
        averageRating: rated.length ? rated.reduce((s, x) => s + x.rating, 0) / rated.length : 0,
        pending: r.filter(x => x.status === 'pending').length,
        approved: rated.length,
        hidden: r.filter(x => x.status === 'hidden').length,
        rejected: r.filter(x => x.status === 'rejected').length,
        unanswered: r.filter(x => !x.reply).length,
        distribution: ([5, 4, 3, 2, 1] as const).map(rating => {
          const count = r.filter(x => x.rating === rating).length
          return { rating, count, percentage: total ? Math.round(count / total * 100) : 0 }
        })
      }
    },

    // Puts the server's copy of the changed reviews in the list
    applyUpdated(updated: Review[]) {
      for (const u of updated) {
        const i = this.reviews.findIndex(r => r.id === u.id)
        if (i !== -1) this.reviews[i] = u
      }
      this.fetchReviewStats()
    },

    async setStatus(id: string, status: Review['status']) {
      const updated = await $fetch<Review>(`/api/admin/reviews/${encodeURIComponent(id)}/status`, { method: 'POST', body: { status } })
      this.applyUpdated([updated])
    },

    async bulkSetStatus(ids: string[], status: Review['status']) {
      if (!ids.length) return
      try {
        const updated = await $fetch<Review[]>('/api/admin/reviews/bulk', { method: 'POST', body: { ids, status } })
        this.applyUpdated(updated)
        this.selectedReviews = []
      } catch (err) {
        alert(apiError(err, 'تعذر تحديث التقييمات'))
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
      this.currentPage = Math.min(Math.max(page, 1), this.totalPages)
    },

    async approveReview(id: string) {
      await this.setStatus(id, 'approved')
    },

    async hideReview(id: string) {
      await this.setStatus(id, 'hidden')
    },

    // TODO: store the reason once the backend keeps a moderation log
    async rejectReview(id: string, _reason?: string) {
      await this.setStatus(id, 'rejected')
    },

    async replyToReview(id: string, payload: { content: string }) {
      const updated = await $fetch<Review>(`/api/admin/reviews/${encodeURIComponent(id)}/reply`, { method: 'POST', body: payload })
      this.applyUpdated([updated])
    },

    async bulkApproveReviews(ids: string[]) {
      await this.bulkSetStatus(ids, 'approved')
    },

    async bulkHideReviews(ids: string[]) {
      await this.bulkSetStatus(ids, 'hidden')
    },

    async bulkRejectReviews(ids: string[]) {
      await this.bulkSetStatus(ids, 'rejected')
    }
  }
})
