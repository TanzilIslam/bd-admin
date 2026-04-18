<script setup lang="ts">
import { watch } from 'vue'
import type { FormContext } from 'vee-validate'
import type { BusinessForm } from '@/types'
import { useCountriesStore } from '@/stores/countriesStore'
import { useDivisionsStore } from '@/stores/divisionsStore'
import { useDistrictsStore } from '@/stores/districtsStore'
import { useUpazilasStore } from '@/stores/upazilasStore'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{ form: FormContext<BusinessForm> }>()

const countriesStore = useCountriesStore()
const divisionsStore = useDivisionsStore()
const districtsStore = useDistrictsStore()
const upazilasStore = useUpazilasStore()

watch(
  () => props.form.values.country_id,
  (countryId) => {
    if (!countryId) return
    divisionsStore.fetchByCountry(countryId)
    props.form.setFieldValue('division_id', '')
    props.form.setFieldValue('district_id', '')
    props.form.setFieldValue('upazila_id', '')
  },
)

watch(
  () => props.form.values.division_id,
  (divisionId) => {
    if (!divisionId) return
    districtsStore.fetchByDivision(divisionId)
    props.form.setFieldValue('district_id', '')
    props.form.setFieldValue('upazila_id', '')
  },
)

watch(
  () => props.form.values.district_id,
  (districtId) => {
    if (!districtId) return
    upazilasStore.fetchByDistrict(districtId)
    props.form.setFieldValue('upazila_id', '')
  },
)

countriesStore.fetchAll()
</script>

<template>
  <div class="space-y-6">
    <!-- Geography -->
    <div class="rounded-lg border bg-card p-6 space-y-5">
      <div>
        <h3 class="text-sm font-semibold">Geography</h3>
        <p class="text-xs text-muted-foreground mt-0.5">
          Select the administrative region of the business.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-5">
        <FormField v-slot="{ componentField }" name="country_id">
          <FormItem>
            <FormLabel>Country</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="c in countriesStore.items" :key="c.id" :value="c.id">
                  {{ c.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="division_id">
          <FormItem>
            <FormLabel>Division</FormLabel>
            <Select v-bind="componentField" :disabled="!form.values.country_id">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="d in divisionsStore.items" :key="d.id" :value="d.id">
                  {{ d.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="district_id">
          <FormItem>
            <FormLabel>District</FormLabel>
            <Select v-bind="componentField" :disabled="!form.values.division_id">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="d in districtsStore.items" :key="d.id" :value="d.id">
                  {{ d.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="upazila_id">
          <FormItem>
            <FormLabel>Upazila</FormLabel>
            <Select v-bind="componentField" :disabled="!form.values.district_id">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select upazila" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="u in upazilasStore.items" :key="u.id" :value="u.id">
                  {{ u.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <!-- Address -->
    <div class="rounded-lg border bg-card p-6 space-y-5">
      <div>
        <h3 class="text-sm font-semibold">Address</h3>
        <p class="text-xs text-muted-foreground mt-0.5">
          Specific location details and map reference.
        </p>
      </div>

      <FormField v-slot="{ componentField }" name="area">
        <FormItem>
          <FormLabel>Area</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="e.g. Gulshan, Dhanmondi" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="address">
        <FormItem>
          <FormLabel>Street Address</FormLabel>
          <FormControl>
            <Textarea v-bind="componentField" placeholder="Full street address…" :rows="3" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="map_link">
        <FormItem>
          <FormLabel>Map Link</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="https://maps.google.com/…" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
  </div>
</template>
