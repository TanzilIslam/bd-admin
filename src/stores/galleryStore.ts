import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase, instance } from '@/lib/supabase'
import type { BusinessMedia } from '@/types'

const TABLE = instance.businessMedia.tableName

export const useGalleryStore = defineStore('gallery', () => {
  const items = ref<BusinessMedia[]>([])
  const loading = ref(false)

  async function fetchByBusiness(businessId: string) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: true })
      if (error) throw error
      items.value = data ?? []
    } finally {
      loading.value = false
    }
  }

  async function add(businessId: string, url: string, type: 'image' | 'video') {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({ business_id: businessId, url, type })
      .select()
      .single()
    if (error) throw error
    items.value.push(data)
  }

  async function remove(id: string) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
    items.value = items.value.filter((i) => i.id !== id)
  }

  return { items, loading, fetchByBusiness, add, remove }
})
