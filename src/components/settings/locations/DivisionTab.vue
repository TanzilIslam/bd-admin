<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getFilteredRowModel,
  createColumnHelper,
  FlexRender,
} from '@tanstack/vue-table'
import { toast } from 'vue-sonner'
import { Pencil, Trash2, Plus } from 'lucide-vue-next'
import type { Division } from '@/types'
import type { AcceptableValue } from 'reka-ui'
import { useCountriesStore } from '@/stores/countriesStore'
import { useDivisionsStore } from '@/stores/divisionsStore'
import { useUI } from '@/composables/useUI'
import DivisionFormSidebar from './DivisionFormSidebar.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const countriesStore = useCountriesStore()
const store = useDivisionsStore()
const { openDeleteConfirm } = useUI()

const selectedCountryId = ref<string>('')
const sidebarOpen = ref(false)
const editItem = ref<Division | null>(null)
const submitting = ref(false)

function onCountryChange(countryId: AcceptableValue) {
  if (!countryId) return
  selectedCountryId.value = countryId as string
  store.fetchByCountry(countryId as string)
}

function openCreate() {
  editItem.value = null
  sidebarOpen.value = true
}

function openEdit(item: Division) {
  editItem.value = item
  sidebarOpen.value = true
}

async function handleFormSubmit(values: { name: string; country_id: string }) {
  submitting.value = true
  try {
    if (editItem.value) {
      await store.update(editItem.value.id, values.name, values.country_id)
      toast.success('Division updated')
    } else {
      await store.create(values.name, values.country_id)
      toast.success('Division added')
    }
    sidebarOpen.value = false
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Something went wrong')
  } finally {
    submitting.value = false
  }
}

function handleDelete(item: Division) {
  openDeleteConfirm({
    title: 'Delete Division',
    description: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
    onConfirm: async () => {
      await store.remove(item.id)
      toast.success('Division deleted')
    },
  })
}

const globalFilter = ref('')
const columnHelper = createColumnHelper<Division>()

const columns = [
  columnHelper.accessor('name', { header: 'Name', cell: (info) => info.getValue() }),
  columnHelper.accessor('created_at', {
    header: 'Created',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.display({ id: 'actions', header: () => '', cell: () => null }),
]

const table = useVueTable({
  get data() {
    return store.items
  },
  columns,
  state: {
    get globalFilter() {
      return globalFilter.value
    },
  },
  onGlobalFilterChange: (val) => (globalFilter.value = val),
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})

const filteredCount = computed(() => table.getRowModel().rows.length)

onMounted(() => countriesStore.fetchAll())
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Select :model-value="selectedCountryId" @update:model-value="onCountryChange">
          <SelectTrigger class="w-48">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="country in countriesStore.items"
              :key="country.id"
              :value="country.id"
            >
              {{ country.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <template v-if="selectedCountryId">
          <Input
            :model-value="globalFilter"
            placeholder="Search divisions…"
            class="max-w-xs"
            @update:model-value="(v) => (globalFilter = String(v))"
          />
          <span class="text-sm text-muted-foreground">
            {{ filteredCount }} result{{ filteredCount !== 1 ? 's' : '' }}
          </span>
        </template>
      </div>
      <Button size="sm" :disabled="!selectedCountryId" @click="openCreate">
        <Plus class="size-4" />
        Add Division
      </Button>
    </div>

    <template v-if="!selectedCountryId">
      <p class="py-8 text-center text-sm text-muted-foreground">
        Select a country to view its divisions.
      </p>
    </template>

    <template v-else>
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <TableHead
                v-for="header in headerGroup.headers"
                :key="header.id"
                :class="header.column.id === 'actions' ? 'w-20' : ''"
              >
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="store.loading">
              <TableRow v-for="i in 3" :key="i">
                <TableCell :colspan="3"
                  ><div class="h-4 w-full animate-pulse rounded bg-muted"
                /></TableCell>
              </TableRow>
            </template>
            <template v-else-if="table.getRowModel().rows.length">
              <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <template v-if="cell.column.id === 'actions'">
                    <div class="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" @click="openEdit(row.original)">
                        <Pencil class="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        class="text-destructive hover:text-destructive"
                        @click="handleDelete(row.original)"
                      >
                        <Trash2 class="size-4" />
                      </Button>
                    </div>
                  </template>
                  <template v-else>
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                  </template>
                </TableCell>
              </TableRow>
            </template>
            <TableEmpty v-else :colspan="3">No divisions found for this country.</TableEmpty>
          </TableBody>
        </Table>
      </div>
    </template>
  </div>

  <DivisionFormSidebar
    v-model:open="sidebarOpen"
    :edit-item="editItem"
    :countries="countriesStore.items"
    :default-country-id="selectedCountryId"
    :loading="submitting"
    @submit="handleFormSubmit"
  />
</template>
