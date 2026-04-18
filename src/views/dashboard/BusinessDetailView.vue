<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import { ArrowLeft, Loader2 } from 'lucide-vue-next'
import { BusinessStatus, PriceRange, YesNo } from '@/types'
import { useBusinessStore } from '@/stores/businessStore'
import { useAuthStore } from '@/stores/authStore'
import { useOperatingHoursStore, defaultHours, type HourRow } from '@/stores/operatingHoursStore'
import { useGalleryStore } from '@/stores/galleryStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import BusinessFormBasicTab from '@/components/businesses/form/BusinessFormBasicTab.vue'
import BusinessFormContactTab from '@/components/businesses/form/BusinessFormContactTab.vue'
import BusinessFormLocationTab from '@/components/businesses/form/BusinessFormLocationTab.vue'
import BusinessFormDetailsTab from '@/components/businesses/form/BusinessFormDetailsTab.vue'
import BusinessFormAdminTab from '@/components/businesses/form/BusinessFormAdminTab.vue'
import BusinessFormHoursTab from '@/components/businesses/form/BusinessFormHoursTab.vue'
import BusinessFormMediaTab from '@/components/businesses/form/BusinessFormMediaTab.vue'

const route = useRoute()
const router = useRouter()
const store = useBusinessStore()
const auth = useAuthStore()
const hoursStore = useOperatingHoursStore()
const galleryStore = useGalleryStore()

const id = computed(() => route.params.id as string | undefined)
const isEdit = computed(() => !!id.value)

const hours = ref<HourRow[]>(defaultHours())
const logoUrl = ref('')
const coverUrl = ref('')

// ── Form schema ────────────────────────────────────────────────────────────────

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required').max(200),
    slug: z
      .string()
      .min(1, 'Slug is required')
      .max(200)
      .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
    description: z.string().max(2000).optional(),
    established_year: z.coerce.number().int().min(1800).max(2100).optional().or(z.literal('')),
    category_id: z.string().optional(),
    subcategory_id: z.string().optional(),
    phone: z.string().max(20).optional(),
    whatsapp: z.string().max(20).optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    country_id: z.string().optional(),
    division_id: z.string().optional(),
    district_id: z.string().optional(),
    upazila_id: z.string().optional(),
    area: z.string().max(100).optional(),
    address: z.string().max(500).optional(),
    map_link: z.string().url('Invalid URL').optional().or(z.literal('')),
    price_range: z.nativeEnum(PriceRange).optional(),
    delivery_available: z.nativeEnum(YesNo).optional(),
    booking_available: z.nativeEnum(YesNo).optional(),
    services: z.array(z.string()).optional(),
    facilities: z.array(z.string()).optional(),
    payment_methods: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    status: z.nativeEnum(BusinessStatus),
    is_featured: z.boolean().optional(),
  }),
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    status: BusinessStatus.PENDING,
    is_featured: false,
    services: [],
    facilities: [],
    payment_methods: [],
    features: [],
    tags: [],
  },
})

// ── Load existing business ─────────────────────────────────────────────────────

onMounted(async () => {
  if (!isEdit.value) return
  await store.fetchById(id.value!)
  const business = store.currentBusiness
  if (!business) return

  const [pivots, fetchedHours] = await Promise.all([
    store.fetchPivots(id.value!),
    hoursStore.fetchByBusiness(id.value!),
    galleryStore.fetchByBusiness(id.value!),
  ])
  hours.value = fetchedHours
  logoUrl.value = business.logo_url ?? ''
  coverUrl.value = business.cover_url ?? ''

  form.resetForm({
    values: {
      name: business.name,
      slug: business.slug,
      description: business.description ?? '',
      established_year: business.established_year ?? '',
      category_id: business.category_id ?? '',
      subcategory_id: business.subcategory_id ?? '',
      phone: business.phone ?? '',
      whatsapp: business.whatsapp ?? '',
      email: business.email ?? '',
      website: business.website ?? '',
      country_id: business.country_id ?? '',
      division_id: business.division_id ?? '',
      district_id: business.district_id ?? '',
      upazila_id: business.upazila_id ?? '',
      area: business.area ?? '',
      address: business.address ?? '',
      map_link: business.map_link ?? '',
      price_range: business.price_range,
      delivery_available: business.delivery_available,
      booking_available: business.booking_available,
      status: business.status,
      is_featured: business.is_featured ?? false,
      ...pivots,
    },
  })
})

// ── Submit ─────────────────────────────────────────────────────────────────────

const onSubmit = form.handleSubmit(async (values) => {
  try {
    const mediaFields = {
      logo_url: logoUrl.value || null,
      cover_url: coverUrl.value || null,
    }

    if (isEdit.value) {
      await Promise.all([
        store.update(id.value!, { ...values, ...mediaFields }),
        hoursStore.saveForBusiness(id.value!, hours.value),
      ])
      toast.success('Business updated')
    } else {
      const payload = { ...values, ...mediaFields }
      if (!auth.isAdmin()) payload.owner_id = auth.profile!.id
      const created = await store.create(payload)
      await hoursStore.saveForBusiness(created.id, hours.value)
      toast.success('Business created')
      router.replace({ name: 'business-edit', params: { id: created.id } })
    }
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Something went wrong')
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" @click="router.push({ name: 'businesses' })">
          <ArrowLeft class="size-4" />
        </Button>
        <div>
          <h2 class="text-lg font-semibold">
            {{ isEdit ? (store.currentBusiness?.name ?? 'Edit Business') : 'New Business' }}
          </h2>
          <p class="text-sm text-muted-foreground">
            {{ isEdit ? 'Update business details' : 'Fill in the details to add a new business' }}
          </p>
        </div>
      </div>
      <Button :disabled="store.saving" @click="onSubmit">
        <Loader2 v-if="store.saving" class="size-4 animate-spin" />
        {{ store.saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Business' }}
      </Button>
    </div>

    <!-- Loading skeleton -->
    <template v-if="store.loading">
      <div class="space-y-3">
        <div v-for="i in 6" :key="i" class="h-10 w-full animate-pulse rounded bg-muted" />
      </div>
    </template>

    <!-- Tabs -->
    <template v-else>
      <form @submit.prevent="onSubmit">
        <Tabs default-value="basic">
          <TabsList>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger v-if="auth.isAdmin()" value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" class="mt-6">
            <BusinessFormBasicTab :form="form" :is-edit="isEdit" />
          </TabsContent>

          <TabsContent value="contact" class="mt-6">
            <BusinessFormContactTab :form="form" />
          </TabsContent>

          <TabsContent value="location" class="mt-6">
            <BusinessFormLocationTab :form="form" />
          </TabsContent>

          <TabsContent value="details" class="mt-6">
            <BusinessFormDetailsTab :form="form" />
          </TabsContent>

          <TabsContent value="hours" class="mt-6">
            <BusinessFormHoursTab :hours="hours" />
          </TabsContent>

          <TabsContent value="media" class="mt-6">
            <BusinessFormMediaTab
              :business-id="id"
              :logo-url="logoUrl"
              :cover-url="coverUrl"
              @update:logo-url="logoUrl = $event"
              @update:cover-url="coverUrl = $event"
            />
          </TabsContent>

          <TabsContent v-if="auth.isAdmin()" value="admin" class="mt-6">
            <BusinessFormAdminTab :form="form" :business="store.currentBusiness" />
          </TabsContent>
        </Tabs>
      </form>
    </template>
  </div>
</template>
