import { defineStore } from 'pinia'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string | null
  children?: Category[]
  productCount: number
  status: 'visible' | 'hidden'
  sortOrder: number
  type: 'main' | 'sub'
  createdAt: string
  updatedAt: string
}

// Builds the tree from the API's flat list (sorted by sortOrder)
const buildTree = (flat: Category[]): Category[] => {
  const byId = new Map(flat.map(c => [c.id, { ...c, children: [] as Category[] }]))
  const roots: Category[] = []
  for (const c of byId.values()) {
    const parent = c.parentId ? byId.get(c.parentId) : undefined
    if (parent) parent.children!.push(c)
    else roots.push(c)
  }
  return roots
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ar-EG-u-nu-latn', { day: 'numeric', month: 'long' })

export type CategoryInput = Pick<Category, 'name' | 'slug' | 'description' | 'image' | 'parentId' | 'status' | 'sortOrder'>

const removeFromTree = (cats: Category[], targetId: string): Category[] => {
  return cats
    .filter(c => c.id !== targetId)
    .map(c => (c.children ? { ...c, children: removeFromTree(c.children, targetId) } : c))
}

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
    loading: false,
    error: null as string | null,
    
    // Stats
    totalCategories: 0,
    mainCategoriesCount: 0,
    subCategoriesCount: 0,
    visibleCategoriesCount: 0,
    
    // Filters and Search
    searchQuery: '',
    selectedStatus: 'الكل',
    selectedType: 'الكل',
    selectedProducts: 'الكل',
    sortBy: 'الترتيب الحالي',
    
    // View state
    viewMode: 'tree' as 'tree' | 'list',
    selectedCategories: [] as string[],

    // Delete dialog
    categoryToDelete: null as Category | null
  }),
  
  getters: {
    filteredCategories: (state) => {
      // Create a flat array for filtering logic initially or filter the tree
      // But tree structure might make simple filtering complex. Let's return flattened if filtered heavily, or just filter the top levels.
      // For simplicity we will filter a flat list and reconstruct or just filter the flat list for the table.
      
      const flattenCategories = (cats: Category[]): Category[] => {
        let result: Category[] = []
        for (const cat of cats) {
          result.push(cat)
          if (cat.children && cat.children.length > 0) {
            result = result.concat(flattenCategories(cat.children))
          }
        }
        return result
      }

      let allCats = flattenCategories(state.categories)
      let result = [...allCats]
      
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        result = result.filter(c => 
          c.name.toLowerCase().includes(query) || 
          c.slug.toLowerCase().includes(query)
        )
      }
      
      if (state.selectedStatus && state.selectedStatus !== 'الكل') {
        const statusMap: Record<string, string> = {
          'ظاهر': 'visible',
          'مخفي': 'hidden'
        }
        const mappedStatus = statusMap[state.selectedStatus]
        if (mappedStatus) {
           result = result.filter(c => c.status === mappedStatus)
        }
      }
      
      if (state.selectedType && state.selectedType !== 'الكل') {
        const typeMap: Record<string, string> = {
          'قسم رئيسي': 'main',
          'قسم فرعي': 'sub'
        }
        const mappedType = typeMap[state.selectedType]
        if (mappedType) {
           result = result.filter(c => c.type === mappedType)
        }
      }
      
      if (state.selectedProducts && state.selectedProducts !== 'الكل') {
        if (state.selectedProducts === 'يحتوي على منتجات') {
          result = result.filter(c => c.productCount > 0)
        } else if (state.selectedProducts === 'فارغ') {
          result = result.filter(c => c.productCount === 0)
        }
      }
      
      // If we have filters active, we just return the flat list. 
      // If no filters (except sort), we might want to return the tree.
      // But for simplicity of rendering, let's return the tree structure if no search/filter.
      
      const hasRealFilters = state.searchQuery || state.selectedStatus !== 'الكل' || state.selectedType !== 'الكل' || state.selectedProducts !== 'الكل'
      
      if (hasRealFilters) {
        // Sort logic for flat list
        return result.map(c => ({...c, children: []}))
      }
      
      return state.categories
    },
    
    hasActiveFilters: (state) => {
      return state.searchQuery !== '' || 
             state.selectedStatus !== 'الكل' || 
             state.selectedType !== 'الكل' || 
             state.selectedProducts !== 'الكل'
    },
    
    flatCategories: (state) => {
      const flattenCategories = (cats: Category[]): Category[] => {
        let result: Category[] = []
        for (const cat of cats) {
          result.push(cat)
          if (cat.children && cat.children.length > 0) {
            result = result.concat(flattenCategories(cat.children))
          }
        }
        return result
      }
      return flattenCategories(state.categories)
    },

    categoryById(): (id: string) => Category | null {
      return (id: string) => this.flatCategories.find(c => c.id === id) || null
    },

    mainCategories: (state) => state.categories
  },
  
  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        const flat = await $fetch<Category[]>('/api/admin/categories')
        this.categories = buildTree(flat.map(c => ({ ...c, updatedAt: formatDate(c.updatedAt) })))
        this.computeStats()
      } catch (err: any) {
        this.error = apiError(err, 'تعذر تحميل الأقسام')
      } finally {
        this.loading = false
      }
    },

    computeStats() {
      const all = this.flatCategories
      this.totalCategories = all.length
      this.mainCategoriesCount = all.filter(c => c.type === 'main').length
      this.subCategoriesCount = all.filter(c => c.type === 'sub').length
      this.visibleCategoriesCount = all.filter(c => c.status === 'visible').length
    },
    
    // The server moves sub-categories up and un-assigns products; reload to reflect that
    async deleteCategory(id: string) {
      await $fetch(`/api/admin/categories/${encodeURIComponent(id)}`, { method: 'DELETE' })
      this.selectedCategories = this.selectedCategories.filter(cid => cid !== id)
      await this.fetchCategories()
    },
    
    async bulkDelete() {
      for (const id of [...this.selectedCategories]) {
        await $fetch(`/api/admin/categories/${encodeURIComponent(id)}`, { method: 'DELETE' })
      }
      this.selectedCategories = []
      await this.fetchCategories()
    },
    
    clearFilters() {
      this.searchQuery = ''
      this.selectedStatus = 'الكل'
      this.selectedType = 'الكل'
      this.selectedProducts = 'الكل'
    },
    
    removeFilter(filterName: string) {
      if (filterName === 'status') this.selectedStatus = 'الكل'
      if (filterName === 'type') this.selectedType = 'الكل'
      if (filterName === 'products') this.selectedProducts = 'الكل'
    },
    
    toggleCategorySelection(id: string) {
      const index = this.selectedCategories.indexOf(id)
      if (index === -1) {
        this.selectedCategories.push(id)
      } else {
        this.selectedCategories.splice(index, 1)
      }
    },
    
    selectAll(isAll: boolean) {
      if (isAll) {
        this.selectedCategories = this.flatCategories.map(c => c.id)
      } else {
        this.selectedCategories = []
      }
    },
    
    async updateVisibility(id: string, status: 'visible' | 'hidden') {
      await $fetch(`/api/admin/categories/${encodeURIComponent(id)}`, { method: 'PUT', body: { status } })
      const category = this.categoryById(id)
      if (category) category.status = status
      this.computeStats()
    },
    
    // Persists the new order as sortOrder (position in the flattened tree)
    async reorderCategories(newCategories: Category[]) {
      this.categories = newCategories
      const changed = this.flatCategories
        .map((c, index) => ({ c, sortOrder: index + 1 }))
        .filter(({ c, sortOrder }) => c.sortOrder !== sortOrder)
      for (const { c, sortOrder } of changed) {
        c.sortOrder = sortOrder
        await $fetch(`/api/admin/categories/${encodeURIComponent(c.id)}`, { method: 'PUT', body: { sortOrder } })
      }
    },

    async createCategory(data: CategoryInput) {
      try {
        const created = await $fetch<Category>('/api/admin/categories', { method: 'POST', body: data })
        await this.fetchCategories()
        return created
      } catch (err: any) {
        throw new Error(apiError(err, 'تعذر حفظ القسم'))
      }
    },

    async updateCategory(id: string, data: CategoryInput) {
      try {
        const updated = await $fetch<Category>(`/api/admin/categories/${encodeURIComponent(id)}`, { method: 'PUT', body: data })
        await this.fetchCategories()
        return updated
      } catch (err: any) {
        throw new Error(apiError(err, 'تعذر تحديث القسم'))
      }
    },

    insertIntoTree(category: Category) {
      if (category.parentId) {
        const parent = this.categoryById(category.parentId)
        if (parent) {
          parent.children = [...(parent.children || []), category]
          return
        }
      }
      category.parentId = null
      category.type = 'main'
      this.categories.push(category)
    }
  }
})
