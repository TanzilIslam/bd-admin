<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { BusinessFilter } from '@/types'
import { BusinessStatus } from '@/types'
import { useBusinessCategoriesStore } from '@/stores/businessCategoriesStore'
import { useDivisionsStore } from '@/stores/divisionsStore'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-vue-next'

const emit = defineEmits<{ change: [filters: BusinessFilter] }>()

const categoriesStore = useBusinessCategoriesStore()
const divisionsStore = useDivisionsStore()

const search = ref('')
const status = ref('')
const categoryId = ref('')
const divisionId = ref('')

const hasFilters = ref(false)

function buildFilters(): BusinessFilter {
  return {
    ...(search.value && { search: search.value }),
    ...(status.value && { status: status.value as BusinessStatus }),
    ...(categoryId.value && { category_id: categoryId.value }),
    ...(divisionId.value && { division_id: divisionId.value }),
  }
}

function checkHasFilters() {
  hasFilters.value = !!(search.value || status.value || categoryId.value || divisionId.value)
}

function emitChange() {
  checkHasFilters()
  emit('change', buildFilters())
}

const debouncedSearch = useDebounceFn(emitChange, 300)

watch(search, debouncedSearch)
watch([status, categoryId, divisionId], emitChange)

function reset() {
  search.value = ''
  status.value = ''
  categoryId.value = ''
  divisionId.value = ''
}

// Load filter options
categoriesStore.fetchAll()
divisionsStore.fetchAll()
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Input v-model="search" placeholder="Search businesses…" class="w-52" />

    <Select v-model="status">
      <SelectTrigger class="w-36">
        <SelectValue placeholder="All statuses" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem :value="BusinessStatus.PENDING">Pending</SelectItem>
        <SelectItem :value="BusinessStatus.ACTIVE">Active</SelectItem>
        <SelectItem :value="BusinessStatus.REJECTED">Rejected</SelectItem>
        <SelectItem :value="BusinessStatus.SUSPENDED">Suspended</SelectItem>
      </SelectContent>
    </Select>

    <Select v-model="categoryId">
      <SelectTrigger class="w-44">
        <SelectValue placeholder="All categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All categories</SelectItem>
        <SelectItem v-for="cat in categoriesStore.items" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </SelectItem>
      </SelectContent>
    </Select>

    <Select v-model="divisionId">
      <SelectTrigger class="w-40">
        <SelectValue placeholder="All divisions" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All divisions</SelectItem>
        <SelectItem v-for="div in divisionsStore.allItems" :key="div.id" :value="div.id">
          {{ div.name }}
        </SelectItem>
      </SelectContent>
    </Select>

    <Button v-if="hasFilters" variant="ghost" size="sm" @click="reset">
      <X class="size-4" />
      Clear
    </Button>
  </div>
</template>
