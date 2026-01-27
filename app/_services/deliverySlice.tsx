import api from './api'
import { Delivery, Bid } from '../_store/deliverySlice'

export interface CreateDeliveryData {
  pickupLocation: {
    latitude: number
    longitude: number
    address: string
  }
  dropoffLocation: {
    latitude: number
    longitude: number
    address: string
  }
  packageDetails: {
    description: string
    weight?: number
    size?: 'small' | 'medium' | 'large'
  }
  suggestedPrice?: number
  scheduledTime?: string
}

export interface CreateBidData {
  deliveryId: string
  amount: number
  estimatedTime: number
  message?: string
}

export const deliveryService = {
  // Client endpoints
  createDelivery: async (data: CreateDeliveryData) => {
    try {
      const response = await api.post('/deliveries', data)
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to create delivery'
    }
  },

  getMyDeliveries: async () => {
    try {
      const response = await api.get('/deliveries/my-deliveries')
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to fetch deliveries'
    }
  },

  getDeliveryBids: async (deliveryId: string) => {
    try {
      const response = await api.get(`/deliveries/${deliveryId}/bids`)
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to fetch bids'
    }
  },

  acceptBid: async (deliveryId: string, bidId: string) => {
    try {
      const response = await api.post(`/deliveries/${deliveryId}/accept-bid`, { bidId })
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to accept bid'
    }
  },

  // Courier endpoints
  getAvailableJobs: async (location: { latitude: number; longitude: number }) => {
    try {
      const response = await api.get('/deliveries/available', {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      })
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to fetch jobs'
    }
  },

  placeBid: async (data: CreateBidData) => {
    try {
      const response = await api.post('/deliveries/bids', data)
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to place bid'
    }
  },

  getMyBids: async () => {
    try {
      const response = await api.get('/deliveries/my-bids')
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to fetch bids'
    }
  },

  getActiveDelivery: async () => {
    try {
      const response = await api.get('/deliveries/active')
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to fetch active delivery'
    }
  },

  updateDeliveryStatus: async (deliveryId: string, status: string) => {
    try {
      const response = await api.patch(`/deliveries/${deliveryId}/status`, { status })
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to update delivery status'
    }
  },

  updateCourierLocation: async (deliveryId: string, location: { latitude: number; longitude: number }) => {
    try {
      const response = await api.patch(`/deliveries/${deliveryId}/location`, location)
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to update location'
    }
  },
}
