import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Facility } from '@/types'
import { supabase, instance } from '@/lib/supabase'

const TABLE = instance.facilities.tableName

export const useFacilitiesStore = defineStore('facilities', () => {
  const items = ref<Facility[]>([])
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

  async function create(name: string): Promise<void> {
    const { error } = await supabase.from(TABLE).insert({ name })
    if (error) throw error
    await fetchAll()
  }

  async function update(id: string, name: string): Promise<void> {
    const { error } = await supabase.from(TABLE).update({ name }).eq('id', id)
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
