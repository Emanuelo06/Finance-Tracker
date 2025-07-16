// /store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  isAddTransactionModalOpen: boolean
  isAddBudgetModalOpen: boolean
  theme: 'light' | 'dark'
}

const initialState: UIState = {
  isAddTransactionModalOpen: false,
  isAddBudgetModalOpen: false,
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTransactionModal: (state) => {
      state.isAddTransactionModalOpen = !state.isAddTransactionModalOpen
    },
    toggleBudgetModal: (state) => {
      state.isAddBudgetModalOpen = !state.isAddBudgetModalOpen
    },
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload
    },
  },
})

export const { toggleTransactionModal, toggleBudgetModal, setTheme } = uiSlice.actions
export default uiSlice.reducer
