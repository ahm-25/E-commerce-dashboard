import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ApiProduct } from '~/stores/products'

export interface InventoryItem {
  id: string
  productId: string
  productName: string
  productImage?: string
  sku: string
  variant?: {
    id: string
    name: string
    sku: string
  }
  currentStock: number
  reservedStock: number
  availableStock: number
  reorderLevel: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'unavailable'
  updatedAt: string
}

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const inventoryItems = ref<InventoryItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const selectedItems = ref<string[]>([])
  const selectedTab = ref('all')
  const searchQuery = ref('')
  
  // Dialogs
  const isAdjustmentDialogOpen = ref(false)
  const isBulkAdjustmentDialogOpen = ref(false)
  const isMovementDrawerOpen = ref(false)
  const actionTarget = ref<InventoryItem | null>(null)
  
  // One row per simple product, or per variant of a variable product
  const toItems = (p: ApiProduct): InventoryItem[] => {
    const f = p.form
    if (!f.trackInventory) return []
    const reorderLevel = f.lowStockThreshold ?? 5
    const status = (stock: number): InventoryItem['status'] =>
      p.form.status === 'archived' ? 'unavailable' : stock <= 0 ? 'out_of_stock' : stock <= reorderLevel ? 'low_stock' : 'in_stock'
    const row = (stock: number, variant?: InventoryItem['variant']): InventoryItem => ({
      id: `${p.id}::${variant?.id ?? ''}`,
      productId: p.id,
      productName: f.name,
      productImage: f.images[0]?.url,
      sku: variant?.sku ?? f.sku,
      variant,
      currentStock: stock,
      reservedStock: 0, // orders take stock when they are placed
      availableStock: Math.max(0, stock),
      reorderLevel,
      status: status(stock),
      updatedAt: p.updatedAt
    })

    if (f.type === 'variable') {
      return f.variants.map((v, i) => row(v.stock ?? 0, {
        id: v.key,
        name: p.variants[i]?.label ?? Object.values(v.values).join(' / '),
        sku: p.variants[i]?.sku ?? v.sku
      }))
    }
    return [row(f.stock ?? 0)]
  }

  const filteredItems = computed(() => {
    let items = [...inventoryItems.value]

    // Tab filter
    if (selectedTab.value === 'in_stock') {
      items = items.filter(i => i.status === 'in_stock')
    } else if (selectedTab.value === 'low_stock') {
      items = items.filter(i => i.status === 'low_stock')
    } else if (selectedTab.value === 'out_of_stock') {
      items = items.filter(i => i.status === 'out_of_stock')
    }

    // Search filter
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      items = items.filter(i => 
        i.productName.toLowerCase().includes(q) || 
        i.sku.toLowerCase().includes(q)
      )
    }

    return items
  })

  const totalProducts = computed(() => inventoryItems.value.length)
  const inStockCount = computed(() => inventoryItems.value.filter(i => i.status === 'in_stock').length)
  const lowStockCount = computed(() => inventoryItems.value.filter(i => i.status === 'low_stock').length)
  const outOfStockCount = computed(() => inventoryItems.value.filter(i => i.status === 'out_of_stock').length)
  const totalUnits = computed(() => inventoryItems.value.reduce((sum, item) => sum + item.currentStock, 0))

  const inStockPercentage = computed(() => totalProducts.value ? Math.round((inStockCount.value / totalProducts.value) * 100) : 0)
  const lowStockPercentage = computed(() => totalProducts.value ? Math.round((lowStockCount.value / totalProducts.value) * 100) : 0)
  const outOfStockPercentage = computed(() => totalProducts.value ? Math.round((outOfStockCount.value / totalProducts.value) * 100) : 0)

  // Actions
  const fetchInventory = async () => {
    loading.value = true
    error.value = null
    try {
      const products = await $fetch<ApiProduct[]>('/api/admin/products')
      inventoryItems.value = products.flatMap(toItems)
    } catch (err: any) {
      error.value = apiError(err, 'فشل تحميل بيانات المخزون')
    } finally {
      loading.value = false
    }
  }

  const selectAll = (checked: boolean) => {
    if (checked) {
      selectedItems.value = filteredItems.value.map(i => i.id)
    } else {
      selectedItems.value = []
    }
  }

  const toggleSelection = (id: string) => {
    const index = selectedItems.value.indexOf(id)
    if (index === -1) {
      selectedItems.value.push(id)
    } else {
      selectedItems.value.splice(index, 1)
    }
  }

  // TODO: reason / note belong in a stock movements log (not stored yet)
  const adjustStock = async (itemId: string, quantity: number, type: 'add' | 'subtract' | 'set', reason: string, note?: string) => {
    const item = inventoryItems.value.find(i => i.id === itemId)
    if (!item) return
    try {
      const product = await $fetch<ApiProduct>(`/api/admin/products/${encodeURIComponent(item.productId)}/stock`, {
        method: 'POST',
        body: { variantKey: item.variant?.id ?? null, type, quantity }
      })
      // Refresh this product's rows (in place) from the saved product
      const fresh = toItems(product)
      inventoryItems.value = inventoryItems.value.map(i => fresh.find(f => f.id === i.id) ?? i)
    } catch (err: any) {
      throw new Error(apiError(err, 'تعذر تعديل المخزون'))
    }
  }

  const bulkAdjustStock = async () => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800))
    selectedItems.value = []
  }

  const exportInventory = async () => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800))
  }

  return {
    inventoryItems,
    loading,
    error,
    selectedItems,
    selectedTab,
    searchQuery,
    isAdjustmentDialogOpen,
    isBulkAdjustmentDialogOpen,
    isMovementDrawerOpen,
    actionTarget,
    filteredItems,
    totalProducts,
    inStockCount,
    lowStockCount,
    outOfStockCount,
    totalUnits,
    inStockPercentage,
    lowStockPercentage,
    outOfStockPercentage,
    fetchInventory,
    selectAll,
    toggleSelection,
    adjustStock,
    bulkAdjustStock,
    exportInventory
  }
})
