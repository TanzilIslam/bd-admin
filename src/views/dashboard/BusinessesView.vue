<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useVueTable, getCoreRowModel, createColumnHelper, FlexRender } from '@tanstack/vue-table'
import { Plus, Star } from 'lucide-vue-next'
import type { Business, BusinessFilter } from '@/types'
import { useBusinessStore } from '@/stores/businessStore'
import { useAuthStore } from '@/stores/authStore'
import BusinessFilters from '@/components/businesses/BusinessFilters.vue'
import BusinessStatusBadge from '@/components/businesses/BusinessStatusBadge.vue'
import BusinessTableActions from '@/components/businesses/BusinessTableActions.vue'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const router = useRouter()
const store = useBusinessStore()
const auth = useAuthStore()

function ownerFilter(filters: BusinessFilter): BusinessFilter {
  if (!auth.isAdmin()) return { ...filters, owner_id: auth.profile!.id }
  return filters
}

function handleFilterChange(filters: BusinessFilter) {
  store.fetchAll(ownerFilter(filters), 1)
}

const columnHelper = createColumnHelper<Business>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('is_featured', {
    header: '',
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
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true,
  get rowCount() {
    return store.total
  },
})

const totalPages = computed(() => Math.ceil(store.total / store.pageSize))

onMounted(() => store.fetchAll(ownerFilter({})))
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold">Businesses</h2>
        <p class="text-sm text-muted-foreground">
          {{ store.total }} business{{ store.total !== 1 ? 'es' : '' }} total
        </p>
      </div>
      <Button size="sm" @click="router.push({ name: 'business-create' })">
        <Plus class="size-4" />
        Add Business
      </Button>
    </div>

    <!-- Filters -->
    <BusinessFilters @change="handleFilterChange" />

    <!-- Table -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :class="
                header.column.id === 'actions'
                  ? 'w-16'
                  : header.column.id === 'is_featured'
                    ? 'w-10'
                    : ''
              "
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
            <TableRow v-for="i in 5" :key="i">
              <TableCell :colspan="5">
                <div class="h-4 w-full animate-pulse rounded bg-muted" />
              </TableCell>
            </TableRow>
          </template>

          <template v-else-if="table.getRowModel().rows.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              class="cursor-pointer"
              @click="router.push({ name: 'business-edit', params: { id: row.original.id } })"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" @click.stop>
                <template v-if="cell.column.id === 'status'">
                  <BusinessStatusBadge :status="row.original.status" />
                </template>
                <template v-else-if="cell.column.id === 'is_featured'">
                  <Star
                    v-if="row.original.is_featured"
                    class="size-4 fill-yellow-400 text-yellow-400"
                  />
                </template>
                <template v-else-if="cell.column.id === 'actions'">
                  <BusinessTableActions :business="row.original" />
                </template>
                <template v-else>
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </template>
              </TableCell>
            </TableRow>
          </template>

          <TableEmpty v-else :colspan="5">No businesses found.</TableEmpty>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between text-sm text-muted-foreground"
    >
      <span>Page {{ store.page }} of {{ totalPages }}</span>
      <div class="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="store.page <= 1"
          @click="store.fetchAll(store.activeFilters, store.page - 1)"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="store.page >= totalPages"
          @click="store.fetchAll(store.activeFilters, store.page + 1)"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
