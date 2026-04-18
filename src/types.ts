/* =========================================================
   ENUMS
========================================================= */

export enum UserRole {
  ADMIN = 'admin',
  BUSINESS_OWNER = 'business_owner',
}

export enum BusinessStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export enum YesNo {
  YES = 'yes',
  NO = 'no',
}

export enum PriceRange {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  PREMIUM = 'premium',
}

/* =========================================================
   BASE TYPES
========================================================= */

export interface BaseEntity {
  id: string
  created_at: string
  updated_at?: string
}

/* =========================================================
   USER
========================================================= */

export interface User extends BaseEntity {
  email: string
  full_name?: string
  phone?: string
  role: UserRole
  avatar_url?: string
}

/* =========================================================
   LOCATION
========================================================= */

export interface Country extends BaseEntity {
  name: string
}

export interface Division extends BaseEntity {
  name: string
  country_id: string
}

export interface District extends BaseEntity {
  name: string
  division_id: string
}

export interface Upazila extends BaseEntity {
  name: string
  district_id: string
}

/* =========================================================
   BUSINESS CATEGORY
========================================================= */

export interface BusinessCategory extends BaseEntity {
  name: string
  slug: string
}

export interface BusinessSubcategory extends BaseEntity {
  name: string
  category_id: string
}

/* =========================================================
   BUSINESS RELATED OPTIONS (ADMIN CONTROLLED)
========================================================= */

export interface Service extends BaseEntity {
  name: string
}

export interface Facility extends BaseEntity {
  name: string
}

export interface PaymentMethod extends BaseEntity {
  name: string
}

export interface Feature extends BaseEntity {
  name: string
}

export interface Tag extends BaseEntity {
  name: string
}

/* =========================================================
   BUSINESS
========================================================= */

export interface Business extends BaseEntity {
  owner_id: string

  name: string
  slug: string
  description?: string
  established_year?: number

  logo_url?: string
  cover_url?: string

  phone?: string
  whatsapp?: string
  email?: string
  website?: string

  country_id?: string
  division_id?: string
  district_id?: string
  upazila_id?: string

  area?: string
  address?: string
  map_link?: string

  category_id?: string
  subcategory_id?: string

  price_range?: PriceRange

  delivery_available?: YesNo
  booking_available?: YesNo

  status: BusinessStatus
  is_featured?: boolean
}

/* =========================================================
   BUSINESS HOURS
========================================================= */

export interface BusinessHour extends BaseEntity {
  business_id: string
  day_of_week: number // 0 = Sunday, 6 = Saturday
  open_time?: string // "09:00"
  close_time?: string // "18:00"
  is_closed: boolean
}

/* =========================================================
   BUSINESS MEDIA
========================================================= */

export interface BusinessMedia extends BaseEntity {
  business_id: string
  url: string
  type: 'image' | 'video'
}

/* =========================================================
   PIVOT TABLES (MANY-TO-MANY)
========================================================= */

export interface BusinessService {
  business_id: string
  service_id: string
}

export interface BusinessFacility {
  business_id: string
  facility_id: string
}

export interface BusinessPaymentMethod {
  business_id: string
  payment_method_id: string
}

export interface BusinessFeature {
  business_id: string
  feature_id: string
}

export interface BusinessTag {
  business_id: string
  tag_id: string
}

/* =========================================================
   FORM TYPES (IMPORTANT FOR VEE-VALIDATE + ZOD)
========================================================= */

export interface BusinessForm {
  name?: string
  slug?: string
  description?: string
  established_year?: number | ''

  category_id?: string
  subcategory_id?: string

  phone?: string
  whatsapp?: string
  email?: string
  website?: string

  country_id?: string
  division_id?: string
  district_id?: string
  upazila_id?: string

  area?: string
  address?: string
  map_link?: string

  price_range?: PriceRange
  delivery_available?: YesNo
  booking_available?: YesNo

  services?: string[]
  facilities?: string[]
  payment_methods?: string[]
  features?: string[]
  tags?: string[]

  owner_id?: string
  status?: BusinessStatus
  is_featured?: boolean
}

/* =========================================================
   FILTER TYPES (FOR ADMIN TABLE)
========================================================= */

export interface BusinessFilter {
  search?: string
  category_id?: string
  division_id?: string
  district_id?: string
  status?: BusinessStatus
  owner_id?: string
}
