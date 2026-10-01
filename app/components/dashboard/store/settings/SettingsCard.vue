<template>
  <section :id="id" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm scroll-mt-6">
    <div class="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center gap-3">
      <div class="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon :name="icon" class="w-5 h-5" />
      </div>
      <div>
        <h2 class="font-bold text-primary-navy dark:text-white font-ibm">{{ title }}</h2>
        <p v-if="description" class="text-xs text-muted mt-0.5">{{ description }}</p>
      </div>
    </div>
    <div class="p-6">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  id?: string
  title: string
  description?: string
  icon: string
}>()
</script>
