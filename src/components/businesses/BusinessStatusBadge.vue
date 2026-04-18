<script setup lang="ts">
import { computed } from 'vue'
import { BusinessStatus } from '@/types'
import { Badge } from '@/components/ui/badge'
import type { BadgeVariants } from '@/components/ui/badge' // adjust path

const props = defineProps<{ status: BusinessStatus }>()

// Use BadgeVariants['variant'] instead of string
const variantMap: Record<BusinessStatus, BadgeVariants['variant']> = {
  [BusinessStatus.ACTIVE]: 'default',
  [BusinessStatus.PENDING]: 'secondary',
  [BusinessStatus.REJECTED]: 'destructive',
  [BusinessStatus.SUSPENDED]: 'outline',
}

const labelMap: Record<BusinessStatus, string> = {
  [BusinessStatus.ACTIVE]: 'Active',
  [BusinessStatus.PENDING]: 'Pending',
  [BusinessStatus.REJECTED]: 'Rejected',
  [BusinessStatus.SUSPENDED]: 'Suspended',
}

const variant = computed(() => variantMap[props.status])
const label = computed(() => labelMap[props.status])
</script>

<template>
  <Badge :variant="variant">{{ label }}</Badge>
</template>
