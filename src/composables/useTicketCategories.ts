import { ref } from 'vue'
import { getFormOptions } from '@/api/mobile/ticket'
import type { DictOption } from '@/types'

const categories = ref<DictOption[]>([])
let loaded = false
let loadingPromise: Promise<void> | null = null

function ensureLoaded(): Promise<void> {
  if (loaded) return Promise.resolve()
  if (!loadingPromise) {
    loadingPromise = getFormOptions()
      .then(opts => {
        categories.value = opts.categories ?? []
        loaded = true
      })
      .catch(() => {
        categories.value = []
      })
  }
  return loadingPromise
}

function categoryLabel(categoryId: number | string | null | undefined): string {
  if (categoryId === null || categoryId === undefined || categoryId === '') return ''
  const found = categories.value.find(c => String(c.value) === String(categoryId))
  return found?.label ?? String(categoryId)
}

export function useTicketCategories() {
  return { categories, ensureLoaded, categoryLabel }
}
