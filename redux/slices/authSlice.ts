import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserData {
  uid: string
  email: string
  name?: string
  photoURL?: string
}

interface AuthState {
  user: UserData | null
  loading: boolean
  emailError: string | null
  passwordError: string | null
  error: string | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  emailError: null,
  passwordError: null,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.user = action.payload
      state.loading = false
    },
    clearUser: (state) => {
      state.user = null
      state.loading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
    state.error = action.payload;
  },
  setFieldErrors: (
    state,
    action: PayloadAction<{
      emailError?: string | null
      passwordError?: string | null
    }>
  )=> {
    state.emailError = action.payload.emailError || null
    state.passwordError = action.payload.passwordError || null
  },
  clearAuthErrors: (state) => {
    state.error = null
    state.emailError = null
    state.passwordError = null
  }
  }
})

export const { setUser, clearUser, setLoading, setAuthError, setFieldErrors, clearAuthErrors } = authSlice.actions
export default authSlice.reducer