import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Division } from '@/types'
import { supabase, instance } from '@/lib/supabase'

const TABLE = instance.divisions.tableName

export const useDivisionsStore = defineStore('divisions', () => {
  const items = ref<Division[]>([]) // filtered by country (for table)
  const allItems = ref<Division[]>([]) // all divisions (for District filter dropdown)
  const loading = ref(false)
  const activeCountryId = ref<string | null>(null)

  async function fetchAll() {
    const { data, error } = await supabase.from(TABLE).select('*').order('name')
    if (error) throw error
    allItems.value = data ?? []
  }

  async function fetchByCountry(countryId: string) {
    activeCountryId.value = countryId
    loading.value = true
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('country_id', countryId)
        .order('name')
      if (error) throw error
      items.value = data ?? []
    } finally {
      loading.value = false
    }
  }

  async function create(name: string, countryId: string): Promise<void> {
    const { error } = await supabase.from(TABLE).insert({ name, country_id: countryId })
    if (error) throw error
    await fetchAll()
    if (activeCountryId.value) await fetchByCountry(activeCountryId.value)
  }

  async function update(id: string, name: string, countryId: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .update({ name, country_id: countryId })
      .eq('id', id)
    if (error) throw error
    await fetchAll()
    if (activeCountryId.value) await fetchByCountry(activeCountryId.value)
  }

  async function remove(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
    await fetchAll()
    if (activeCountryId.value) await fetchByCountry(activeCountryId.value)
  }

  return {
    items,
    allItems,
    loading,
    activeCountryId,
    fetchAll,
    fetchByCountry,
    create,
    update,
    remove,
  }
})
