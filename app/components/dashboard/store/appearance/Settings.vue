<template>
  <div class="flex flex-col gap-4">
    <!-- Tabs: one area at a time instead of one very long column -->
    <div class="sticky top-0 z-10 -mx-1 px-1 py-1 bg-bg dark:bg-bg-dark">
      <div class="grid grid-cols-4 gap-1 p-1 rounded-xl bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm" role="tablist" aria-label="أقسام المظهر">
        <button
          v-for="t in TABS"
          :key="t.id"
          type="button"
          role="tab"
          :aria-selected="focus === t.id"
          @click="focus = t.id"
          class="flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-bold transition-colors"
          :class="focus === t.id ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-primary-navy dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'"
        >
          <Icon :name="t.icon" class="w-4 h-4" />
          {{ t.label }}
        </button>
      </div>
    </div>

    <!-- Tabs stay usable read-only; only the settings are locked -->
    <fieldset :disabled="readonly" class="min-w-0">
      <div v-show="focus === 'identity'" class="space-y-6" role="tabpanel">
        <DashboardStoreAppearanceStoreIdentitySection />
        <DashboardStoreAppearanceBrandColorsSection />
        <DashboardStoreAppearanceTypographySection />
      </div>
      <div v-show="focus === 'style'" class="space-y-6" role="tabpanel">
        <DashboardStoreAppearanceShapeSection />
        <DashboardStoreAppearanceProductCardStyleSection />
      </div>
      <div v-show="focus === 'header'" class="space-y-6" role="tabpanel">
        <DashboardStoreAppearanceHeaderSettingsSection />
        <DashboardStoreAppearanceAnnouncementBarSection />
      </div>
      <div v-show="focus === 'footer'" class="space-y-6" role="tabpanel">
        <DashboardStoreAppearanceFooterSettingsSection />
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { useAppearanceFocus, type AppearanceSection } from '~/composables/useStoreAppearance'

const TABS: { id: AppearanceSection, label: string, icon: string }[] = [
  { id: 'identity', label: 'الهوية والألوان', icon: 'lucide:palette' },
  { id: 'style', label: 'الأزرار والبطاقات', icon: 'lucide:shapes' },
  { id: 'header', label: 'الهيدر', icon: 'lucide:panel-top' },
  { id: 'footer', label: 'الفوتر', icon: 'lucide:panel-bottom' }
]

defineProps<{ readonly?: boolean }>()

const focus = useAppearanceFocus()
</script>
