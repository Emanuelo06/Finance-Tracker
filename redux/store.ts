import authReducer from '@/redux/slices/authSlice'
import { configureStore } from '@reduxjs/toolkit'
import transactionsReducer from '@/redux/slices/transactionsSlice'
import budgetsReducer from '@/redux/slices/budgetsSlice'
import uiReducer from '@/redux/slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    budgets: budgetsReducer,
    ui: uiReducer,
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch