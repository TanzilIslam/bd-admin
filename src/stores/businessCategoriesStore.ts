import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { BusinessCategory } from '@/types'
import { supabase, instance } from '@/lib/supabase'

const TABLE = instance.businessCategories.tableName

export const useBusinessCategoriesStore = defineStore('businessCategories', () => {
  const items = ref<BusinessCategory[]>([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const { data, error } = await supabase.from(TABLE).select('*').order('name')
      if (error) throw error
      items.value = data ?? []
    } finally {
      loading.value = false
    }
  }

  async function create(name: string, slug: string): Promise<void> {
    const { error } = await supabase.from(TABLE).insert({ name, slug })
    if (error) throw error
    await fetchAll()
  }

  async function update(id: string, name: string, slug: string): Promise<void> {
    const { error } = await supabase.from(TABLE).update({ name, slug }).eq('id', id)
    if (error) throw error
    await fetchAll()
  }

  async function remove(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
    await fetchAll()
  }

  return { items, loading, fetchAll, create, update, remove }
})
