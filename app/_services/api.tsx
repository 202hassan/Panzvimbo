import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Update this with your backend API URL
const API_URL = __DEV__ ? 'http://localhost:5000/api' : 'https://your-production-api.com/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('userToken')
      // Navigate to login screen
    }
    return Promise.reject(error)
  }
)

export default api
