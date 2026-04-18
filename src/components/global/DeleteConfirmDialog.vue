<script setup lang="ts">
import { useUI } from '@/composables/useUI'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

const { getDeleteConfirm, closeDeleteConfirm, confirmDelete } = useUI()
const state = getDeleteConfirm()
</script>

<template>
  <AlertDialog
    :open="state.open"
    @update:open="(v) => !v && !state.loading && closeDeleteConfirm()"
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ state.title }}</AlertDialogTitle>
        <AlertDialogDescription>{{ state.description }}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="state.loading" @click="closeDeleteConfirm">
          Cancel
        </AlertDialogCancel>
        <Button variant="destructive" :disabled="state.loading" @click="confirmDelete">
          {{ state.loading ? 'Deleting…' : 'Delete' }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
