<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(1, 'Password is required'),
  }),
)

const form = useForm({ validationSchema: formSchema })
const serverError = ref('')

const onSubmit = form.handleSubmit(async (values) => {
  serverError.value = ''
  try {
    await auth.login(values.email, values.password)
    const redirect =
      typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard/overview'
    router.push(redirect)
  } catch (err: unknown) {
    serverError.value = err instanceof Error ? err.message : 'Login failed. Please try again.'
    toast.error(serverError.value)
  }
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
          <CardTitle class="text-lg">Sign in</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="onSubmit">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="email"
                    placeholder="you@example.com"
                    :disabled="auth.loading"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <div class="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <RouterLink
                    to="/auth/forgot-password"
                    class="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </RouterLink>
                </div>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="password"
                    placeholder="••••••••"
                    :disabled="auth.loading"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <p v-if="serverError" class="text-sm text-destructive">{{ serverError }}</p>

            <Button type="submit" class="w-full" :disabled="auth.loading">
              {{ auth.loading ? 'Signing in…' : 'Sign in' }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p class="text-center text-sm text-muted-foreground">
        Don't have an account?
        <RouterLink to="/auth/signup" class="text-foreground font-medium hover:underline">
          Sign up
        </RouterLink>
      </p>
    </div>
  </div>
</template>
