<script setup lang="ts">
import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import type { BusinessCategory } from '@/types'
import RightSidebar from '@/components/global/RightSidebar.vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  editItem?: BusinessCategory | null
  loading?: boolean
}

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [values: { name: string; slug: string }]
}>()

const isEdit = computed(() => !!props.editItem)

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required').max(100),
    slug: z
      .string()
      .min(1, 'Slug is required')
      .max(100)
      .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  }),
)

const form = useForm({ validationSchema: formSchema })

watch(open, (val) => {
  if (val) {
    form.resetForm({
      values: {
        name: props.editItem?.name ?? '',
        slug: props.editItem?.slug ?? '',
      },
    })
  }
})

// Auto-generate slug from name when creating
watch(
  () => form.values.name,
  (name) => {
    if (!name) return
    form.setFieldValue(
      'slug',
      name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    )
  },
)

const onSubmit = form.handleSubmit((values) => emit('submit', values))
</script>

<template>
  <RightSidebar
    v-model:open="open"
    :title="isEdit ? 'Edit Category' : 'Add Category'"
    :description="isEdit ? 'Update the category details.' : 'Add a new business category.'"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="e.g. Restaurant" :disabled="loading" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="slug">
        <FormItem>
          <FormLabel>Slug</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="e.g. restaurant" :disabled="loading" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button variant="outline" :disabled="loading" @click="open = false">Cancel</Button>
        <Button :disabled="loading" @click="onSubmit">
          {{ loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Category' }}
        </Button>
      </div>
    </template>
  </RightSidebar>
</template>
