"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchProductById, clearCurrentProduct } from "@/lib/features/products/productsSlice"
import { ProductForm } from "@/components/product-form"
import { ArrowLeft, Package, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { currentProduct, loading, error } = useAppSelector((state) => state.products)

  const productId = params.id as string

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && productId) {
      dispatch(fetchProductById(productId))
    }

    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [dispatch, isAuthenticated, productId])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/products")}
              className="text-foreground hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Package className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Edit Product</h1>
              <p className="text-sm text-muted-foreground">Update product information</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
              <Button
                onClick={() => router.push("/products")}
                className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Back to Products
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && currentProduct && <ProductForm mode="edit" product={currentProduct} />}
      </main>
    </div>
  )
}
