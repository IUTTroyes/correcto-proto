import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { guest: true }
    },
    {
        path: '/auth/logout',
        name: 'logout',
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore()
          userStore.logout() // Assurez-vous que cette méthode existe dans votre store
          next({ name: 'login' })
        }
      }
  ],
})

// Navigation guard to check authentication for protected routes
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = userStore.checkAuth()

  // If route requires authentication and user is not authenticated
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Redirect to login page
    next({ name: 'login' })
  }
  // If route is for guests only and user is authenticated
  else if (to.matched.some(record => record.meta.guest) && isAuthenticated) {
    // Redirect to home page
    next({ name: 'home' })
  }
  // Otherwise proceed normally
  else {
    next()
  }
})

export default router
