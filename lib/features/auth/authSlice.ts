import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  token: string | null
  email: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: null,
  email: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const login = createAsyncThunk("auth/login", async (email: string, { rejectWithValue }) => {
  try {
    const response = await fetch("https://interview-api.vercel.app/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.message || "Authentication failed")
    }

    const data = await response.json()
    return { token: data.token, email }
  } catch (error) {
    return rejectWithValue("Network error. Please try again.")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.email = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; email: string }>) => {
        state.loading = false
        state.token = action.payload.token
        state.email = action.payload.email
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
