<script setup lang="ts">
import type { FormContext } from 'vee-validate'
import type { Business, BusinessForm } from '@/types'
import { BusinessStatus } from '@/types'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

defineProps<{ form: FormContext<BusinessForm>; business?: Business | null }>()

const featuredOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Settings -->
    <div class="rounded-lg border bg-card p-6 space-y-5">
      <div>
        <h3 class="text-sm font-semibold">Settings</h3>
        <p class="text-xs text-muted-foreground mt-0.5">
          Control visibility and status of this business.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField v-slot="{ componentField }" name="status">
          <FormItem>
            <FormLabel>Status <span class="text-destructive">*</span></FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem :value="BusinessStatus.PENDING">Pending</SelectItem>
                <SelectItem :value="BusinessStatus.ACTIVE">Active</SelectItem>
                <SelectItem :value="BusinessStatus.REJECTED">Rejected</SelectItem>
                <SelectItem :value="BusinessStatus.SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="is_featured">
          <FormItem>
            <FormLabel>Featured</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="opt in featuredOptions"
                  :key="String(opt.value)"
                  :value="opt.value as any"
                >
                  {{ opt.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <!-- Read-only Info -->
    <div v-if="business" class="rounded-lg border bg-card p-6 space-y-4">
      <div>
        <h3 class="text-sm font-semibold">System Info</h3>
        <p class="text-xs text-muted-foreground mt-0.5">
          Read-only metadata for this business record.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="space-y-1">
          <p class="text-xs text-muted-foreground">Business ID</p>
          <p class="font-mono text-xs break-all">{{ business.id }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs text-muted-foreground">Owner ID</p>
          <p class="font-mono text-xs break-all">{{ business.owner_id ?? '—' }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs text-muted-foreground">Created</p>
          <p>{{ new Date(business.created_at).toLocaleString() }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-xs text-muted-foreground">Last Updated</p>
          <p>{{ business.updated_at ? new Date(business.updated_at).toLocaleString() : '—' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
