<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const router = useRouter()

const formSchema = toTypedSchema(
  z
    .object({
      password: z.string().min(8, 'Password must be at least 8 characters'),
      confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: 'Passwords do not match',
      path: ['confirm_password'],
    }),
)

const form = useForm({ validationSchema: formSchema })

const onSubmit = form.handleSubmit((values) => {
  console.log(values)
  router.push('/auth/login')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30 p-4">
    <div class="w-full max-w-sm space-y-4">
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-semibold tracking-tight">Admin Portal</h1>
        <p class="text-muted-foreground text-sm">Business Directory</p>
      </div>

      <Card>
        <CardHeader class="pb-4">
          <CardTitle class="text-lg">Reset password</CardTitle>
          <CardDescription>Enter and confirm your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="onSubmit">
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="password" placeholder="Min. 8 characters" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="confirm_password">
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="password" placeholder="••••••••" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <Button type="submit" class="w-full">Reset password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
