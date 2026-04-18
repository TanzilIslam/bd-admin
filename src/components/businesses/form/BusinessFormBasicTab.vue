<script setup lang="ts">
import { watch } from 'vue'
import type { FormContext } from 'vee-validate'
import type { BusinessForm } from '@/types'
import { useBusinessCategoriesStore } from '@/stores/businessCategoriesStore'
import { useBusinessSubcategoriesStore } from '@/stores/businessSubcategoriesStore'
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

const props = defineProps<{ form: FormContext<BusinessForm>; isEdit: boolean }>()

const categoriesStore = useBusinessCategoriesStore()
const subcategoriesStore = useBusinessSubcategoriesStore()

// Auto-generate slug from name on create
watch(
  () => props.form.values.name,
  (name) => {
    if (props.isEdit || !name) return
    props.form.setFieldValue(
      'slug',
      name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    )
  },
)

// Load subcategories when category changes
watch(
  () => props.form.values.category_id,
  (categoryId) => {
    if (!categoryId) return
    subcategoriesStore.fetchByCategory(categoryId)
    props.form.setFieldValue('subcategory_id', '')
  },
)

categoriesStore.fetchAll()
</script>

<template>
  <div class="space-y-6">
    <!-- Identity -->
    <div class="rounded-lg border bg-card p-6 space-y-5">
      <div>
        <h3 class="text-sm font-semibold">Identity</h3>
        <p class="text-xs text-muted-foreground mt-0.5">
          The public name and URL identifier for this business.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-5">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Business Name <span class="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="e.g. The Coffee House" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="slug">
          <FormItem>
            <FormLabel>Slug <span class="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="e.g. the-coffee-house" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              v-bind="componentField"
              placeholder="A short description of the business…"
              :rows="4"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <!-- Classification -->
    <div class="rounded-lg border bg-card p-6 space-y-5">
      <div>
        <h3 class="text-sm font-semibold">Classification</h3>
        <p class="text-xs text-muted-foreground mt-0.5">
          Category, subcategory, and founding year.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-5">
        <FormField v-slot="{ componentField }" name="category_id">
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="cat in categoriesStore.items" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="subcategory_id">
          <FormItem>
            <FormLabel>Subcategory</FormLabel>
            <Select v-bind="componentField" :disabled="!form.values.category_id">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="sub in subcategoriesStore.items" :key="sub.id" :value="sub.id">
                  {{ sub.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div class="grid grid-cols-2 gap-5">
        <FormField v-slot="{ componentField }" name="established_year">
          <FormItem>
            <FormLabel>Established Year</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="number" placeholder="e.g. 2010" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>
  </div>
</template>
