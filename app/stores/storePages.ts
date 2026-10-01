import { defineStore } from 'pinia'

export interface StorePage {
  id: string
  title: string
  slug: string
  type: 'system' | 'custom'
  content: string
  status: 'draft' | 'published' | 'hidden'
  seo?: {
    title?: string
    description?: string
    image?: string
  }
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export const useStorePagesStore = defineStore('storePages', {
  state: () => ({
    pages: [] as StorePage[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchPages() {
      this.loading = true
      this.error = null
      // Mock fetch
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.pages = [
            {
              id: '1',
              title: 'من نحن',
              slug: 'about',
              type: 'system',
              content: '<p>صفحة تعريفية بالمتجر...</p>',
              status: 'published',
              seo: { title: 'من نحن | متجرنا', description: 'تعرف على متجرنا وقصتنا' },
              publishedAt: '2023-01-10T10:00:00Z',
              createdAt: '2023-01-01T10:00:00Z',
              updatedAt: '2023-01-10T10:00:00Z'
            },
            {
              id: '2',
              title: 'سياسة الخصوصية',
              slug: 'privacy-policy',
              type: 'system',
              content: '<p>سياسة الخصوصية...</p>',
              status: 'published',
              createdAt: '2023-01-01T10:00:00Z',
              updatedAt: '2023-01-01T10:00:00Z'
            },
            {
              id: '3',
              title: 'تواصل معنا',
              slug: 'contact',
              type: 'system',
              content: '<p>تواصل معنا...</p>',
              status: 'draft',
              createdAt: '2023-02-01T10:00:00Z',
              updatedAt: '2023-02-01T10:00:00Z'
            },
            {
              id: '4',
              title: 'الأسئلة الشائعة',
              slug: 'faq',
              type: 'custom',
              content: '<p>الأسئلة الشائعة...</p>',
              status: 'hidden',
              createdAt: '2023-03-01T10:00:00Z',
              updatedAt: '2023-03-01T10:00:00Z'
            }
          ]
          this.loading = false
          resolve()
        }, 800)
      })
    },
    async fetchPage(id: string) {
      if (!this.pages.length) await this.fetchPages()
      return this.pages.find(p => p.id === id) || null
    },
    async createPage(payload: Partial<StorePage>) {
      const newPage: StorePage = {
        id: Math.random().toString(36).substring(7),
        title: payload.title || '',
        slug: payload.slug || '',
        type: payload.type || 'custom',
        content: payload.content || '',
        status: payload.status || 'draft',
        seo: payload.seo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      if (newPage.status === 'published') {
        newPage.publishedAt = new Date().toISOString()
      }
      this.pages.unshift(newPage)
    },
    async updatePage(id: string, payload: Partial<StorePage>) {
      const index = this.pages.findIndex(p => p.id === id)
      if (index !== -1) {
        if (payload.status === 'published' && this.pages[index].status !== 'published') {
          payload.publishedAt = new Date().toISOString()
        }
        this.pages[index] = { ...this.pages[index], ...payload, updatedAt: new Date().toISOString() }
      }
    },
    async deletePage(id: string) {
      this.pages = this.pages.filter(p => p.id !== id)
    },
    async publishPage(id: string) {
      await this.updatePage(id, { status: 'published' })
    },
    async hidePage(id: string) {
      await this.updatePage(id, { status: 'hidden' })
    },
    async duplicatePage(id: string) {
      const page = this.pages.find(p => p.id === id)
      if (page) {
        const copy = { ...page }
        delete (copy as any).id
        copy.title = `${copy.title} — نسخة`
        copy.slug = `${copy.slug}-copy`
        copy.status = 'draft'
        copy.type = 'custom'
        await this.createPage(copy)
      }
    }
  }
})
