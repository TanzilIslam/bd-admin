<script setup lang="ts">
import { onMounted } from 'vue'
import type { FormContext } from 'vee-validate'
import type { BusinessForm } from '@/types'
import { PriceRange, YesNo } from '@/types'
import { useServicesStore } from '@/stores/servicesStore'
import { useFacilitiesStore } from '@/stores/facilitiesStore'
import { usePaymentMethodsStore } from '@/stores/paymentMethodsStore'
import { useFeaturesStore } from '@/stores/featuresStore'
import { useTagsStore } from '@/stores/tagsStore'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

defineProps<{ form: FormContext<BusinessForm> }>()

const servicesStore = useServicesStore()
const facilitiesStore = useFacilitiesStore()
const paymentMethodsStore = usePaymentMethodsStore()
const featuresStore = useFeaturesStore()
const tagsStore = useTagsStore()

onMounted(() => {
  servicesStore.fetchAll()
  facilitiesStore.fetchAll()
  paymentMethodsStore.fetchAll()
  featuresStore.fetchAll()
  tagsStore.fetchAll()
})

function toggleItem(
  field: keyof Pick<
    BusinessForm,
    'services' | 'facilities' | 'payment_methods' | 'features' | 'tags'
  >,
  id: string,
  form: FormContext<BusinessForm>,
) {
  const current: string[] = (form.values[field] as string[]) ?? []
  const updated = current.includes(id) ? current.filter((v) => v !== id) : [...current, id]
  form.setFieldValue(field, updated)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Pricing & Availability -->
    <div class="rounded-lg border bg-card p-6 space-y-5">
      <div>
        <h3 class="text-sm font-semibold">Pricing & Availability</h3>
        <p class="text-xs text-muted-foreground mt-0.5">
          Set price range and service availability options.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FormField v-slot="{ componentField }" name="price_range">
          <FormItem>
            <FormLabel>Price Range</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="range in Object.values(PriceRange)" :key="range" :value="range">
                  <span class="capitalize">{{ range }}</span>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="delivery_available">
          <FormItem>
            <FormLabel>Delivery Available</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="opt in Object.values(YesNo)" :key="opt" :value="opt">
                  <span class="capitalize">{{ opt }}</span>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="booking_available">
          <FormItem>
            <FormLabel>Booking Available</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="opt in Object.values(YesNo)" :key="opt" :value="opt">
                  <span class="capitalize">{{ opt }}</span>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <!-- Services & Facilities -->
    <div class="rounded-lg border bg-card p-6 space-y-5">
      <div>
        <h3 class="text-sm font-semibold">Services & Facilities</h3>
        <p class="text-xs text-muted-foreground mt-0.5">Select what this business offers.</p>
      </div>

      <div class="space-y-1.5">
        <Label class="text-sm font-medium">Services</Label>
        <div class="grid grid-cols-2 gap-y-2 gap-x-4 mt-2">
          <div v-for="item in servicesStore.items" :key="item.id" class="flex items-center gap-2">
            <Checkbox
              :id="`service-${item.id}`"
              :checked="(form.values.services ?? []).includes(item.id)"
              @update:checked="toggleItem('services', item.id, form)"
            />
            <Label :for="`service-${item.id}`" class="cursor-pointer font-normal">{{
              item.name
            }}</Label>
          </div>
        </div>
      </div>

      <div class="border-t pt-4 space-y-1.5">
        <Label class="text-sm font-medium">Facilities</Label>
        <div class="grid grid-cols-2 gap-y-2 gap-x-4 mt-2">
          <div v-for="item in facilitiesStore.items" :key="item.id" class="flex items-center gap-2">
            <Checkbox
              :id="`facility-${item.id}`"
              :checked="(form.values.facilities ?? []).includes(item.id)"
              @update:checked="toggleItem('facilities', item.id, form)"
            />
            <Label :for="`facility-${item.id}`" class="cursor-pointer font-normal">{{
              item.name
            }}</Label>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment, Features & Tags -->
    <div class="rounded-lg border bg-card p-6 space-y-5">
      <div>
        <h3 class="text-sm font-semibold">Payment, Features & Tags</h3>
        <p class="text-xs text-muted-foreground mt-0.5">
          How customers pay and how the business is categorised.
        </p>
      </div>

      <div class="space-y-1.5">
        <Label class="text-sm font-medium">Payment Methods</Label>
        <div class="grid grid-cols-2 gap-y-2 gap-x-4 mt-2">
          <div
            v-for="item in paymentMethodsStore.items"
            :key="item.id"
            class="flex items-center gap-2"
          >
            <Checkbox
              :id="`payment-${item.id}`"
              :checked="(form.values.payment_methods ?? []).includes(item.id)"
              @update:checked="toggleItem('payment_methods', item.id, form)"
            />
            <Label :for="`payment-${item.id}`" class="cursor-pointer font-normal">{{
              item.name
            }}</Label>
          </div>
        </div>
      </div>

      <div class="border-t pt-4 space-y-1.5">
        <Label class="text-sm font-medium">Features</Label>
        <div class="grid grid-cols-2 gap-y-2 gap-x-4 mt-2">
          <div v-for="item in featuresStore.items" :key="item.id" class="flex items-center gap-2">
            <Checkbox
              :id="`feature-${item.id}`"
              :checked="(form.values.features ?? []).includes(item.id)"
              @update:checked="toggleItem('features', item.id, form)"
            />
            <Label :for="`feature-${item.id}`" class="cursor-pointer font-normal">{{
              item.name
            }}</Label>
          </div>
        </div>
      </div>

      <div class="border-t pt-4 space-y-1.5">
        <Label class="text-sm font-medium">Tags</Label>
        <div class="grid grid-cols-2 gap-y-2 gap-x-4 mt-2">
          <div v-for="item in tagsStore.items" :key="item.id" class="flex items-center gap-2">
            <Checkbox
              :id="`tag-${item.id}`"
              :checked="(form.values.tags ?? []).includes(item.id)"
              @update:checked="toggleItem('tags', item.id, form)"
            />
            <Label :for="`tag-${item.id}`" class="cursor-pointer font-normal">{{
              item.name
            }}</Label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
