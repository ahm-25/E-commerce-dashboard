import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface DashboardStats {
  revenue: number
  orders: number
  customers: number
  conversionRate: number
}

export const useDashboardStore = defineStore('dashboard', () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedDateRange = ref('last_30_days')
  
  const stats = ref<DashboardStats>({
    revenue: 85240,
    orders: 1248,
    customers: 3842,
    conversionRate: 4.8
  })

  // Simulated fetch
  const fetchDashboard = async () => {
    isLoading.value = true
    error.value = null
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // We would update stats here from actual API data
      
    } catch (e: any) {
      error.value = e.message || 'حدث خطأ أثناء جلب البيانات'
    } finally {
      isLoading.value = false
    }
  }

  const refresh = () => fetchDashboard()

  return {
    isLoading,
    error,
    selectedDateRange,
    stats,
    fetchDashboard,
    refresh
  }
})
