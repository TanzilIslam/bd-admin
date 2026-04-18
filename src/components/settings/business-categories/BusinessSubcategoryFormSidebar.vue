<script setup lang="ts">
import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import type { BusinessCategory, BusinessSubcategory } from '@/types'
import RightSidebar from '@/components/global/RightSidebar.vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  editItem?: BusinessSubcategory | null
  categories: BusinessCategory[]
  defaultCategoryId?: string
  loading?: boolean
}

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [values: { name: string; category_id: string }]
}>()

const isEdit = computed(() => !!props.editItem)

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required').max(100),
    category_id: z.string().min(1, 'Category is required'),
  }),
)

const form = useForm({ validationSchema: formSchema })

watch(open, (val) => {
  if (val) {
    form.resetForm({
      values: {
        name: props.editItem?.name ?? '',
        category_id: props.editItem?.category_id ?? props.defaultCategoryId ?? '',
      },
    })
  }
})

const onSubmit = form.handleSubmit((values) => emit('submit', values))
</script>

<template>
  <RightSidebar
    v-model:open="open"
    :title="isEdit ? 'Edit Subcategory' : 'Add Subcategory'"
    :description="isEdit ? 'Update the subcategory details.' : 'Add a new subcategory.'"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <FormField v-slot="{ componentField }" name="category_id">
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select v-bind="componentField" :disabled="loading">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="e.g. Fast Food" :disabled="loading" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button variant="outline" :disabled="loading" @click="open = false">Cancel</Button>
        <Button :disabled="loading" @click="onSubmit">
          {{ loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Subcategory' }}
        </Button>
      </div>
    </template>
  </RightSidebar>
</template>
