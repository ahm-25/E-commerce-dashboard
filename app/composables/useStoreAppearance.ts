import { storeToRefs } from 'pinia'
import { useStoreAppearanceStore, type StoreAppearance } from '~/stores/storeAppearance'

export type { StoreAppearance }

export const useStoreAppearance = () => {
  const store = useStoreAppearanceStore()
  const { 
    appearance, 
    draftAppearance, 
    isLoading, 
    isSaving, 
    isPublishing,
    lastPublished,
    hasUnsavedChanges 
  } = storeToRefs(store)

  const fetchAppearance = async () => {
    await store.fetchAppearance()
  }

  const updateField = <K extends keyof StoreAppearance>(
    section: K, 
    field: keyof NonNullable<StoreAppearance[K]> | null, 
    value: any
  ) => {
    if (!draftAppearance.value) return
    
    // Deep clone to ensure reactivity is triggered properly
    const newDraft = JSON.parse(JSON.stringify(draftAppearance.value))
    
    if (field) {
       // @ts-ignore
      newDraft[section][field] = value
    } else {
       // @ts-ignore
      newDraft[section] = value
    }
    
    store.updateDraft(section, newDraft[section])
  }
  
  const updateDraft = (key: keyof StoreAppearance, value: any) => {
      store.updateDraft(key, value)
  }

  const saveDraft = async () => {
    try {
      await store.saveDraft()
      // Would use a real toast here
      console.log('تم حفظ التغييرات كمسودة')
      return true
    } catch (error) {
      console.error('تعذر حفظ إعدادات المظهر')
      return false
    }
  }

  const publishAppearance = async () => {
    try {
      await store.publishAppearance()
      console.log('تم نشر مظهر المتجر بنجاح')
      return true
    } catch (error) {
      console.error('تعذر نشر التغييرات')
      return false
    }
  }

  const resetToDefault = () => {
    store.resetToDefault()
  }
  
  const discardChanges = () => {
    store.resetAppearance()
  }

  const handleImageUpload = async (type: 'logo' | 'favicon', file: File) => {
    // Mock upload
    return new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        updateDraft(type, result)
        resolve(result)
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (type: 'logo' | 'favicon') => {
    updateDraft(type, '')
  }

  return {
    appearance,
    draftAppearance,
    isLoading,
    isSaving,
    isPublishing,
    lastPublished,
    hasUnsavedChanges,
    fetchAppearance,
    updateField,
    updateDraft,
    saveDraft,
    publishAppearance,
    resetToDefault,
    discardChanges,
    handleImageUpload,
    removeImage
  }
}

// Settings tab currently open on the appearance page (the preview scrolls to match)
export type AppearanceSection = 'identity' | 'style' | 'header' | 'footer'
export const useAppearanceFocus = () => useState<AppearanceSection>('appearance-focus', () => 'identity')
