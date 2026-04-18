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
import type { BusinessSubcategory } from '@/types'
import type { AcceptableValue } from 'reka-ui'
import { useBusinessCategoriesStore } from '@/stores/businessCategoriesStore'
import { useBusinessSubcategoriesStore } from '@/stores/businessSubcategoriesStore'
import { useUI } from '@/composables/useUI'
import BusinessSubcategoryFormSidebar from '@/components/settings/business-categories/BusinessSubcategoryFormSidebar.vue'
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

const categoriesStore = useBusinessCategoriesStore()
const store = useBusinessSubcategoriesStore()
const { openDeleteConfirm } = useUI()

// ── Filter state ──────────────────────────────────────────────────────────────
const selectedCategoryId = ref<string>('')

function onCategoryChange(categoryId: AcceptableValue) {
  if (!categoryId) return
  selectedCategoryId.value = categoryId as string
  store.fetchByCategory(categoryId as string)
}

// ── Sidebar state ─────────────────────────────────────────────────────────────
const sidebarOpen = ref(false)
const editItem = ref<BusinessSubcategory | null>(null)
const submitting = ref(false)

function openCreate() {
  editItem.value = null
  sidebarOpen.value = true
}

function openEdit(item: BusinessSubcategory) {
  editItem.value = item
  sidebarOpen.value = true
}

async function handleFormSubmit(values: { name: string; category_id: string }) {
  submitting.value = true
  try {
    if (editItem.value) {
      await store.update(editItem.value.id, values.name, values.category_id)
      toast.success('Subcategory updated')
    } else {
      await store.create(values.name, values.category_id)
      toast.success('Subcategory added')
    }
    sidebarOpen.value = false
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Something went wrong')
  } finally {
    submitting.value = false
  }
}

function handleDelete(item: BusinessSubcategory) {
  openDeleteConfirm({
    title: 'Delete Subcategory',
    description: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
    onConfirm: async () => {
      await store.remove(item.id)
      toast.success('Subcategory deleted')
    },
  })
}

// ── Table ─────────────────────────────────────────────────────────────────────
const globalFilter = ref('')
const columnHelper = createColumnHelper<BusinessSubcategory>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Created',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.display({
    id: 'actions',
    header: () => '',
    cell: () => null,
  }),
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

onMounted(() => categoriesStore.fetchAll())
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold">Business Sub Categories</h2>
        <p class="text-sm text-muted-foreground">
          Manage subcategories within each business category.
        </p>
      </div>
      <Button size="sm" :disabled="!selectedCategoryId" @click="openCreate">
        <Plus class="size-4" />
        Add Subcategory
      </Button>
    </div>

    <!-- Filter + Search -->
    <div class="flex items-center gap-2">
      <Select :model-value="selectedCategoryId" @update:model-value="onCategoryChange">
        <SelectTrigger class="w-52">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="category in categoriesStore.items"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </SelectItem>
        </SelectContent>
      </Select>

      <template v-if="selectedCategoryId">
        <Input
          :model-value="globalFilter"
          placeholder="Search subcategories…"
          class="max-w-xs"
          @update:model-value="(v) => (globalFilter = String(v))"
        />
        <span class="text-sm text-muted-foreground"
          >{{ filteredCount }} result{{ filteredCount !== 1 ? 's' : '' }}</span
        >
      </template>
    </div>

    <!-- Empty prompt -->
    <template v-if="!selectedCategoryId">
      <p class="py-8 text-center text-sm text-muted-foreground">
        Select a category to view its subcategories.
      </p>
    </template>

    <!-- Table -->
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
                <TableCell :colspan="3">
                  <div class="h-4 w-full animate-pulse rounded bg-muted" />
                </TableCell>
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

            <TableEmpty v-else :colspan="3">No subcategories found for this category.</TableEmpty>
          </TableBody>
        </Table>
      </div>
    </template>
  </div>

  <!-- Form sidebar -->
  <BusinessSubcategoryFormSidebar
    v-model:open="sidebarOpen"
    :edit-item="editItem"
    :categories="categoriesStore.items"
    :default-category-id="selectedCategoryId"
    :loading="submitting"
    @submit="handleFormSubmit"
  />
</template>
