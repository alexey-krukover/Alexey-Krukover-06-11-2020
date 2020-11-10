import { configureStore } from '@reduxjs/toolkit'
import messagesReducer from './slices/messagesSlice'
import authReducer from './slices/authSlice'

// Set the redux store
const store = configureStore({
  reducer: {
    messages: messagesReducer,
    auth: authReducer
  },
})

// Type for the state
export type RootState = ReturnType<typeof store.getState>

export default store
