import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, instance } from '@/lib/supabase'
import type { User } from '@/types'
import { UserRole } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoredAuth {
  id: string
  email: string
  accessToken: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'bd_auth'

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = defineStore('auth', () => {
  const user = ref<SupabaseUser | null>(null)
  const accessToken = ref<string | null>(null)
  const loading = ref(false)
  const profile = ref<User | null>(null)

  // ── Getters ────────────────────────────────────────────────────────────────

  function isAuthenticated(): boolean {
    return !!user.value
  }

  function isAdmin(): boolean {
    return profile.value?.role === UserRole.ADMIN
  }

  // ── Internal helpers ───────────────────────────────────────────────────────

  async function fetchProfile(): Promise<void> {
    if (!user.value) return
    const { data } = await supabase
      .from(instance.users.tableName)
      .select('*')
      .eq('id', user.value.id)
      .single()
    if (data) profile.value = data as User
  }

  async function setSession(supabaseUser: SupabaseUser, token: string) {
    user.value = supabaseUser
    accessToken.value = token

    const stored: StoredAuth = {
      id: supabaseUser.id,
      email: supabaseUser.email ?? '',
      accessToken: token,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

    await fetchProfile()
  }

  function clearSession() {
    user.value = null
    accessToken.value = null
    profile.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  // ── Public actions ─────────────────────────────────────────────────────────

  async function login(email: string, password: string): Promise<void> {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      if (data.user && data.session) {
        await setSession(data.user, data.session.access_token)
      }
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    await supabase.auth.signOut()
    clearSession()
  }

  // Called once on app start — Supabase reads its own persisted session from
  // localStorage (persistSession: true) and we sync it into Pinia state.
  async function restoreSession(): Promise<void> {
    const { data } = await supabase.auth.getSession()
    if (data.session?.user && data.session.access_token) {
      await setSession(data.session.user, data.session.access_token)
    }
  }

  return {
    user,
    accessToken,
    loading,
    profile,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    restoreSession,
  }
})
