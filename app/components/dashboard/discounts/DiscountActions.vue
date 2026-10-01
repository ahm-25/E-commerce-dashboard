<template>
  <div v-if="canManage" class="flex items-center justify-end gap-2">
    <button @click="router.push(`/dashboard/discounts/${discount.id}/edit`)" class="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="تعديل">
      <Icon name="ph:pencil-simple" class="w-4 h-4" />
    </button>
    <button v-if="discount.status === 'active' || discount.status === 'scheduled'" @click="store.discountActionTarget = discount; store.isDisableDialogOpen = true" class="w-8 h-8 rounded-lg flex items-center justify-center text-warning hover:bg-warning/10 transition-colors" title="إيقاف الخصم">
      <Icon name="ph:pause-circle" class="w-4 h-4" />
    </button>
    <button v-else-if="discount.status === 'disabled'" @click="store.enableDiscount(discount.id)" class="w-8 h-8 rounded-lg flex items-center justify-center text-success hover:bg-success/10 transition-colors" title="تفعيل الخصم">
      <Icon name="ph:play-circle" class="w-4 h-4" />
    </button>
    <button @click="store.discountActionTarget = discount; store.isDeleteDialogOpen = true" class="w-8 h-8 rounded-lg flex items-center justify-center text-danger hover:bg-danger/10 transition-colors" title="حذف">
      <Icon name="ph:trash" class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCanManage } from '~/composables/useCanManage'
import { useRouter } from 'vue-router'
import { useDiscountsStore, type Discount } from '~/stores/discounts'

const props = defineProps<{
  discount: Discount
}>()

const store = useDiscountsStore()
const router = useRouter()

const canManage = useCanManage('discounts')
</script>
