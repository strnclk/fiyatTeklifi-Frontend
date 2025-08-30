import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/', '/quote-request', '/contact']

  // Navigation guard
  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    const isPublicPath = publicPaths.includes(to.path)
    const isAuthenticated = authStore.isAuthenticated

    // Initialize auth state
    if (!authStore.initialized) {
      await authStore.initialize()
    }

    // Redirect to login if not authenticated and trying to access protected route
    if (!isPublicPath && !isAuthenticated) {
      // Save the original URL to redirect after login
      authStore.returnUrl = to.fullPath
      return next('/login')
    }

    // Redirect to dashboard if authenticated and trying to access login/register
    if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
      return next(authStore.returnUrl || '/profile')
    }

    next()
  })

  return Router
})
