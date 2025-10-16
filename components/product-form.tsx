"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { createProduct, updateProduct, fetchProducts } from "@/lib/features/products/productsSlice"
import type { Product } from "@/lib/features/products/productsSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface ProductFormProps {
  mode: "create" | "edit"
  product?: Product
}

interface FormData {
  name: string
  description: string
  price: string
  category: string
  stock: string
  imageUrl: string
}

interface FormErrors {
  name?: string
  description?: string
  price?: string
  category?: string
  stock?: string
}

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading, error, pagination, searchQuery, categoryFilter } = useAppSelector((state) => state.products)

  const [formData, setFormData] = useState<FormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    category: product?.category || "",
    stock: product?.stock?.toString() || "",
    imageUrl: product?.imageUrl || "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        category: product.category || "",
        stock: product.stock?.toString() || "",
        imageUrl: product.imageUrl || "",
      })
    }
  }, [product])

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Product name is required"
        if (value.trim().length < 3) return "Product name must be at least 3 characters"
        return ""
      case "description":
        if (!value.trim()) return "Description is required"
        if (value.trim().length < 10) return "Description must be at least 10 characters"
        return ""
      case "price":
        if (!value) return "Price is required"
        const price = Number.parseFloat(value)
        if (isNaN(price)) return "Price must be a valid number"
        if (price <= 0) return "Price must be greater than 0"
        if (price > 1000000) return "Price must be less than 1,000,000"
        return ""
      case "category":
        if (!value) return "Category is required"
        return ""
      case "stock":
        if (!value) return "Stock is required"
        const stock = Number.parseInt(value)
        if (isNaN(stock)) return "Stock must be a valid number"
        if (stock < 0) return "Stock cannot be negative"
        if (!Number.isInteger(stock)) return "Stock must be a whole number"
        return ""
      default:
        return ""
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      if (key !== "imageUrl") {
        const error = validateField(key, formData[key as keyof FormData])
        if (error) {
          newErrors[key as keyof FormErrors] = error
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
    if (touched.category) {
      const error = validateField("category", value)
      setErrors((prev) => ({ ...prev, category: error }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    setTouched(allTouched)

    if (!validateForm()) {
      return
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number.parseFloat(formData.price),
      category: formData.category,
      stock: Number.parseInt(formData.stock),
      ...(formData.imageUrl && { imageUrl: formData.imageUrl.trim() }),
    }

    try {
      if (mode === "create") {
        await dispatch(createProduct(productData)).unwrap()
      } else if (product) {
        await dispatch(updateProduct({ id: product.id, product: productData })).unwrap()
      }

      // Refresh products list
      dispatch(fetchProducts({ page: pagination.currentPage, search: searchQuery, category: categoryFilter }))

      // Navigate back to products list
      router.push("/products")
    } catch (err) {
      console.error("Failed to save product:", err)
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">{mode === "create" ? "New Product" : "Edit Product"}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {mode === "create"
            ? "Fill in the details below to create a new product"
            : "Update the product information below"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter product name"
              className={`bg-card border-input text-foreground ${errors.name && touched.name ? "border-destructive" : ""}`}
              disabled={loading}
            />
            {errors.name && touched.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter product description"
              rows={4}
              className={`bg-card border-input text-foreground resize-none ${errors.description && touched.description ? "border-destructive" : ""}`}
              disabled={loading}
            />
            {errors.description && touched.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Price and Stock */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground">
                Price (USD) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.00"
                className={`bg-card border-input text-foreground ${errors.price && touched.price ? "border-destructive" : ""}`}
                disabled={loading}
              />
              {errors.price && touched.price && <p className="text-sm text-destructive">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="text-foreground">
                Stock Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0"
                className={`bg-card border-input text-foreground ${errors.stock && touched.stock ? "border-destructive" : ""}`}
                disabled={loading}
              />
              {errors.stock && touched.stock && <p className="text-sm text-destructive">{errors.stock}</p>}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.category} onValueChange={handleCategoryChange} disabled={loading}>
              <SelectTrigger
                className={`bg-card border-input text-foreground ${errors.category && touched.category ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && touched.category && <p className="text-sm text-destructive">{errors.category}</p>}
          </div>

          {/* Image URL (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-foreground">
              Image URL <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="bg-card border-input text-foreground"
              disabled={loading}
            />
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/products")}
              disabled={loading}
              className="flex-1 border-border text-foreground hover:bg-accent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : mode === "create" ? (
                "Create Product"
              ) : (
                "Update Product"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
