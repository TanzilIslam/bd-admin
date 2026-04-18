import { ref } from 'vue'
import { supabase, buckets } from '@/lib/supabase'

const BUCKET = buckets.businessMedia
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 5

const GALLERY_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
const GALLERY_MAX_SIZE_MB = 50

export function useMediaUpload() {
  const uploading = ref(false)

  async function upload(businessId: string, type: 'logo' | 'cover', file: File): Promise<string> {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error('Only JPG, PNG, and WebP images are allowed')
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`File size must be under ${MAX_SIZE_MB}MB`)
    }

    uploading.value = true
    try {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${businessId}/${type}.${ext}`

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type })

      if (error) throw error

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      // Bust cache with timestamp to force re-render after replace
      return `${data.publicUrl}?t=${Date.now()}`
    } finally {
      uploading.value = false
    }
  }

  async function remove(businessId: string, type: 'logo' | 'cover', url: string): Promise<void> {
    // Extract path from URL (everything after the bucket segment)
    const marker = `/${BUCKET}/`
    const idx = url.indexOf(marker)
    if (idx === -1) return
    const path = url.slice(idx + marker.length).split('?')[0] ?? ''
    await supabase.storage.from(BUCKET).remove([path])
  }

  async function uploadGallery(businessId: string, file: File): Promise<string> {
    if (!GALLERY_ACCEPTED_TYPES.includes(file.type)) {
      throw new Error('Only JPG, PNG, WebP images and MP4, WebM videos are allowed')
    }
    if (file.size > GALLERY_MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`File size must be under ${GALLERY_MAX_SIZE_MB}MB`)
    }

    uploading.value = true
    try {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${businessId}/gallery/${crypto.randomUUID()}.${ext}`

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false, contentType: file.type })

      if (error) throw error

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      return data.publicUrl
    } finally {
      uploading.value = false
    }
  }

  async function removeGallery(url: string): Promise<void> {
    const marker = `/${BUCKET}/`
    const idx = url.indexOf(marker)
    if (idx === -1) return
    const path = url.slice(idx + marker.length).split('?')[0] ?? ''
    await supabase.storage.from(BUCKET).remove([path])
  }

  return { uploading, upload, remove, uploadGallery, removeGallery }
}
