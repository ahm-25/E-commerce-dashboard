<template>
  <div class="overflow-x-auto min-h-[400px]">
    <table class="w-full text-sm text-right">
      <thead class="text-xs text-text-muted dark:text-text-muted-dark uppercase bg-surface-alt dark:bg-surface-dark-alt border-b border-border-light dark:border-border-dark">
        <tr>
          <th scope="col" class="px-4 py-3 w-4">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                class="form-checkbox h-4 w-4 text-primary rounded border-border-light dark:border-border-dark bg-surface dark:bg-surface-dark"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="toggleSelectAll"
              >
            </div>
          </th>
          <th scope="col" class="px-4 py-3 min-w-[200px]">العميل</th>
          <th scope="col" class="px-4 py-3 min-w-[200px]">المنتج</th>
          <th scope="col" class="px-4 py-3 w-32">التقييم</th>
          <th scope="col" class="px-4 py-3 min-w-[250px]">محتوى التقييم</th>
          <th scope="col" class="px-4 py-3">الحالة</th>
          <th scope="col" class="px-4 py-3">التاريخ</th>
          <th scope="col" class="px-4 py-3 text-left">إجراءات</th>
        </tr>
      </thead>
      <tbody>
        <ReviewTableRow 
          v-for="review in store.paginatedReviews" 
          :key="review.id" 
          :review="review" 
        />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useReviewsStore } from '~/stores/reviews'
import ReviewTableRow from '~/components/dashboard/reviews/ReviewTableRow.vue'

const store = useReviewsStore()

const isAllSelected = computed(() => {
  return store.filteredReviews.length > 0 && store.selectedReviews.length === store.filteredReviews.length
})

const isIndeterminate = computed(() => {
  return store.selectedReviews.length > 0 && store.selectedReviews.length < store.filteredReviews.length
})

const toggleSelectAll = (e: Event) => {
  const target = e.target as HTMLInputElement
  store.selectAll(target.checked)
}
</script>
