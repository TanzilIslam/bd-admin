import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/authStore'

// ─── Route meta types ─────────────────────────────────────────────────────────

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    adminOnly?: boolean
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard/overview',
    },
    {
      path: '/auth',
      component: DefaultLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
          meta: { guestOnly: true },
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/views/auth/SignupView.vue'),
          meta: { guestOnly: true },
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('@/views/auth/ForgotPasswordView.vue'),
          meta: { guestOnly: true },
        },
        {
          path: 'email-confirmation',
          name: 'email-confirmation',
          component: () => import('@/views/auth/EmailConfirmationView.vue'),
        },
        {
          path: 'password-reset',
          name: 'password-reset',
          component: () => import('@/views/auth/PasswordResetView.vue'),
        },
      ],
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      redirect: '/dashboard/overview',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'overview',
          name: 'overview',
          component: () => import('@/views/dashboard/OverviewView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/dashboard/ProfileView.vue'),
        },
        {
          path: 'businesses',
          children: [
            {
              path: '',
              name: 'businesses',
              component: () => import('@/views/dashboard/BusinessesView.vue'),
            },
            {
              path: 'new',
              name: 'business-create',
              component: () => import('@/views/dashboard/BusinessDetailView.vue'),
            },
            {
              path: ':id',
              name: 'business-edit',
              component: () => import('@/views/dashboard/BusinessDetailView.vue'),
            },
          ],
        },
        {
          path: 'settings',
          component: () => import('@/views/dashboard/SettingsView.vue'),
          redirect: '/dashboard/settings/business-categories',
          meta: { adminOnly: true },
          children: [
            {
              path: 'users',
              name: 'settings-users',
              component: () => import('@/views/dashboard/UsersView.vue'),
            },
            {
              path: 'business-categories',
              name: 'settings-business-categories',
              component: () => import('@/views/dashboard/settings/BusinessCategoriesView.vue'),
            },
            {
              path: 'business-sub-categories',
              name: 'settings-business-sub-categories',
              component: () => import('@/views/dashboard/settings/BusinessSubCategoriesView.vue'),
            },
            {
              path: 'services',
              name: 'settings-services',
              component: () => import('@/views/dashboard/settings/ServicesView.vue'),
            },
            {
              path: 'facilities',
              name: 'settings-facilities',
              component: () => import('@/views/dashboard/settings/FacilitiesView.vue'),
            },
            {
              path: 'payment-methods',
              name: 'settings-payment-methods',
              component: () => import('@/views/dashboard/settings/PaymentMethodsView.vue'),
            },
            {
              path: 'features',
              name: 'settings-features',
              component: () => import('@/views/dashboard/settings/FeaturesView.vue'),
            },
            {
              path: 'tags',
              name: 'settings-tags',
              component: () => import('@/views/dashboard/settings/TagsView.vue'),
            },
            {
              path: 'locations',
              name: 'settings-locations',
              component: () => import('@/views/dashboard/settings/LocationsView.vue'),
            },
            {
              path: 'price-ranges',
              name: 'settings-price-ranges',
              component: () => import('@/views/dashboard/settings/PriceRangesView.vue'),
            },
          ],
        },
      ],
    },
  ],
})

// ─── Navigation guard ─────────────────────────────────────────────────────────

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && auth.isAuthenticated()) {
    return { name: 'overview' }
  }

  if (to.meta.adminOnly && !auth.isAdmin()) {
    return { name: 'overview' }
  }
})

export default router
