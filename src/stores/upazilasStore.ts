import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Upazila } from '@/types'
import { supabase, instance } from '@/lib/supabase'

const TABLE = instance.upazilas.tableName

export const useUpazilasStore = defineStore('upazilas', () => {
  const items = ref<Upazila[]>([])
  const loading = ref(false)
  const activeDistrictId = ref<string | null>(null)

  async function fetchByDistrict(districtId: string) {
    activeDistrictId.value = districtId
    loading.value = true
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('district_id', districtId)
        .order('name')
      if (error) throw error
      items.value = data ?? []
    } finally {
      loading.value = false
    }
  }

  async function create(name: string, districtId: string): Promise<void> {
    const { error } = await supabase.from(TABLE).insert({ name, district_id: districtId })
    if (error) throw error
    if (activeDistrictId.value) await fetchByDistrict(activeDistrictId.value)
  }

  async function update(id: string, name: string, districtId: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE)
      .update({ name, district_id: districtId })
      .eq('id', id)
    if (error) throw error
    if (activeDistrictId.value) await fetchByDistrict(activeDistrictId.value)
  }

  async function remove(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
    if (activeDistrictId.value) await fetchByDistrict(activeDistrictId.value)
  }

  return { items, loading, activeDistrictId, fetchByDistrict, create, update, remove }
})
