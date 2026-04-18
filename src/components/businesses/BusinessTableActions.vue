<script setup lang="ts">
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import type { Business } from '@/types'
import { BusinessStatus } from '@/types'
import { useBusinessStore } from '@/stores/businessStore'
import { useUI } from '@/composables/useUI'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  MoreHorizontal,
  Pencil,
  CheckCircle,
  XCircle,
  PauseCircle,
  Star,
  StarOff,
  Trash2,
} from 'lucide-vue-next'

const props = defineProps<{ business: Business }>()

const router = useRouter()
const store = useBusinessStore()
const { openDeleteConfirm } = useUI()

async function setStatus(status: BusinessStatus) {
  try {
    await store.updateStatus(props.business.id, status)
    toast.success(`Business marked as ${status}`)
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Something went wrong')
  }
}

async function toggleFeatured() {
  try {
    await store.toggleFeatured(props.business.id, !props.business.is_featured)
    toast.success(props.business.is_featured ? 'Removed from featured' : 'Marked as featured')
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Something went wrong')
  }
}

function handleDelete() {
  openDeleteConfirm({
    title: 'Delete Business',
    description: `Are you sure you want to delete "${props.business.name}"? This action cannot be undone.`,
    onConfirm: async () => {
      await store.remove(props.business.id)
      toast.success('Business deleted')
    },
  })
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon-sm">
        <MoreHorizontal class="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        @click="router.push({ name: 'business-edit', params: { id: business.id } })"
      >
        <Pencil class="mr-2 size-4" />
        Edit
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        v-if="business.status !== BusinessStatus.ACTIVE"
        @click="setStatus(BusinessStatus.ACTIVE)"
      >
        <CheckCircle class="mr-2 size-4 text-green-600" />
        Approve
      </DropdownMenuItem>
      <DropdownMenuItem
        v-if="business.status !== BusinessStatus.REJECTED"
        @click="setStatus(BusinessStatus.REJECTED)"
      >
        <XCircle class="mr-2 size-4 text-destructive" />
        Reject
      </DropdownMenuItem>
      <DropdownMenuItem
        v-if="business.status !== BusinessStatus.SUSPENDED"
        @click="setStatus(BusinessStatus.SUSPENDED)"
      >
        <PauseCircle class="mr-2 size-4 text-yellow-600" />
        Suspend
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem @click="toggleFeatured">
        <component :is="business.is_featured ? StarOff : Star" class="mr-2 size-4" />
        {{ business.is_featured ? 'Remove Featured' : 'Mark Featured' }}
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem class="text-destructive" @click="handleDelete">
        <Trash2 class="mr-2 size-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
