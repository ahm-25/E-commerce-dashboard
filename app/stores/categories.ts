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

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
    loading: false,
    error: null as string | null,
    
    // Stats
    totalCategories: 24,
    mainCategoriesCount: 8,
    subCategoriesCount: 16,
    visibleCategoriesCount: 21,
    
    // Filters and Search
    searchQuery: '',
    selectedStatus: 'الكل',
    selectedType: 'الكل',
    selectedProducts: 'الكل',
    sortBy: 'الترتيب الحالي',
    
    // View state
    viewMode: 'tree' as 'tree' | 'list',
    selectedCategories: [] as string[]
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
    }
  },
  
  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      
      // Mock API call
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        
        this.categories = [
          {
            id: 'c1',
            name: 'الإلكترونيات',
            slug: 'electronics',
            type: 'main',
            productCount: 84,
            status: 'visible',
            sortOrder: 1,
            createdAt: '2023-01-01',
            updatedAt: 'منذ ساعتين',
            image: '',
            children: [
              {
                id: 'c1-1',
                name: 'الهواتف',
                slug: 'phones',
                parentId: 'c1',
                type: 'sub',
                productCount: 32,
                status: 'visible',
                sortOrder: 1,
                createdAt: '2023-01-02',
                updatedAt: 'منذ 3 ساعات',
                image: '',
                children: []
              },
              {
                id: 'c1-2',
                name: 'الكمبيوترات المحمولة',
                slug: 'laptops',
                parentId: 'c1',
                type: 'sub',
                productCount: 21,
                status: 'visible',
                sortOrder: 2,
                createdAt: '2023-01-02',
                updatedAt: 'منذ 3 ساعات',
                image: '',
                children: []
              },
              {
                id: 'c1-3',
                name: 'السماعات',
                slug: 'headphones',
                parentId: 'c1',
                type: 'sub',
                productCount: 18,
                status: 'visible',
                sortOrder: 3,
                createdAt: '2023-01-02',
                updatedAt: 'منذ 4 ساعات',
                image: '',
                children: []
              }
            ]
          },
          {
            id: 'c2',
            name: 'الملابس',
            slug: 'clothing',
            type: 'main',
            productCount: 56,
            status: 'visible',
            sortOrder: 2,
            createdAt: '2023-01-01',
            updatedAt: 'منذ 5 ساعات',
            image: '',
            children: []
          },
          {
            id: 'c3',
            name: 'المنزل والمطبخ',
            slug: 'home-kitchen',
            type: 'main',
            productCount: 42,
            status: 'hidden',
            sortOrder: 3,
            createdAt: '2023-01-01',
            updatedAt: 'منذ يوم',
            image: '',
            children: []
          },
          {
            id: 'c4',
            name: 'الرياضة واللياقة',
            slug: 'sports',
            type: 'main',
            productCount: 28,
            status: 'visible',
            sortOrder: 4,
            createdAt: '2023-01-01',
            updatedAt: 'منذ يوم',
            image: '',
            children: []
          },
          {
            id: 'c5',
            name: 'الجمال والعناية',
            slug: 'beauty',
            type: 'main',
            productCount: 33,
            status: 'visible',
            sortOrder: 5,
            createdAt: '2023-01-01',
            updatedAt: 'منذ يوم',
            image: '',
            children: []
          }
        ]
      } catch (err: any) {
        this.error = err.message || 'تعذر تحميل الأقسام'
      } finally {
        this.loading = false
      }
    },
    
    async deleteCategory(id: string) {
      // Recursive delete function for mock
      const deleteRecursive = (cats: Category[], targetId: string): Category[] => {
        return cats.filter(c => {
          if (c.id === targetId) return false;
          if (c.children) {
            c.children = deleteRecursive(c.children, targetId);
          }
          return true;
        })
      }
      this.categories = deleteRecursive(this.categories, id)
      this.selectedCategories = this.selectedCategories.filter(cid => cid !== id)
    },
    
    async bulkDelete() {
       const deleteRecursiveBulk = (cats: Category[], targetIds: string[]): Category[] => {
        return cats.filter(c => {
          if (targetIds.includes(c.id)) return false;
          if (c.children) {
            c.children = deleteRecursiveBulk(c.children, targetIds);
          }
          return true;
        })
      }
      this.categories = deleteRecursiveBulk(this.categories, this.selectedCategories)
      this.selectedCategories = []
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
      const updateRecursive = (cats: Category[]) => {
        for (const c of cats) {
          if (c.id === id) {
            c.status = status;
            return true;
          }
          if (c.children && updateRecursive(c.children)) {
            return true;
          }
        }
        return false;
      }
      updateRecursive(this.categories)
    },
    
    async reorderCategories(newCategories: Category[]) {
      this.categories = newCategories;
    }
  }
})
