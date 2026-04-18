<script setup lang="ts">
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Layers,
  Layers2,
  Wrench,
  Wifi,
  CreditCard,
  Hash,
  Globe,
  Star,
} from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

const router = useRouter()
const auth = useAuthStore()

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'login' })
}

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, to: '/dashboard/overview' },
  { label: 'Businesses', icon: Building2, to: { name: 'businesses' } },
]

const settingsOpen = ref(false)

const settingsItems = [
  { label: 'Users', icon: Users, to: '/dashboard/settings/users' },
  { label: 'Business Categories', icon: Layers, to: '/dashboard/settings/business-categories' },
  { label: 'Sub Categories', icon: Layers2, to: '/dashboard/settings/business-sub-categories' },
  { label: 'Services', icon: Wrench, to: '/dashboard/settings/services' },
  { label: 'Facilities', icon: Wifi, to: '/dashboard/settings/facilities' },
  { label: 'Payment Methods', icon: CreditCard, to: '/dashboard/settings/payment-methods' },
  { label: 'Features', icon: Star, to: '/dashboard/settings/features' },
  { label: 'Tags', icon: Hash, to: '/dashboard/settings/tags' },
  { label: 'Locations', icon: Globe, to: '/dashboard/settings/locations' },
]
</script>

<template>
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" as-child>
              <div class="flex items-center gap-2 cursor-default">
                <div
                  class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg shrink-0"
                >
                  <Building2 class="size-4" />
                </div>
                <div class="flex flex-col gap-0.5 leading-none">
                  <span class="font-semibold text-sm">BizDirectory</span>
                  <span class="text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in navItems" :key="item.label">
                <SidebarMenuButton as-child :tooltip="item.label">
                  <RouterLink :to="item.to">
                    <component :is="item.icon" />
                    <span>{{ item.label }}</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible v-if="auth.isAdmin()" v-model:open="settingsOpen" as-child>
                <SidebarMenuItem>
                  <CollapsibleTrigger as-child>
                    <SidebarMenuButton :tooltip="'Settings'">
                      <Settings />
                      <span>Settings</span>
                      <ChevronRight
                        class="ml-auto size-4 transition-transform duration-200"
                        :class="{ 'rotate-90': settingsOpen }"
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem v-for="item in settingsItems" :key="item.to">
                        <SidebarMenuSubButton as-child>
                          <RouterLink :to="item.to">
                            <component :is="item.icon" />
                            <span>{{ item.label }}</span>
                          </RouterLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton size="lg">
                  <Avatar class="size-8 rounded-lg">
                    <AvatarFallback class="rounded-lg">
                      {{ auth.user?.email?.slice(0, 2).toUpperCase() }}
                    </AvatarFallback>
                  </Avatar>
                  <div class="flex flex-col gap-0.5 leading-none text-left">
                    <span class="font-medium text-sm truncate">{{
                      auth.profile?.full_name || auth.user?.email
                    }}</span>
                    <span class="text-xs text-muted-foreground truncate">{{
                      auth.user?.email
                    }}</span>
                  </div>
                  <ChevronRight class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" class="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="router.push({ name: 'profile' })">
                  <Settings class="mr-2 size-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem class="text-destructive" @click="handleLogout">
                  <LogOut class="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>

    <SidebarInset>
      <header class="flex h-14 items-center gap-2 border-b px-4 sticky top-0 z-10 bg-background">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="h-4" />
        <div class="flex-1">
          <slot name="title" />
        </div>
        <div class="flex items-center gap-2">
          <slot name="header-actions" />
        </div>
      </header>

      <div class="flex flex-1 flex-col gap-4 p-4">
        <slot>
          <RouterView />
        </slot>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
