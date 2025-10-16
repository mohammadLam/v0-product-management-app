import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./features/auth/authSlice"
import productsReducer from "./features/products/productsSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      products: productsReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
