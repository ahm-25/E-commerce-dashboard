<template>
  <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
    <ProductCard v-for="product in store.filteredProducts" :key="product.id" :product="product" />
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
import ProductCard from '~/components/dashboard/products/ProductCard.vue'

const store = useProductsStore()
</script>
