import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/lib/store"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

interface ProductsState {
  items: Product[]
  currentProduct: Product | null
  loading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  searchQuery: string
  categoryFilter: string
}

const initialState: ProductsState = {
  items: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  searchQuery: "",
  categoryFilter: "",
}

const API_BASE = "https://interview-api.vercel.app/api"

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    { page = 1, search = "", category = "" }: { page?: number; search?: string; category?: string },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(category && { category }),
      })

      const response = await fetch(`${API_BASE}/products?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue("Failed to load products")
    }
  },
)

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const response = await fetch(`${API_BASE}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch product")
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue("Failed to load product details")
    }
  },
)

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product: Omit<Product, "id">, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const response = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        throw new Error("Failed to create product")
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue("Failed to create product")
    }
  },
)

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, product }: { id: string; product: Partial<Product> }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        throw new Error("Failed to update product")
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue("Failed to update product")
    }
  },
)

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      return id
    } catch (error) {
      return rejectWithValue("Failed to delete product")
    }
  },
)

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.products || action.payload
        state.pagination = {
          currentPage: action.payload.page || 1,
          totalPages: action.payload.totalPages || 1,
          totalItems: action.payload.total || action.payload.length,
          itemsPerPage: action.payload.limit || 10,
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.items.unshift(action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((p) => p.id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setSearchQuery, setCategoryFilter, clearCurrentProduct, clearError } = productsSlice.actions
export default productsSlice.reducer
