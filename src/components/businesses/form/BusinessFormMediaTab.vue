<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useMediaUpload } from '@/composables/useMediaUpload'
import { useGalleryStore } from '@/stores/galleryStore'
import { Button } from '@/components/ui/button'
import { ImagePlus, Trash2, Loader2, Plus } from 'lucide-vue-next'

interface Props {
  businessId?: string
  logoUrl: string
  coverUrl: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:logoUrl': [value: string]
  'update:coverUrl': [value: string]
}>()

const { upload, remove, uploadGallery, removeGallery } = useMediaUpload()
const galleryStore = useGalleryStore()

const logoInput = ref<HTMLInputElement | null>(null)
const coverInput = ref<HTMLInputElement | null>(null)
const galleryInput = ref<HTMLInputElement | null>(null)
const uploadingLogo = ref(false)
const uploadingCover = ref(false)
const uploadingGallery = ref(false)

const MAX_GALLERY = 10

async function handleUpload(type: 'logo' | 'cover', file: File) {
  if (!props.businessId) {
    toast.error('Save the business first before uploading media')
    return
  }

  const isLogo = type === 'logo'
  if (isLogo) uploadingLogo.value = true
  else uploadingCover.value = true

  try {
    const url = await upload(props.businessId, type, file)
    if (isLogo) emit('update:logoUrl', url)
    else emit('update:coverUrl', url)
    toast.success(`${isLogo ? 'Logo' : 'Cover'} uploaded`)
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Upload failed')
  } finally {
    uploadingLogo.value = false
    uploadingCover.value = false
  }
}

function onFileChange(type: 'logo' | 'cover', event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) handleUpload(type, file)
}

async function handleRemove(type: 'logo' | 'cover') {
  const url = type === 'logo' ? props.logoUrl : props.coverUrl
  if (!url || !props.businessId) return
  try {
    await remove(props.businessId, type, url)
    if (type === 'logo') emit('update:logoUrl', '')
    else emit('update:coverUrl', '')
    toast.success(`${type === 'logo' ? 'Logo' : 'Cover'} removed`)
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Remove failed')
  }
}

async function onGalleryFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  ;(event.target as HTMLInputElement).value = ''
  if (!file || !props.businessId) return
  if (galleryStore.items.length >= MAX_GALLERY) {
    toast.error(`Gallery is full (max ${MAX_GALLERY} items)`)
    return
  }

  uploadingGallery.value = true
  try {
    const url = await uploadGallery(props.businessId, file)
    const type = file.type.startsWith('video/') ? 'video' : 'image'
    await galleryStore.add(props.businessId, url, type)
    toast.success('Gallery item added')
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Upload failed')
  } finally {
    uploadingGallery.value = false
  }
}

async function handleGalleryRemove(id: string, url: string) {
  try {
    await removeGallery(url)
    await galleryStore.remove(id)
    toast.success('Gallery item removed')
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'Remove failed')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Warning -->
    <div
      v-if="!businessId"
      class="rounded-lg border border-dashed px-6 py-8 text-center text-sm text-muted-foreground"
    >
      Save the business first to enable media uploads.
    </div>

    <!-- Logo -->
    <div class="rounded-lg border bg-card p-6 space-y-5">
      <div>
        <h3 class="text-sm font-semibold">Logo</h3>
        <p class="text-xs text-muted-foreground mt-0.5">
          Recommended: 400×400px, max 5MB (JPG, PNG, WebP)
        </p>
      </div>

      <div class="flex items-center gap-6">
        <!-- Preview -->
        <div
          class="shrink-0 size-28 rounded-xl border bg-muted overflow-hidden flex items-center justify-center"
        >
          <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="size-full object-cover" />
          <ImagePlus v-else class="size-8 text-muted-foreground/50" />
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-2">
          <input
            ref="logoInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="hidden"
            @change="onFileChange('logo', $event)"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            :disabled="!businessId || uploadingLogo"
            @click="logoInput?.click()"
          >
            <Loader2 v-if="uploadingLogo" class="size-4 animate-spin" />
            <ImagePlus v-else class="size-4" />
            {{ logoUrl ? 'Replace Logo' : 'Upload Logo' }}
          </Button>
          <Button
            v-if="logoUrl"
            type="button"
            variant="ghost"
            size="sm"
            class="text-destructive hover:text-destructive"
            @click="handleRemove('logo')"
          >
            <Trash2 class="size-4" />
            Remove
          </Button>
        </div>
      </div>
    </div>

    <!-- Cover -->
    <div class="rounded-lg border bg-card p-6 space-y-5">
      <div>
        <h3 class="text-sm font-semibold">Cover Image</h3>
        <p class="text-xs text-muted-foreground mt-0.5">
          Recommended: 1200×400px, max 5MB (JPG, PNG, WebP)
        </p>
      </div>

      <!-- Preview -->
      <div
        class="relative w-full h-48 rounded-xl border bg-muted overflow-hidden flex items-center justify-center"
      >
        <img v-if="coverUrl" :src="coverUrl" alt="Cover" class="size-full object-cover" />
        <ImagePlus v-else class="size-10 text-muted-foreground/50" />
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <input
          ref="coverInput"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          @change="onFileChange('cover', $event)"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          :disabled="!businessId || uploadingCover"
          @click="coverInput?.click()"
        >
          <Loader2 v-if="uploadingCover" class="size-4 animate-spin" />
          <ImagePlus v-else class="size-4" />
          {{ coverUrl ? 'Replace Cover' : 'Upload Cover' }}
        </Button>
        <Button
          v-if="coverUrl"
          type="button"
          variant="ghost"
          size="sm"
          class="text-destructive hover:text-destructive"
          @click="handleRemove('cover')"
        >
          <Trash2 class="size-4" />
          Remove
        </Button>
      </div>
    </div>

    <!-- Gallery -->
    <div class="rounded-lg border bg-card p-6 space-y-5">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-semibold">Gallery</h3>
          <p class="text-xs text-muted-foreground mt-0.5">
            Max 10 items — JPG, PNG, WebP (5MB) or MP4, WebM (50MB)
          </p>
        </div>
        <span class="text-xs text-muted-foreground tabular-nums">
          {{ galleryStore.items.length }} / {{ MAX_GALLERY }}
        </span>
      </div>

      <!-- Grid -->
      <div
        v-if="galleryStore.items.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
      >
        <div
          v-for="item in galleryStore.items"
          :key="item.id"
          class="group relative aspect-square rounded-lg border bg-muted overflow-hidden"
        >
          <video
            v-if="item.type === 'video'"
            :src="item.url"
            class="size-full object-cover"
            muted
            preload="metadata"
          />
          <img v-else :src="item.url" :alt="item.id" class="size-full object-cover" />
          <button
            type="button"
            class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
            @click="handleGalleryRemove(item.id, item.url)"
          >
            <Trash2 class="size-5 text-white" />
          </button>
        </div>
      </div>

      <!-- Upload button -->
      <div>
        <input
          ref="galleryInput"
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          class="hidden"
          @change="onGalleryFileChange"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          :disabled="!businessId || uploadingGallery || galleryStore.items.length >= MAX_GALLERY"
          @click="galleryInput?.click()"
        >
          <Loader2 v-if="uploadingGallery" class="size-4 animate-spin" />
          <Plus v-else class="size-4" />
          Add to Gallery
        </Button>
      </div>
    </div>
  </div>
</template>
