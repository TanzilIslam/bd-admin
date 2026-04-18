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
  z.object({
    email: z.string().email('Enter a valid email'),
  }),
)

const form = useForm({ validationSchema: formSchema })

const onSubmit = form.handleSubmit((values) => {
  console.log(values)
  router.push('/auth/email-confirmation')
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
          <CardTitle class="text-lg">Forgot password</CardTitle>
          <CardDescription> Enter your email and we'll send you a reset link </CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="onSubmit">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="email" placeholder="you@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <Button type="submit" class="w-full">Send reset link</Button>
          </form>
        </CardContent>
      </Card>

      <p class="text-center text-sm text-muted-foreground">
        <RouterLink to="/auth/login" class="text-foreground font-medium hover:underline">
          Back to sign in
        </RouterLink>
      </p>
    </div>
  </div>
</template>
