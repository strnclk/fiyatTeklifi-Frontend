import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
    isAuthenticated: !!localStorage.getItem('auth_token')
  }),

  actions: {
    async register(credentials) {
      try {
        const response = await api.post('/api/auth/register', {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          password_confirmation: credentials.password
        })
        
        this.token = response.data.token
        this.user = response.data.user
        this.isAuthenticated = true
        
        // Save token to localStorage
        localStorage.setItem('auth_token', this.token)
        
        // Set auth header for subsequent requests
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        return { success: true, data: response.data }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Registration failed' 
        }
      }
    },
    
    async login(credentials) {
      try {
        const response = await api.post('/api/auth/login', credentials)
        this.token = response.data.token || response.data.access_token
        this.user = response.data.user
        this.isAuthenticated = true
        
        localStorage.setItem('auth_token', this.token)
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        return { success: true, data: response.data }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Login failed' 
        }
      }
    },
    
    logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('auth_token')
      delete api.defaults.headers.common['Authorization']
    },
    
    async fetchUser() {
      try {
        const response = await api.get('/api/auth/me')
        this.user = response.data
        return { success: true, user: response.data }
      } catch (error) {
        this.logout()
        return { success: false, error: 'Failed to fetch user' }
      }
    }
  }
})
