<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
    <div class="p-5 border-b border-border-light dark:border-border-dark flex flex-col gap-4">
      <div class="relative">
        <Icon name="ph:magnifying-glass" class="w-5 h-5 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          v-model="query"
          type="search"
          placeholder="ابحث في الأسئلة الشائعة... مثلاً: الشحن، الدفع، موظف"
          aria-label="ابحث في الأسئلة الشائعة"
          class="w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 pr-10 transition-colors"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="category = cat"
          class="px-3 py-1.5 rounded-full text-xs font-bold border transition-colors"
          :class="category === cat
            ? 'bg-primary text-white border-primary'
            : 'bg-surface dark:bg-surface-dark border-border-light dark:border-border-dark text-muted hover:text-primary-navy dark:hover:text-white'"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <div class="divide-y divide-border-light dark:divide-border-dark">
      <div v-for="article in results" :key="article.id">
        <button
          @click="toggle(article.id)"
          class="w-full text-right px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
          :aria-expanded="openId === article.id"
        >
          <span class="font-bold text-primary-navy dark:text-white text-sm">{{ article.question }}</span>
          <Icon name="ph:caret-down-bold" class="w-4 h-4 text-muted shrink-0 transition-transform" :class="{ 'rotate-180': openId === article.id }" />
        </button>
        <div v-if="openId === article.id" class="px-5 pb-4 -mt-1">
          <p class="text-sm text-muted leading-relaxed">{{ article.answer }}</p>
          <NuxtLink v-if="article.link" :to="article.link.to" class="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline mt-2">
            {{ article.link.label }}
            <Icon name="ph:arrow-left" class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </div>

      <div v-if="!results.length" class="px-5 py-12 text-center">
        <Icon name="ph:question" class="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
        <p class="font-bold text-primary-navy dark:text-white">مالقيناش إجابة لـ "{{ query }}"</p>
        <p class="text-sm text-muted mt-1">ابعتلنا سؤالك وهنرد عليك</p>
        <button
          @click="$emit('ask', query)"
          class="mt-4 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm"
        >
          فتح تذكرة دعم
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { HELP_ARTICLES } from '~/stores/support'

defineEmits<{ ask: [query: string] }>()

const ALL = 'الكل'
const query = ref('')
const category = ref(ALL)
const openId = ref<string | null>(null)

const categories = [ALL, ...new Set(HELP_ARTICLES.map(a => a.category))]

// Arabic letters that are commonly typed interchangeably
const normalize = (text: string) =>
  text.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim()

const results = computed(() => {
  const words = normalize(query.value).split(/\s+/).filter(Boolean)
  return HELP_ARTICLES.filter(a => {
    if (category.value !== ALL && a.category !== category.value) return false
    const haystack = normalize(`${a.question} ${a.answer} ${a.category}`)
    return words.every(w => haystack.includes(w))
  })
})

// Searching across everything is more useful than inside one category
watch(query, (q) => {
  if (q) category.value = ALL
})

const toggle = (id: string) => {
  openId.value = openId.value === id ? null : id
}
</script>
