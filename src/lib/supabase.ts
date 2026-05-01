import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}
export const tablePrefix = 'bd-'
export const bucketPrefix = 'bd-'
export const instance = {
  businessCategories: {
    tableName: `${tablePrefix}business-categories`,
  },
  businessSubcategories: {
    tableName: `${tablePrefix}business-subcategories`,
  },
  services: {
    tableName: `${tablePrefix}services`,
  },
  facilities: {
    tableName: `${tablePrefix}facilities`,
  },
  paymentMethods: {
    tableName: `${tablePrefix}payment-methods`,
  },
  features: {
    tableName: `${tablePrefix}features`,
  },
  tags: {
    tableName: `${tablePrefix}tags`,
  },
  businessHours: {
    tableName: `${tablePrefix}business-hours`,
  },
  businesses: {
    tableName: `${tablePrefix}businesses`,
  },
  businessServices: {
    tableName: `${tablePrefix}business-services`,
  },
  businessFacilities: {
    tableName: `${tablePrefix}business-facilities`,
  },
  businessPaymentMethods: {
    tableName: `${tablePrefix}business-payment-methods`,
  },
  businessFeatures: {
    tableName: `${tablePrefix}business-features`,
  },
  businessTags: {
    tableName: `${tablePrefix}business-tags`,
  },
  countries: {
    tableName: `${tablePrefix}countries`,
  },
  divisions: {
    tableName: `${tablePrefix}divisions`,
  },
  districts: {
    tableName: `${tablePrefix}districts`,
  },
  upazilas: {
    tableName: `${tablePrefix}upazilas`,
  },
  businessMedia: {
    tableName: `${tablePrefix}business-media`,
  },
  priceRanges: {
    tableName: `${tablePrefix}price-ranges`,
  },
  users: {
    tableName: `${tablePrefix}users`,
  },
}

export const buckets = {
  businessMedia: 'business-directory',
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
