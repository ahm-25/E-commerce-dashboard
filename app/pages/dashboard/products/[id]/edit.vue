<template>
  <NuxtLayout name="dashboard">
    <ProductEditor :is-editing="true" :product-id="route.params.id as string" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import ProductEditor from '~/components/dashboard/products/editor/ProductEditor.vue'

const route = useRoute()

useHead({
  title: 'تعديل منتج | لوحة التحكم'
})
</script>
