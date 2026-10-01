<template>
  <SettingsCard id="info" title="معلومات المتجر" description="تظهر للعملاء في المتجر والفواتير ورسائل البريد" icon="ph:storefront-bold">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">اسم المتجر <span class="text-danger">*</span></label>
        <input v-model="form.name" type="text" :class="inputClass" />
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">وصف المتجر</label>
        <textarea v-model="form.description" rows="3" :class="inputClass"></textarea>
      </div>
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">البريد الإلكتروني للتواصل <span class="text-danger">*</span></label>
        <input v-model="form.email" type="email" dir="ltr" :class="inputClass" />
      </div>
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">رقم الهاتف</label>
        <input v-model="form.phone" type="tel" dir="ltr" :class="inputClass" />
      </div>
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">رقم واتساب</label>
        <input v-model="form.whatsapp" type="tel" dir="ltr" :class="inputClass" />
      </div>
    </div>

    <div class="h-px bg-border-light dark:bg-border-dark my-6"></div>

    <h3 class="text-sm font-bold text-primary-navy dark:text-white mb-4">عنوان النشاط التجاري</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الدولة</label>
        <input v-model="form.country" type="text" :class="inputClass" />
      </div>
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">المدينة</label>
        <input v-model="form.city" type="text" :class="inputClass" />
      </div>
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">العنوان</label>
        <input v-model="form.address" type="text" :class="inputClass" />
      </div>
      <div>
        <label class="block text-sm font-bold text-primary-navy dark:text-white mb-2">الرمز البريدي</label>
        <input v-model="form.postalCode" type="text" dir="ltr" :class="inputClass" />
      </div>
    </div>

    <p class="text-xs text-muted mt-6 flex items-center gap-1.5">
      <Icon name="ph:info" class="w-4 h-4" />
      الشعار والألوان من صفحة
      <NuxtLink to="/dashboard/store/appearance" class="text-primary font-bold hover:underline">المظهر</NuxtLink>
    </p>
  </SettingsCard>
</template>

<script setup lang="ts">
import type { StoreSettings } from '~/stores/storeSettings'
import SettingsCard from '~/components/dashboard/store/settings/SettingsCard.vue'

const form = defineModel<StoreSettings>({ required: true })

const inputClass = 'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-primary-navy dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 transition-colors'
</script>
