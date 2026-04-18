<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import DeleteConfirmDialog from '@/components/global/DeleteConfirmDialog.vue'
</script>

<template>
  <RouterView />

  <!-- Global UI layer — only truly app-wide singletons here -->
  <Toaster position="top-right" rich-colors />
  <DeleteConfirmDialog />
</template>
