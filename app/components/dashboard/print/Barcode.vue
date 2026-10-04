<template>
  <svg
    :viewBox="`0 0 ${barcode.width} ${height}`"
    preserveAspectRatio="none"
    role="img"
    :aria-label="`باركود ${value}`"
    shape-rendering="crispEdges"
  >
    <rect :width="barcode.width" :height="height" fill="#fff" />
    <rect v-for="([x, w], i) in barcode.bars" :key="i" :x="x" :width="w" :height="height" fill="#000" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { code128Bars } from '~/utils/code128'

const props = withDefaults(defineProps<{ value: string, height?: number }>(), { height: 40 })

const barcode = computed(() => code128Bars(props.value))
</script>
