import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Business, BusinessFilter, BusinessForm } from '@/types'
import { BusinessStatus } from '@/types'
import { supabase, instance } from '@/lib/supabase'

const TABLE = instance.businesses.tableName
const PAGE_SIZE = 20

export const useBusinessStore = defineStore('business', () => {
  const items = ref<Business[]>([])
  const currentBusiness = ref<Business | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const total = ref(0)
  const page = ref(1)
  const activeFilters = ref<BusinessFilter>({})

  // ── List ───────────────────────────────────────────────────────────────────

  async function fetchAll(filters: BusinessFilter = {}, pageNum = 1) {
    loading.value = true
    activeFilters.value = filters
    page.value = pageNum
    try {
      const from = (pageNum - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      let query = supabase
        .from(TABLE)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (filters.search) query = query.ilike('name', `%${filters.search}%`)
      if (filters.status) query = query.eq('status', filters.status)
      if (filters.category_id) query = query.eq('category_id', filters.category_id)
      if (filters.division_id) query = query.eq('division_id', filters.division_id)
      if (filters.district_id) query = query.eq('district_id', filters.district_id)
      if (filters.owner_id) query = query.eq('owner_id', filters.owner_id)

      const { data, error, count } = await query
      if (error) throw error
      items.value = data ?? []
      total.value = count ?? 0
    } finally {
      loading.value = false
    }
  }

  // ── Single ─────────────────────────────────────────────────────────────────

  async function fetchById(id: string): Promise<void> {
    loading.value = true
    try {
      const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
      if (error) throw error
      currentBusiness.value = data
    } finally {
      loading.value = false
    }
  }

  // ── Pivot helpers ──────────────────────────────────────────────────────────

  async function fetchPivots(businessId: string): Promise<{
    services: string[]
    facilities: string[]
    payment_methods: string[]
    features: string[]
    tags: string[]
  }> {
    const [services, facilities, paymentMethods, features, tags] = await Promise.all([
      supabase
        .from(instance.businessServices.tableName)
        .select('service_id')
        .eq('business_id', businessId),
      supabase
        .from(instance.businessFacilities.tableName)
        .select('facility_id')
        .eq('business_id', businessId),
      supabase
        .from(instance.businessPaymentMethods.tableName)
        .select('payment_method_id')
        .eq('business_id', businessId),
      supabase
        .from(instance.businessFeatures.tableName)
        .select('feature_id')
        .eq('business_id', businessId),
      supabase.from(instance.businessTags.tableName).select('tag_id').eq('business_id', businessId),
    ])

    return {
      services: (services.data ?? []).map((r: { service_id: string }) => r.service_id),
      facilities: (facilities.data ?? []).map((r: { facility_id: string }) => r.facility_id),
      payment_methods: (paymentMethods.data ?? []).map(
        (r: { payment_method_id: string }) => r.payment_method_id,
      ),
      features: (features.data ?? []).map((r: { feature_id: string }) => r.feature_id),
      tags: (tags.data ?? []).map((r: { tag_id: string }) => r.tag_id),
    }
  }

  async function syncPivots(businessId: string, form: BusinessForm): Promise<void> {
    const pivots: Array<{ table: string; col: string; ids: string[] }> = [
      { table: instance.businessServices.tableName, col: 'service_id', ids: form.services ?? [] },
      {
        table: instance.businessFacilities.tableName,
        col: 'facility_id',
        ids: form.facilities ?? [],
      },
      {
        table: instance.businessPaymentMethods.tableName,
        col: 'payment_method_id',
        ids: form.payment_methods ?? [],
      },
      { table: instance.businessFeatures.tableName, col: 'feature_id', ids: form.features ?? [] },
      { table: instance.businessTags.tableName, col: 'tag_id', ids: form.tags ?? [] },
    ]

    await Promise.all(
      pivots.map(async ({ table, col, ids }) => {
        await supabase.from(table).delete().eq('business_id', businessId)
        if (ids.length > 0) {
          await supabase
            .from(table)
            .insert(ids.map((id) => ({ business_id: businessId, [col]: id })))
        }
      }),
    )
  }

  // ── CRUD ───────────────────────────────────────────────────────────────────

  async function create(form: BusinessForm): Promise<Business> {
    saving.value = true
    try {
      const { services, facilities, payment_methods, features, tags, ...fields } = form
      const { data, error } = await supabase.from(TABLE).insert(fields).select().single()
      if (error) throw error
      await syncPivots(data.id, { services, facilities, payment_methods, features, tags })
      return data
    } finally {
      saving.value = false
    }
  }

  async function update(id: string, form: BusinessForm): Promise<void> {
    saving.value = true
    try {
      const { services, facilities, payment_methods, features, tags, ...fields } = form
      const { error } = await supabase.from(TABLE).update(fields).eq('id', id)
      if (error) throw error
      await syncPivots(id, { services, facilities, payment_methods, features, tags })
    } finally {
      saving.value = false
    }
  }

  async function updateStatus(id: string, status: BusinessStatus): Promise<void> {
    const { error } = await supabase.from(TABLE).update({ status }).eq('id', id)
    if (error) throw error
    await fetchAll(activeFilters.value, page.value)
  }

  async function toggleFeatured(id: string, value: boolean): Promise<void> {
    const { error } = await supabase.from(TABLE).update({ is_featured: value }).eq('id', id)
    if (error) throw error
    await fetchAll(activeFilters.value, page.value)
  }

  async function remove(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
    await fetchAll(activeFilters.value, page.value)
  }

  return {
    items,
    currentBusiness,
    loading,
    saving,
    total,
    page,
    pageSize: PAGE_SIZE,
    activeFilters,
    fetchAll,
    fetchById,
    fetchPivots,
    create,
    update,
    updateStatus,
    toggleFeatured,
    remove,
  }
})
