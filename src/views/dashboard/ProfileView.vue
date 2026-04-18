<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const auth = useAuthStore()
const user = auth.user
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-full">
    <div class="space-y-6 w-full max-w-lg">
      <div class="text-center">
        <h2 class="text-lg font-semibold">Profile</h2>
        <p class="text-sm text-muted-foreground">Your account information.</p>
      </div>

      <Card>
        <CardHeader>
          <div class="flex items-center gap-4">
            <Avatar class="size-14 rounded-lg">
              <AvatarFallback class="rounded-lg text-lg">
                {{ user?.email?.slice(0, 2).toUpperCase() }}
              </AvatarFallback>
            </Avatar>
            <div class="space-y-1">
              <CardTitle class="text-base">{{ user?.email }}</CardTitle>
              <Badge variant="secondary">Admin</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="space-y-1">
              <p class="text-muted-foreground">User ID</p>
              <p class="font-mono text-xs break-all">{{ user?.id }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-muted-foreground">Email</p>
              <p>{{ user?.email }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-muted-foreground">Email Confirmed</p>
              <p>
                {{
                  user?.email_confirmed_at
                    ? new Date(user.email_confirmed_at).toLocaleDateString()
                    : 'Not confirmed'
                }}
              </p>
            </div>
            <div class="space-y-1">
              <p class="text-muted-foreground">Last Sign In</p>
              <p>
                {{
                  user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : '—'
                }}
              </p>
            </div>
            <div class="space-y-1">
              <p class="text-muted-foreground">Account Created</p>
              <p>{{ user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—' }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-muted-foreground">Provider</p>
              <p class="capitalize">{{ user?.app_metadata?.provider ?? '—' }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
