<template>
  <div class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden p-6">
    <div class="mb-4">
      <h2 class="text-lg font-black text-primary-navy dark:text-white">صور المنتج</h2>
      <p class="text-muted text-sm mt-1">أول صورة هي الصورة الرئيسية. حد أقصى {{ MAX_IMAGES }} صور، كل صورة لحد 5 ميجا.</p>
    </div>

    <!-- Upload Area -->
    <label
      v-if="form.images.length < MAX_IMAGES"
      class="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
      :class="dragging ? 'border-primary bg-primary/5' : 'border-border-light dark:border-border-dark hover:bg-bg dark:hover:bg-bg-dark hover:border-primary/50'"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <input type="file" accept="image/png,image/jpeg,image/webp" multiple class="sr-only" @change="onSelect" />
      <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
        <Icon name="ph:upload-simple-bold" class="w-6 h-6" />
      </div>
      <p class="text-primary-navy dark:text-white font-bold mb-1">اسحب الصور هنا أو <span class="text-primary">اختارها من جهازك</span></p>
      <p class="text-muted text-xs">PNG, JPG, WEBP</p>
    </label>

    <p v-if="error" class="text-sm font-bold text-danger mt-3">{{ error }}</p>

    <!-- Gallery -->
    <div v-if="form.images.length" class="mt-5 flex flex-wrap gap-3">
      <div
        v-for="(image, index) in form.images"
        :key="image.id"
        class="w-24 h-24 rounded-lg overflow-hidden relative group border-2"
        :class="index === 0 ? 'border-primary' : 'border-border-light dark:border-border-dark'"
      >
        <img :src="image.url" :alt="image.name" class="w-full h-full object-cover" />
        <span v-if="index === 0" class="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">الرئيسية</span>
        <div class="absolute inset-x-0 bottom-0 flex justify-between p-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-gradient-to-t from-black/50">
          <button
            v-if="index !== 0"
            type="button"
            @click="makePrimary(index)"
            class="bg-white/90 text-primary-navy p-1 rounded"
            title="اجعلها الرئيسية"
          >
            <Icon name="ph:star-bold" class="w-3.5 h-3.5" />
          </button>
          <span v-else></span>
          <button type="button" @click="remove(index)" class="bg-white/90 text-danger p-1 rounded" title="حذف الصورة">
            <Icon name="ph:trash-bold" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProductForm } from '~/composables/useProductForm'

const { form } = useProductForm()

const MAX_IMAGES = 8
const MAX_SIZE = 5 * 1024 * 1024
const dragging = ref(false)
const error = ref('')

const readAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result as string)
  reader.onerror = reject
  reader.readAsDataURL(file)
})

const addFiles = async (files: FileList | null) => {
  error.value = ''
  if (!files?.length) return
  const room = MAX_IMAGES - form.images.length
  const accepted = [...files].filter(f => /^image\/(png|jpeg|webp)$/.test(f.type))
  const rejectedType = files.length - accepted.length
  const tooBig = accepted.filter(f => f.size > MAX_SIZE).length
  const usable = accepted.filter(f => f.size <= MAX_SIZE).slice(0, room)

  // TODO: Upload to storage and keep the returned URL; data URLs are only for the mock
  for (const file of usable) {
    form.images.push({ id: Math.random().toString(36).slice(2, 9), url: await readAsDataUrl(file), name: file.name })
  }

  const notes = []
  if (rejectedType) notes.push(`${rejectedType} ملف مش صورة مدعومة`)
  if (tooBig) notes.push(`${tooBig} صورة أكبر من 5 ميجا`)
  if (accepted.length - tooBig > room) notes.push(`اتضاف ${usable.length} بس، الحد ${MAX_IMAGES} صور`)
  error.value = notes.join(' · ')
}

const onSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  addFiles(input.files)
  input.value = ''
}

const onDrop = (e: DragEvent) => {
  dragging.value = false
  addFiles(e.dataTransfer?.files ?? null)
}

const remove = (index: number) => {
  form.images.splice(index, 1)
}

const makePrimary = (index: number) => {
  const [image] = form.images.splice(index, 1)
  if (image) form.images.unshift(image)
}
</script>
