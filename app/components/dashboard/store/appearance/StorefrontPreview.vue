<template>
  <div v-if="draftAppearance" class="flex flex-col min-h-full" :style="rootStyles">
    
    <!-- Announcement Bar -->
    <div 
      v-if="draftAppearance.announcementBar?.enabled" 
      class="py-2 px-4 text-center text-sm font-medium transition-colors"
      :style="{ backgroundColor: draftAppearance.colors.accent, color: '#ffffff' }"
    >
      <a v-if="draftAppearance.announcementBar.link" :href="draftAppearance.announcementBar.link" class="hover:underline">
        {{ draftAppearance.announcementBar.text }}
      </a>
      <span v-else>{{ draftAppearance.announcementBar.text }}</span>
    </div>

    <!-- Header -->
    <header 
      class="bg-white border-b border-gray-100 py-4 px-6 transition-all"
      :class="{ 'sticky top-0 z-50 shadow-sm': draftAppearance.header.sticky }"
    >
      <!-- Classic -->
      <div v-if="draftAppearance.header.style === 'classic'" class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img v-if="draftAppearance.logo" :src="draftAppearance.logo" alt="Logo" class="h-8 object-contain" />
          <div v-else class="text-xl font-bold" :style="{ color: draftAppearance.colors.primary }">متجري</div>
        </div>
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium" :style="{ color: draftAppearance.colors.text }">
          <a href="#" class="hover:opacity-70">الرئيسية</a>
          <a href="#" class="hover:opacity-70">المنتجات</a>
          <a href="#" class="hover:opacity-70">التصنيفات</a>
          <a href="#" class="hover:opacity-70">العروض</a>
        </nav>
        <div class="flex items-center gap-4">
          <button v-if="draftAppearance.header.showSearch" class="text-gray-600 hover:text-black">
            <Icon name="lucide:search" class="w-5 h-5" />
          </button>
          <button v-if="draftAppearance.header.showWishlist" class="text-gray-600 hover:text-black">
            <Icon name="lucide:heart" class="w-5 h-5" />
          </button>
          <button v-if="draftAppearance.header.showCart" class="text-gray-600 hover:text-black relative">
            <Icon name="lucide:shopping-cart" class="w-5 h-5" />
            <span class="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center text-white rounded-full" :style="{ backgroundColor: draftAppearance.colors.primary }">2</span>
          </button>
        </div>
      </div>
      
      <!-- Centered -->
      <div v-else-if="draftAppearance.header.style === 'centered'" class="flex flex-col items-center gap-4">
        <div class="flex items-center justify-between w-full">
           <div class="flex items-center gap-4">
            <button v-if="draftAppearance.header.showSearch" class="text-gray-600 hover:text-black">
              <Icon name="lucide:search" class="w-5 h-5" />
            </button>
          </div>
          <div class="flex items-center gap-2">
            <img v-if="draftAppearance.logo" :src="draftAppearance.logo" alt="Logo" class="h-10 object-contain" />
            <div v-else class="text-2xl font-bold" :style="{ color: draftAppearance.colors.primary }">متجري</div>
          </div>
          <div class="flex items-center gap-4">
            <button v-if="draftAppearance.header.showWishlist" class="text-gray-600 hover:text-black">
              <Icon name="lucide:heart" class="w-5 h-5" />
            </button>
            <button v-if="draftAppearance.header.showCart" class="text-gray-600 hover:text-black relative">
              <Icon name="lucide:shopping-cart" class="w-5 h-5" />
              <span class="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center text-white rounded-full" :style="{ backgroundColor: draftAppearance.colors.primary }">2</span>
            </button>
          </div>
        </div>
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium" :style="{ color: draftAppearance.colors.text }">
          <a href="#" class="hover:opacity-70">الرئيسية</a>
          <a href="#" class="hover:opacity-70">المنتجات</a>
          <a href="#" class="hover:opacity-70">التصنيفات</a>
          <a href="#" class="hover:opacity-70">العروض</a>
        </nav>
      </div>
      
      <!-- Minimal -->
      <div v-else-if="draftAppearance.header.style === 'minimal'" class="flex items-center justify-between">
        <button class="md:hidden text-gray-600 hover:text-black">
            <Icon name="lucide:menu" class="w-6 h-6" />
        </button>
        <div class="flex items-center gap-2 mx-auto md:mx-0">
          <img v-if="draftAppearance.logo" :src="draftAppearance.logo" alt="Logo" class="h-8 object-contain" />
          <div v-else class="text-xl font-bold" :style="{ color: draftAppearance.colors.primary }">متجري</div>
        </div>
        <div class="flex items-center gap-4">
          <button v-if="draftAppearance.header.showSearch" class="text-gray-600 hover:text-black">
            <Icon name="lucide:search" class="w-5 h-5" />
          </button>
          <button v-if="draftAppearance.header.showCart" class="text-gray-600 hover:text-black relative">
            <Icon name="lucide:shopping-bag" class="w-5 h-5" />
            <span class="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center text-white rounded-full" :style="{ backgroundColor: draftAppearance.colors.primary }">2</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-6 space-y-12">
      <!-- Hero Section -->
      <div 
        class="w-full h-64 md:h-80 rounded-2xl flex flex-col items-center justify-center text-center p-8 relative overflow-hidden"
        :style="{ backgroundColor: draftAppearance.colors.secondary }"
        :class="borderRadiusClass"
      >
        <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10" :style="{ fontFamily: draftAppearance.typography.fontFamily }">
          أحدث المنتجات العصرية
        </h1>
        <p class="text-white/80 mb-6 max-w-lg relative z-10">
          اكتشف مجموعتنا الجديدة من المنتجات المميزة بتصميمات عصرية وجودة لا مثيل لها.
        </p>
        <button 
          class="px-6 py-3 font-bold text-white relative z-10 transition-transform hover:scale-105"
          :class="[buttonStyleClass]"
          :style="{ backgroundColor: draftAppearance.colors.primary }"
        >
          تسوق الآن
        </button>
      </div>

      <!-- Categories -->
      <section>
        <h2 class="text-2xl font-bold mb-6 text-center" :style="{ color: draftAppearance.colors.text }">تسوق حسب التصنيف</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="flex flex-col items-center gap-2 group cursor-pointer">
            <div 
              class="w-24 h-24 bg-gray-100 flex items-center justify-center transition-transform group-hover:scale-105"
              :class="buttonStyleClass === 'rounded-full' ? 'rounded-full' : borderRadiusClass"
            >
              <Icon name="lucide:shopping-bag" class="w-8 h-8 text-gray-400" />
            </div>
            <span class="font-medium" :style="{ color: draftAppearance.colors.text }">تصنيف {{ i }}</span>
          </div>
        </div>
      </section>

      <!-- Products Grid -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold" :style="{ color: draftAppearance.colors.text }">المنتجات المميزة</h2>
          <a href="#" class="text-sm font-medium hover:underline" :style="{ color: draftAppearance.colors.primary }">عرض الكل</a>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div 
            v-for="i in 4" 
            :key="i" 
            class="bg-white overflow-hidden flex flex-col transition-all group"
            :class="productCardClass"
          >
            <!-- Image -->
            <div class="aspect-square bg-gray-100 relative">
              <div v-if="i === 1" class="absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 z-10" :class="buttonStyleClass" :style="{ backgroundColor: draftAppearance.colors.accent }">
                جديد
              </div>
              <div class="w-full h-full flex items-center justify-center">
                <Icon name="lucide:image" class="w-12 h-12 text-gray-300" />
              </div>
            </div>
            
            <!-- Details -->
            <div class="p-4 flex flex-col flex-1">
              <div class="text-xs text-gray-500 mb-1">تصنيف {{ i }}</div>
              <h3 class="font-bold mb-2 line-clamp-1" :style="{ color: draftAppearance.colors.text }">اسم المنتج الأنيق والحديث {{ i }}</h3>
              
              <div class="flex items-center gap-1 mb-3">
                <Icon v-for="s in 5" :key="s" name="lucide:star" class="w-3 h-3 text-amber-400 fill-amber-400" />
                <span class="text-xs text-gray-500 mr-1">(24)</span>
              </div>
              
              <div class="mt-auto flex items-center justify-between">
                <div class="font-bold text-lg" :style="{ color: draftAppearance.colors.primary }">15,999 ج.م</div>
                <button 
                  class="w-10 h-10 flex items-center justify-center text-white transition-colors"
                  :class="buttonStyleClass"
                  :style="{ backgroundColor: draftAppearance.colors.primary }"
                >
                  <Icon name="lucide:plus" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white mt-12 py-12 px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div class="md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
             <img v-if="draftAppearance.logo" :src="draftAppearance.logo" alt="Logo" class="h-8 object-contain filter brightness-0 invert" />
             <div v-else class="text-2xl font-bold text-white">متجري</div>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed mb-6">
            نقدم أفضل المنتجات بأعلى جودة لتناسب ذوقك الرفيع.
          </p>
          <div v-if="draftAppearance.footer?.showSocialLinks" class="flex gap-4">
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
              <Icon name="lucide:facebook" class="w-5 h-5" />
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
              <Icon name="lucide:instagram" class="w-5 h-5" />
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
              <Icon name="lucide:twitter" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 class="font-bold mb-4 text-lg">روابط هامة</h4>
          <ul class="space-y-2 text-sm text-gray-400">
            <li><a href="#" class="hover:text-white">من نحن</a></li>
            <li><a href="#" class="hover:text-white">سياسة الخصوصية</a></li>
            <li><a href="#" class="hover:text-white">الشروط والأحكام</a></li>
            <li><a href="#" class="hover:text-white">سياسة الاسترجاع</a></li>
          </ul>
        </div>

        <div v-if="draftAppearance.footer?.showContactInfo">
          <h4 class="font-bold mb-4 text-lg">تواصل معنا</h4>
          <ul class="space-y-3 text-sm text-gray-400">
            <li class="flex items-center gap-2">
              <Icon name="lucide:map-pin" class="w-4 h-4" />
              القاهرة، مصر
            </li>
            <li class="flex items-center gap-2">
              <Icon name="lucide:phone" class="w-4 h-4" />
              +20 123 456 7890
            </li>
            <li class="flex items-center gap-2">
              <Icon name="lucide:mail" class="w-4 h-4" />
              support@store.com
            </li>
          </ul>
        </div>

        <div v-if="draftAppearance.footer?.showNewsletter" class="md:col-span-1">
          <h4 class="font-bold mb-4 text-lg">النشرة البريدية</h4>
          <p class="text-sm text-gray-400 mb-4">اشترك ليصلك كل جديد وعروضنا الحصرية.</p>
          <div class="flex gap-2">
            <input 
              type="email" 
              placeholder="البريد الإلكتروني" 
              class="w-full px-4 py-2 bg-gray-800 border-none text-white focus:ring-2 focus:ring-primary"
              :class="buttonStyleClass"
            />
            <button 
              class="px-4 py-2 font-bold text-white transition-colors whitespace-nowrap"
              :class="buttonStyleClass"
              :style="{ backgroundColor: draftAppearance.colors.primary }"
            >
              اشتراك
            </button>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm text-gray-500">© 2026 جميع الحقوق محفوظة</p>
        <div v-if="draftAppearance.footer?.showPaymentMethods" class="flex items-center gap-2">
          <div class="w-10 h-6 bg-white rounded flex items-center justify-center"><span class="text-[10px] text-black font-bold">VISA</span></div>
          <div class="w-10 h-6 bg-white rounded flex items-center justify-center"><span class="text-[10px] text-black font-bold">MC</span></div>
          <div class="w-10 h-6 bg-white rounded flex items-center justify-center"><span class="text-[10px] text-black font-bold">CASH</span></div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStoreAppearance } from '~/composables/useStoreAppearance'

const { draftAppearance } = useStoreAppearance()

const rootStyles = computed(() => {
  if (!draftAppearance.value) return {}
  return {
    fontFamily: draftAppearance.value.typography.fontFamily,
    fontSize: `${draftAppearance.value.typography.baseFontSize}px`,
    backgroundColor: draftAppearance.value.colors.background
  }
})

const borderRadiusClass = computed(() => {
  switch (draftAppearance.value?.shape.borderRadius) {
    case 'sharp': return 'rounded-none'
    case 'small': return 'rounded-sm'
    case 'medium': return 'rounded-md'
    case 'large': return 'rounded-2xl'
    default: return 'rounded-md'
  }
})

const buttonStyleClass = computed(() => {
  switch (draftAppearance.value?.shape.buttonStyle) {
    case 'square': return 'rounded-none'
    case 'rounded': return 'rounded-md'
    case 'soft': return 'rounded-xl'
    case 'pill': return 'rounded-full'
    default: return 'rounded-md'
  }
})

const productCardClass = computed(() => {
  const baseRadius = borderRadiusClass.value
  switch (draftAppearance.value?.productCard.style) {
    case 'minimal': return 'shadow-none border-none ' + baseRadius
    case 'classic': return 'border border-gray-200 ' + baseRadius
    case 'elevated': return 'shadow-md hover:shadow-lg border-none ' + baseRadius
    case 'bordered': return 'border-2 border-gray-200 ' + baseRadius
    default: return 'border border-gray-200 ' + baseRadius
  }
})
</script>
