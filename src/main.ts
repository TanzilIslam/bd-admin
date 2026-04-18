import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/authStore'
import 'vue-sonner/style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Restore session before mounting so the router guard has correct auth state
// on the very first navigation (avoids redirect flash for authenticated users).
const authStore = useAuthStore()
await authStore.restoreSession()

app.use(router)
app.mount('#app')
