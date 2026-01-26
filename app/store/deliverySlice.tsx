import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Bid {
  id: string
  courierId: string
  courierName: string
  courierRating: number
  amount: number
  estimatedTime: number // in minutes
  message?: string
  createdAt: string
  vehicleInfo: {
    model: string
    plateNumber: string
  }
}

export interface Delivery {
  id: string
  clientId: string
  clientName: string
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
  status: 'pending' | 'bidding' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  bids: Bid[]
  acceptedBid?: Bid
  createdAt: string
  scheduledTime?: string
}

interface DeliveryState {
  deliveries: Delivery[]
  activeDelivery: Delivery | null
  currentDeliveryBids: Bid[]
  loading: boolean
}

const initialState: DeliveryState = {
  deliveries: [],
  activeDelivery: null,
  currentDeliveryBids: [],
  loading: false,
}

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    setDeliveries: (state, action: PayloadAction<Delivery[]>) => {
      state.deliveries = action.payload
    },
    addDelivery: (state, action: PayloadAction<Delivery>) => {
      state.deliveries.unshift(action.payload)
    },
    updateDelivery: (state, action: PayloadAction<Delivery>) => {
      const index = state.deliveries.findIndex(d => d.id === action.payload.id)
      if (index !== -1) {
        state.deliveries[index] = action.payload
      }
      if (state.activeDelivery?.id === action.payload.id) {
        state.activeDelivery = action.payload
      }
    },
    setActiveDelivery: (state, action: PayloadAction<Delivery | null>) => {
      state.activeDelivery = action.payload
    },
    addBidToDelivery: (state, action: PayloadAction<{ deliveryId: string; bid: Bid }>) => {
      const delivery = state.deliveries.find(d => d.id === action.payload.deliveryId)
      if (delivery) {
        delivery.bids.push(action.payload.bid)
      }
    },
    setCurrentDeliveryBids: (state, action: PayloadAction<Bid[]>) => {
      state.currentDeliveryBids = action.payload
    },
    acceptBid: (state, action: PayloadAction<{ deliveryId: string; bid: Bid }>) => {
      const delivery = state.deliveries.find(d => d.id === action.payload.deliveryId)
      if (delivery) {
        delivery.acceptedBid = action.payload.bid
        delivery.status = 'accepted'
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const {
  setDeliveries,
  addDelivery,
  updateDelivery,
  setActiveDelivery,
  addBidToDelivery,
  setCurrentDeliveryBids,
  acceptBid,
  setLoading,
} = deliverySlice.actions

export default deliverySlice.reducer
