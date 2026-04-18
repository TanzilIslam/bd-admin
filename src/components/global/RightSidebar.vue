<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

interface Props {
  title: string
  description?: string
}

const open = defineModel<boolean>('open', { required: true })
defineProps<Props>()
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent class="flex flex-col gap-0 p-0 sm:max-w-md">
      <SheetHeader class="border-b px-6 py-4">
        <SheetTitle>{{ title }}</SheetTitle>
        <SheetDescription v-if="description">{{ description }}</SheetDescription>
      </SheetHeader>

      <div class="flex-1 overflow-y-auto px-6 py-4">
        <slot />
      </div>

      <div v-if="$slots.footer" class="border-t px-6 py-4">
        <slot name="footer" />
      </div>
    </SheetContent>
  </Sheet>
</template>
