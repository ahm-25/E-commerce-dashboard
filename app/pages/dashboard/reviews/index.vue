<template>
  <NuxtLayout name="dashboard">
    <div class="flex flex-col gap-6" dir="rtl">
      <ReviewsHeader />
      
      <ReviewsStats />
      
      <ReviewsRatingOverview v-if="store.stats" />
      
      <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden flex flex-col">
        <ReviewsTabs />
        <ReviewsToolbar />
        <ActiveReviewFilters v-if="store.hasActiveFilters" />
        <ReviewsBulkActions v-if="store.selectedReviews.length > 0" />
        
        <div v-if="store.loading" class="p-6">
          <ReviewsSkeleton />
        </div>
        
        <div v-else-if="store.error" class="p-12">
          <ReviewsErrorState :error="store.error" @retry="store.fetchReviews" />
        </div>
        
        <div v-else-if="store.reviews.length === 0" class="p-12">
          <ReviewsEmptyState />
        </div>
        
        <div v-else-if="store.filteredReviews.length === 0" class="p-12">
          <ReviewsNoResults />
        </div>
        
        <div v-else>
          <!-- Desktop Table View -->
          <div class="hidden md:block">
            <ReviewsTable />
          </div>
          
          <!-- Mobile Cards View -->
          <div class="md:hidden p-4">
            <div class="flex flex-col gap-4">
              <!-- Mobile cards go here, will be implemented in ReviewsTable or separately. Let's rely on Mobile handling inside ReviewsTable or separate components. Actually, user asked for Review Cards in mobile. Let's make a ReviewCard component. -->
              <ReviewCard v-for="review in store.filteredReviews" :key="review.id" :review="review" />
            </div>
          </div>
        </div>
        
        <ReviewsPagination v-if="store.reviews.length > 0 && store.filteredReviews.length > 0" />
      </div>
    </div>
    
    <ReviewDetailsDrawer />
    
    <!-- Dialogs -->
    <ApproveReviewDialog />
    <HideReviewDialog />
    <RejectReviewDialog />
    <ReviewReplyDialog />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useReviewsStore } from '~/stores/reviews'
import ReviewsHeader from '~/components/dashboard/reviews/ReviewsHeader.vue'
import ReviewsStats from '~/components/dashboard/reviews/ReviewsStats.vue'
import ReviewsRatingOverview from '~/components/dashboard/reviews/ReviewsRatingOverview.vue'
import ReviewsTabs from '~/components/dashboard/reviews/ReviewsTabs.vue'
import ReviewsToolbar from '~/components/dashboard/reviews/ReviewsToolbar.vue'
import ActiveReviewFilters from '~/components/dashboard/reviews/ActiveReviewFilters.vue'
import ReviewsTable from '~/components/dashboard/reviews/ReviewsTable.vue'
import ReviewCard from '~/components/dashboard/reviews/ReviewCard.vue'
import ReviewsPagination from '~/components/dashboard/reviews/ReviewsPagination.vue'
import ReviewsEmptyState from '~/components/dashboard/reviews/ReviewsEmptyState.vue'
import ReviewsNoResults from '~/components/dashboard/reviews/ReviewsNoResults.vue'
import ReviewsErrorState from '~/components/dashboard/reviews/ReviewsErrorState.vue'
import ReviewsSkeleton from '~/components/dashboard/reviews/ReviewsSkeleton.vue'
import ReviewsBulkActions from '~/components/dashboard/reviews/ReviewsBulkActions.vue'
import ReviewDetailsDrawer from '~/components/dashboard/reviews/ReviewDetailsDrawer.vue'
import ApproveReviewDialog from '~/components/dashboard/reviews/ApproveReviewDialog.vue'
import HideReviewDialog from '~/components/dashboard/reviews/HideReviewDialog.vue'
import RejectReviewDialog from '~/components/dashboard/reviews/RejectReviewDialog.vue'
import ReviewReplyDialog from '~/components/dashboard/reviews/ReviewReplyDialog.vue'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const store = useReviewsStore()
const route = useRoute()
const router = useRouter()

useHead({
  title: 'التقييمات | لوحة التحكم'
})

// Initialize state from URL query
const initFromQuery = () => {
  const q = route.query
  if (q.tab) store.setTab(q.tab as string)
  if (q.search) store.setSearchQuery(q.search as string)
  if (q.status) store.selectedStatuses = (q.status as string).split(',')
  if (q.rating) store.selectedRatings = (q.rating as string).split(',').map(Number)
  if (q.hasMedia) store.hasMediaOnly = q.hasMedia === 'true'
  if (q.sort) store.sortBy = q.sort as string
  if (q.page) store.setPage(Number(q.page))
}

// Watch store state to update URL
watch(
  () => ({
    tab: store.currentTab,
    search: store.searchQuery,
    status: store.selectedStatuses.join(','),
    rating: store.selectedRatings.join(','),
    hasMedia: store.hasMediaOnly ? 'true' : undefined,
    sort: store.sortBy,
    page: store.currentPage > 1 ? store.currentPage.toString() : undefined
  }),
  (newQuery) => {
    // Remove empty values
    const query = Object.fromEntries(Object.entries(newQuery).filter(([_, v]) => v))
    router.replace({ query })
  },
  { deep: true }
)

onMounted(() => {
  initFromQuery()
  store.fetchReviews()
})
</script>
