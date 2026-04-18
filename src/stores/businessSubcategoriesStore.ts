import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { BusinessSubcategory } from '@/types'
import { supabase, instance } from '@/lib/supabase'

const TABLE = instance.businessSubcategories.tableName

export const useBusinessSubcategoriesStore = defineStore('businessSubcategories', () => {
  const items = ref<BusinessSubcategory[]>([])
  const loading = ref(false)
  const activeCategoryId = ref<string | null>(null)

  async function fetchByCategory(categoryId: string) {
    activeCategoryId.value = categoryId
    loading.value = true
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('category_id', categoryId)
        .order('name')
      if (error) throw error
      items.value = data ?? []
    } finally {
      loading.value = false
    }
  }

  async function create(name: string, categoryId: string): Promise<void> {
    const { error } = await supabase.from(TABLE).insert({ name, category_id: categoryId })
    if (error) throw error
    if (activeCategoryId.value) await fetchByCategory(activeCategoryId.value)
  }

  async function update(id: string, name: string, categoryId: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .update({ name, category_id: categoryId })
      .eq('id', id)
    if (error) throw error
    if (activeCategoryId.value) await fetchByCategory(activeCategoryId.value)
  }

  async function remove(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
    if (activeCategoryId.value) await fetchByCategory(activeCategoryId.value)
  }

  return { items, loading, activeCategoryId, fetchByCategory, create, update, remove }
})
