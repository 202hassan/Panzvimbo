import api from './api'

export interface PaymentMethodData {
  type: 'card' | 'mobile_money' | 'cash'
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  phoneNumber?: string
}

export const paymentService = {
  addPaymentMethod: async (data: PaymentMethodData) => {
    try {
      const response = await api.post('/payments/methods', data)
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to add payment method'
    }
  },

  getPaymentMethods: async () => {
    try {
      const response = await api.get('/payments/methods')
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to fetch payment methods'
    }
  },

  processPayment: async (deliveryId: string, paymentMethodId: string) => {
    try {
      const response = await api.post('/payments/process', {
        deliveryId,
        paymentMethodId,
      })
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Payment failed'
    }
  },

  getTransactionHistory: async () => {
    try {
      const response = await api.get('/payments/history')
      return response.data
    } catch (error: any) {
      throw error.response?.data?.message || 'Failed to fetch transaction history'
    }
  },
}
