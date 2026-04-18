<script setup lang="ts">
import type { FormContext } from 'vee-validate'
import type { BusinessForm } from '@/types'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

defineProps<{ form: FormContext<BusinessForm> }>()
</script>

<template>
  <div class="space-y-6">
    <!-- Phone -->
    <div class="rounded-lg border bg-card p-6 space-y-5">
      <div>
        <h3 class="text-sm font-semibold">Phone</h3>
        <p class="text-xs text-muted-foreground mt-0.5">
          Primary contact numbers for the business.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField v-slot="{ componentField }" name="phone">
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="+880 1XXXXXXXXX" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="whatsapp">
          <FormItem>
            <FormLabel>WhatsApp</FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="+880 1XXXXXXXXX" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <!-- Online -->
    <div class="rounded-lg border bg-card p-6 space-y-5">
      <div>
        <h3 class="text-sm font-semibold">Online</h3>
        <p class="text-xs text-muted-foreground mt-0.5">Email address and website URL.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="email" placeholder="contact@business.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="website">
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="https://example.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>
  </div>
</template>
