"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchProductById, clearCurrentProduct } from "@/lib/features/products/productsSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash2, Package, Loader2, DollarSign, Box, Tag, Calendar } from "lucide-react"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"

export default function ProductDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { currentProduct, loading, error } = useAppSelector((state) => state.products)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                <h1 className="text-xl font-bold text-foreground">Product Details</h1>
                <p className="text-sm text-muted-foreground">View complete product information</p>
              </div>
            </div>
            {currentProduct && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/products/${productId}/edit`)}
                  className="border-border text-foreground hover:bg-accent"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-destructive mb-4">{error}</p>
              <Button
                onClick={() => router.push("/products")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Back to Products
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Product Details */}
        {!loading && !error && currentProduct && (
          <div className="space-y-6">
            {/* Main Info Card */}
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-foreground mb-2">{currentProduct.name}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                      {currentProduct.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-sm">
                    {currentProduct.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Price */}
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-2xl font-bold text-foreground">{formatPrice(currentProduct.price)}</p>
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Box className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stock Quantity</p>
                      <p
                        className={`text-2xl font-bold ${currentProduct.stock > 10 ? "text-green-500" : "text-destructive"}`}
                      >
                        {currentProduct.stock} units
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Details Card */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product ID */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground font-medium">Product ID</span>
                  </div>
                  <span className="text-muted-foreground font-mono text-sm">{currentProduct.id}</span>
                </div>

                <Separator className="bg-border" />

                {/* Category */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground font-medium">Category</span>
                  </div>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    {currentProduct.category}
                  </Badge>
                </div>

                <Separator className="bg-border" />

                {/* Created Date */}
                {currentProduct.createdAt && (
                  <>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="text-foreground font-medium">Created</span>
                      </div>
                      <span className="text-muted-foreground">{formatDate(currentProduct.createdAt)}</span>
                    </div>
                    <Separator className="bg-border" />
                  </>
                )}

                {/* Updated Date */}
                {currentProduct.updatedAt && (
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground font-medium">Last Updated</span>
                    </div>
                    <span className="text-muted-foreground">{formatDate(currentProduct.updatedAt)}</span>
                  </div>
                )}

                {/* Image URL */}
                {currentProduct.imageUrl && (
                  <>
                    <Separator className="bg-border" />
                    <div className="py-3">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <span className="text-foreground font-medium">Image URL</span>
                      </div>
                      <a
                        href={currentProduct.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm break-all"
                      >
                        {currentProduct.imageUrl}
                      </a>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Button
                    onClick={() => router.push(`/products/${productId}/edit`)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Product
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        productId={productId}
        onDeleteSuccess={() => router.push("/products")}
      />
    </div>
  )
}
