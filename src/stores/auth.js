import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
    returnUrl: null,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/api/auth/login', credentials)
        const { access_token, user } = response.data
        
        // Save token to localStorage
        localStorage.setItem('auth_token', access_token)
        
        // Update state
        this.token = access_token
        this.user = user
        
        // Set default auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        
        return user
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    
    async register(userData) {
      try {
        const response = await api.post('/api/auth/register', userData)
        const { access_token, user } = response.data
        
        // Save token to localStorage
        localStorage.setItem('auth_token', access_token)
        
        // Update state
        this.token = access_token
        this.user = user
        
        // Set default auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        
        return user
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      }
    },
    
    async logout() {
      try {
        // Call logout API
        await api.post('/api/auth/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Clear state
        this.user = null
        this.token = null
        
        // Remove token from localStorage
        localStorage.removeItem('auth_token')
        
        // Remove auth header
        delete api.defaults.headers.common['Authorization']
      }
    },
    
    async fetchUser() {
      try {
        const response = await api.get('/api/auth/me')
        this.user = response.data
        return this.user
      } catch (error) {
        console.error('Failed to fetch user:', error)
        // If token is invalid, clear it
        if (error.response?.status === 401) {
          this.logout()
        }
        throw error
      }
    },
    
    async initialize() {
      try {
        // Set auth header if token exists
        if (this.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
          // Fetch user data
          await this.fetchUser()
        }
      } catch (error) {
        console.error('Failed to initialize user:', error)
      } finally {
        this.initialized = true
      }
    }
  }
})
