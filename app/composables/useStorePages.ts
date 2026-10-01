import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStorePagesStore, type StorePage } from '~/stores/storePages'

export const useStorePages = () => {
  const store = useStorePagesStore()
  const route = useRoute()
  const router = useRouter()

  // State from URL
  const searchQuery = ref((route.query.q as string) || '')
  const currentTab = ref((route.query.status as string) || 'all')
  const typeFilter = ref((route.query.type as string) || 'all')
  const seoFilter = ref((route.query.seo as string) || 'all')
  const selectedPages = ref<string[]>([])

  // Load pages if not loaded
  onMounted(() => {
    if (store.pages.length === 0) {
      store.fetchPages()
    }
  })

  // Sync state to URL
  const updateQuery = () => {
    const query: Record<string, string> = {}
    if (searchQuery.value) query.q = searchQuery.value
    if (currentTab.value !== 'all') query.status = currentTab.value
    if (typeFilter.value !== 'all') query.type = typeFilter.value
    if (seoFilter.value !== 'all') query.seo = seoFilter.value

    router.replace({ query })
  }

  // Watchers for filtering
  watch([searchQuery, currentTab, typeFilter, seoFilter], () => {
    updateQuery()
  }, { debounce: 300 })

  const filteredPages = computed(() => {
    let pages = store.pages

    if (currentTab.value !== 'all') {
      pages = pages.filter(p => p.status === currentTab.value)
    }

    if (typeFilter.value !== 'all') {
      pages = pages.filter(p => p.type === typeFilter.value)
    }

    if (seoFilter.value !== 'all') {
      pages = pages.filter(p => {
        const isComplete = !!(p.seo?.title && p.seo?.description)
        return seoFilter.value === 'complete' ? isComplete : !isComplete
      })
    }

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      pages = pages.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.slug.toLowerCase().includes(q)
      )
    }

    return pages
  })

  const hasActiveFilters = computed(() => {
    return currentTab.value !== 'all' || typeFilter.value !== 'all' || seoFilter.value !== 'all'
  })

  const clearFilters = () => {
    currentTab.value = 'all'
    typeFilter.value = 'all'
    seoFilter.value = 'all'
  }

  // Bulk Actions
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      selectedPages.value = filteredPages.value.map(p => p.id)
    } else {
      selectedPages.value = []
    }
  }

  const toggleSelect = (id: string) => {
    const index = selectedPages.value.indexOf(id)
    if (index === -1) {
      selectedPages.value.push(id)
    } else {
      selectedPages.value.splice(index, 1)
    }
  }

  const isSelected = (id: string) => selectedPages.value.includes(id)
  
  const allSelected = computed(() => {
    return filteredPages.value.length > 0 && selectedPages.value.length === filteredPages.value.length
  })

  const bulkPublish = async () => {
    for (const id of selectedPages.value) {
      await store.publishPage(id)
    }
    selectedPages.value = []
  }

  const bulkHide = async () => {
    for (const id of selectedPages.value) {
      await store.hidePage(id)
    }
    selectedPages.value = []
  }

  const bulkDelete = async () => {
    if (confirm(`هل أنت متأكد من حذف ${selectedPages.value.length} صفحات؟`)) {
      for (const id of selectedPages.value) {
        const page = store.pages.find(p => p.id === id)
        if (page?.type !== 'system') {
          await store.deletePage(id)
        }
      }
      selectedPages.value = []
    }
  }

  return {
    store,
    searchQuery,
    currentTab,
    typeFilter,
    seoFilter,
    filteredPages,
    hasActiveFilters,
    clearFilters,
    selectedPages,
    toggleSelectAll,
    toggleSelect,
    isSelected,
    allSelected,
    bulkPublish,
    bulkHide,
    bulkDelete
  }
}
