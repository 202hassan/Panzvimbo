import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  userType: 'client' | 'courier'
  rating?: number
  vehicleInfo?: {
    model: string
    plateNumber: string
    color: string
  }
  location?: {
    latitude: number
    longitude: number
  }
}

interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  token: string | null
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  token: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      state.isAuthenticated = true
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    updateUserLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      if (state.currentUser) {
        state.currentUser.location = action.payload
      }
    },
    logout: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.token = null
    },
  },
})

export const { setUser, setToken, updateUserLocation, logout } = userSlice.actions
export default userSlice.reducer
