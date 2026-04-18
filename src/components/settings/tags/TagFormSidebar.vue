<script setup lang="ts">
import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import type { Tag } from '@/types'
import RightSidebar from '@/components/global/RightSidebar.vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  editItem?: Tag | null
  loading?: boolean
}

const open = defineModel<boolean>('open', { required: true })
const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [values: { name: string }]
}>()

const isEdit = computed(() => !!props.editItem)

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required').max(100),
  }),
)

const form = useForm({ validationSchema: formSchema })

watch(open, (val) => {
  if (val) {
    form.resetForm({ values: { name: props.editItem?.name ?? '' } })
  }
})

const onSubmit = form.handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <RightSidebar
    v-model:open="open"
    :title="isEdit ? 'Edit Tag' : 'Add Tag'"
    :description="isEdit ? 'Update the tag name.' : 'Add a new tag to categorize businesses.'"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              placeholder="e.g. Halal, Vegan, Family Friendly"
              :disabled="loading"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button variant="outline" :disabled="loading" @click="open = false">Cancel</Button>
        <Button :disabled="loading" @click="onSubmit">
          {{ loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Tag' }}
        </Button>
      </div>
    </template>
  </RightSidebar>
</template>
