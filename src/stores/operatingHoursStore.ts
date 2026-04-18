import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { BusinessHour } from '@/types'
import { supabase, instance } from '@/lib/supabase'

const TABLE = instance.businessHours.tableName

export type HourRow = {
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function defaultHours(): HourRow[] {
  return DAY_NAMES.map((_, i) => ({
    day_of_week: i,
    open_time: '09:00',
    close_time: '18:00',
    is_closed: i === 0 || i === 6, // Sun & Sat closed by default
  }))
}

export { DAY_NAMES }

export const useOperatingHoursStore = defineStore('operatingHours', () => {
  const loading = ref(false)
  const saving = ref(false)

  async function fetchByBusiness(businessId: string): Promise<HourRow[]> {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select('day_of_week, open_time, close_time, is_closed')
        .eq('business_id', businessId)
        .order('day_of_week')
      if (error) throw error

      if (!data || data.length === 0) return defaultHours()

      // Merge fetched rows into a full 7-day array
      const base = defaultHours()
      for (const row of data as BusinessHour[]) {
        base[row.day_of_week] = {
          day_of_week: row.day_of_week,
          open_time: row.open_time ?? '09:00',
          close_time: row.close_time ?? '18:00',
          is_closed: row.is_closed,
        }
      }
      return base
    } finally {
      loading.value = false
    }
  }

  async function saveForBusiness(businessId: string, hours: HourRow[]): Promise<void> {
    saving.value = true
    try {
      await supabase.from(TABLE).delete().eq('business_id', businessId)
      const rows = hours.map((h) => ({ ...h, business_id: businessId }))
      const { error } = await supabase.from(TABLE).insert(rows)
      if (error) throw error
    } finally {
      saving.value = false
    }
  }

  return { loading, saving, fetchByBusiness, saveForBusiness }
})
