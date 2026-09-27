<template>
  <NuxtLayout name="dashboard">
    <ProductEditor :is-editing="false" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import ProductEditor from '~/components/dashboard/products/editor/ProductEditor.vue'

useHead({
  title: 'إضافة منتج | لوحة التحكم'
})
</script>
