import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  
  // Mock Data
  const mockData: InventoryItem[] = [
    {
      id: 'inv-1',
      productId: 'prod-1',
      productName: 'Samsung Galaxy S24 Ultra',
      productImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80',
      sku: 'SAM-S24U-BLK',
      currentStock: 45,
      reservedStock: 5,
      availableStock: 40,
      reorderLevel: 10,
      status: 'in_stock',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'inv-2',
      productId: 'prod-2',
      productName: 'Apple AirPods Pro 2',
      sku: 'APP-PRO2-WHT',
      currentStock: 8,
      reservedStock: 2,
      availableStock: 6,
      reorderLevel: 15,
      status: 'low_stock',
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'inv-3',
      productId: 'prod-3',
      productName: 'Sony WH-1000XM5',
      sku: 'SONY-XM5-BLK',
      currentStock: 0,
      reservedStock: 0,
      availableStock: 0,
      reorderLevel: 5,
      status: 'out_of_stock',
      updatedAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]

  // Getters
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
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 600))
      inventoryItems.value = [...mockData]
    } catch (err: any) {
      error.value = err.message || 'فشل تحميل بيانات المخزون'
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

  const adjustStock = async (itemId: string, quantity: number, type: 'add' | 'subtract' | 'set', reason: string, note?: string) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500))
    const item = inventoryItems.value.find(i => i.id === itemId)
    if (item) {
      let newStock = item.currentStock
      if (type === 'add') newStock += quantity
      if (type === 'subtract') newStock = Math.max(0, newStock - quantity)
      if (type === 'set') newStock = quantity
      
      item.currentStock = newStock
      item.availableStock = Math.max(0, newStock - item.reservedStock)
      
      // Update status
      if (item.currentStock === 0) {
        item.status = 'out_of_stock'
      } else if (item.currentStock <= item.reorderLevel) {
        item.status = 'low_stock'
      } else {
        item.status = 'in_stock'
      }
      
      item.updatedAt = new Date().toISOString()
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
