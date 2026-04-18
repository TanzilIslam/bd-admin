<script setup lang="ts">
import { DAY_NAMES, type HourRow } from '@/stores/operatingHoursStore'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

defineProps<{ hours: HourRow[] }>()
</script>

<template>
  <div class="rounded-lg border bg-card">
    <div class="px-6 py-4 border-b">
      <h3 class="text-sm font-semibold">Operating Hours</h3>
      <p class="text-xs text-muted-foreground mt-0.5">
        Set open and close times for each day. Toggle Closed to mark a day as unavailable.
      </p>
    </div>

    <!-- Header -->
    <div
      class="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b bg-muted/40 text-xs font-medium text-muted-foreground uppercase tracking-wide"
    >
      <span>Day</span>
      <span>Opens</span>
      <span>Closes</span>
      <span class="w-16 text-center">Closed</span>
    </div>

    <!-- Rows -->
    <div class="divide-y">
      <div
        v-for="row in hours"
        :key="row.day_of_week"
        class="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-4 px-6 py-3 transition-colors"
        :class="row.is_closed ? 'bg-muted/30' : 'bg-card'"
      >
        <Label class="font-medium" :class="row.is_closed ? 'text-muted-foreground' : ''">
          {{ DAY_NAMES[row.day_of_week] }}
        </Label>

        <Input v-model="row.open_time" type="time" :disabled="row.is_closed" class="w-full" />

        <Input v-model="row.close_time" type="time" :disabled="row.is_closed" class="w-full" />

        <div class="w-16 flex justify-center">
          <Switch
            :checked="row.is_closed"
            @update:checked="(val: boolean) => (row.is_closed = val)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
