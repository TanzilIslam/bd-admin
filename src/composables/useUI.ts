import { reactive } from 'vue'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DeleteConfirmState {
  open: boolean
  title: string
  description: string
  loading: boolean
  onConfirm: (() => void | Promise<void>) | null
}

// ─── State (module-level — shared across all callers) ─────────────────────────

const deleteConfirm = reactive<DeleteConfirmState>({
  open: false,
  title: 'Delete Item',
  description: 'Are you sure you want to delete this item? This action cannot be undone.',
  loading: false,
  onConfirm: null,
})

// ─── Composable ───────────────────────────────────────────────────────────────

export function useUI() {
  function openDeleteConfirm(options: {
    title?: string
    description?: string
    onConfirm: () => void | Promise<void>
  }) {
    deleteConfirm.title = options.title ?? 'Delete Item'
    deleteConfirm.description =
      options.description ??
      'Are you sure you want to delete this item? This action cannot be undone.'
    deleteConfirm.onConfirm = options.onConfirm
    deleteConfirm.loading = false
    deleteConfirm.open = true
  }

  function closeDeleteConfirm() {
    deleteConfirm.open = false
    deleteConfirm.loading = false
    deleteConfirm.onConfirm = null
  }

  async function confirmDelete() {
    const cb = deleteConfirm.onConfirm
    if (!cb) return
    deleteConfirm.loading = true
    try {
      await cb()
    } finally {
      closeDeleteConfirm()
    }
  }

  function getDeleteConfirm() {
    return deleteConfirm
  }

  return {
    getDeleteConfirm,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDelete,
  }
}
