import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { District } from '@/types'
import { supabase, instance } from '@/lib/supabase'

const TABLE = instance.districts.tableName

export const useDistrictsStore = defineStore('districts', () => {
  const items = ref<District[]>([]) // filtered by division (for table)
  const allItems = ref<District[]>([]) // all districts (for Upazila filter dropdown)
  const loading = ref(false)
  const activeDivisionId = ref<string | null>(null)

  async function fetchAll() {
    const { data, error } = await supabase.from(TABLE).select('*').order('name')
    if (error) throw error
    allItems.value = data ?? []
  }

  async function fetchByDivision(divisionId: string) {
    activeDivisionId.value = divisionId
    loading.value = true
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('division_id', divisionId)
        .order('name')
      if (error) throw error
      items.value = data ?? []
    } finally {
      loading.value = false
    }
  }

  async function create(name: string, divisionId: string): Promise<void> {
    const { error } = await supabase.from(TABLE).insert({ name, division_id: divisionId })
    if (error) throw error
    await fetchAll()
    if (activeDivisionId.value) await fetchByDivision(activeDivisionId.value)
  }

  async function update(id: string, name: string, divisionId: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .update({ name, division_id: divisionId })
      .eq('id', id)
    if (error) throw error
    await fetchAll()
    if (activeDivisionId.value) await fetchByDivision(activeDivisionId.value)
  }

  async function remove(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
    await fetchAll()
    if (activeDivisionId.value) await fetchByDivision(activeDivisionId.value)
  }

  return {
    items,
    allItems,
    loading,
    activeDivisionId,
    fetchAll,
    fetchByDivision,
    create,
    update,
    remove,
  }
})
