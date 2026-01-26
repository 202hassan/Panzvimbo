import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import deliveryReducer from './deliverySlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    delivery: deliveryReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
