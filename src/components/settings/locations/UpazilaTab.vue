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
import type { Upazila } from '@/types'
import type { AcceptableValue } from 'reka-ui'
import { useDistrictsStore } from '@/stores/districtsStore'
import { useUpazilasStore } from '@/stores/upazilasStore'
import { useUI } from '@/composables/useUI'
import UpazilaFormSidebar from './UpazilaFormSidebar.vue'
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

const districtsStore = useDistrictsStore()
const store = useUpazilasStore()
const { openDeleteConfirm } = useUI()

const selectedDistrictId = ref<string>('')
const sidebarOpen = ref(false)
const editItem = ref<Upazila | null>(null)
const submitting = ref(false)

function onDistrictChange(districtId: AcceptableValue) {
  if (!districtId) return
  selectedDistrictId.value = districtId as string
  store.fetchByDistrict(districtId as string)
}

function openCreate() {
  editItem.value = null
  sidebarOpen.value = true
}

function openEdit(item: Upazila) {
  editItem.value = item
  sidebarOpen.value = true
}

async function handleFormSubmit(values: { name: string; district_id: string }) {
  submitting.value = true
  try {
    if (editItem.value) {
      await store.update(editItem.value.id, values.name, values.district_id)
      toast.success('Upazila updated')
    } else {
      await store.create(values.name, values.district_id)
      toast.success('Upazila added')
    }
    sidebarOpen.value = false
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Something went wrong')
  } finally {
    submitting.value = false
  }
}

function handleDelete(item: Upazila) {
  openDeleteConfirm({
    title: 'Delete Upazila',
    description: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
    onConfirm: async () => {
      await store.remove(item.id)
      toast.success('Upazila deleted')
    },
  })
}

const globalFilter = ref('')
const columnHelper = createColumnHelper<Upazila>()

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

onMounted(() => districtsStore.fetchAll())
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Select :model-value="selectedDistrictId" @update:model-value="onDistrictChange">
          <SelectTrigger class="w-48">
            <SelectValue placeholder="Select a district" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="district in districtsStore.allItems"
              :key="district.id"
              :value="district.id"
            >
              {{ district.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <template v-if="selectedDistrictId">
          <Input
            :model-value="globalFilter"
            placeholder="Search upazilas…"
            class="max-w-xs"
            @update:model-value="(v) => (globalFilter = String(v))"
          />
          <span class="text-sm text-muted-foreground">
            {{ filteredCount }} result{{ filteredCount !== 1 ? 's' : '' }}
          </span>
        </template>
      </div>
      <Button size="sm" :disabled="!selectedDistrictId" @click="openCreate">
        <Plus class="size-4" />
        Add Upazila
      </Button>
    </div>

    <template v-if="!selectedDistrictId">
      <p class="py-8 text-center text-sm text-muted-foreground">
        Select a district to view its upazilas.
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
            <TableEmpty v-else :colspan="3">No upazilas found for this district.</TableEmpty>
          </TableBody>
        </Table>
      </div>
    </template>
  </div>

  <UpazilaFormSidebar
    v-model:open="sidebarOpen"
    :edit-item="editItem"
    :districts="districtsStore.allItems"
    :default-district-id="selectedDistrictId"
    :loading="submitting"
    @submit="handleFormSubmit"
  />
</template>
