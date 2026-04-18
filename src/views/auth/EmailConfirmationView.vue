<script setup lang="ts">
import { MailCheck } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30 p-4">
    <div class="w-full max-w-sm space-y-4">
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-semibold tracking-tight">Admin Portal</h1>
        <p class="text-muted-foreground text-sm">Business Directory</p>
      </div>

      <Card>
        <CardHeader class="pb-4 items-center text-center">
          <div class="bg-primary/10 rounded-full p-3 mb-2">
            <MailCheck class="h-6 w-6 text-primary" />
          </div>
          <CardTitle class="text-lg">Check your inbox</CardTitle>
          <CardDescription>
            We've sent you a link. Please check your email and follow the instructions.
          </CardDescription>
        </CardHeader>
        <CardContent class="text-center">
          <p class="text-sm text-muted-foreground mb-4">
            Didn't receive it? Check your spam folder or try again.
          </p>
          <Button variant="outline" class="w-full" as-child>
            <RouterLink to="/auth/forgot-password">Resend email</RouterLink>
          </Button>
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
