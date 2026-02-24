import api from './api'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  userType: 'client' | 'courier'
  vehicleInfo?: {
    model: string
    plateNumber: string
    color: string
  }
}

export interface LoginData {
  email: string
  password: string
}

export const authService = {
  register: async (data: RegisterData) => {
    try {
      const response = await api.post('/auth/register', data)
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token)
      }
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Registration failed'
    }
  },

  login: async (data: LoginData) => {
    try {
      const response = await api.post('/auth/login', data)
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token)
      }
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Login failed'
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userToken')
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to get user data'
    }
  },

  updateProfile: async (data: Partial<RegisterData>) => {
    try {
      const response = await api.put('/auth/profile', data)
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to update profile'
    }
  },

  guestLogin: async (userType: 'client' | 'courier' = 'client') => {
    try {
      // Generate a guest token without backend authentication
      const guestToken = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await AsyncStorage.setItem('userToken', guestToken)
      
      // Return guest user data
      return {
        token: guestToken,
        user: {
          id: `guest_${Date.now()}`,
          name: 'Guest User',
          email: `guest_${Date.now()}@panzvimbo.local`,
          phone: '',
          userType: userType,
          isGuest: true,
        },
      }
    } catch (error: any) {
      throw error.response?.data?.message || 'Guest login failed'
    }
  },
}
