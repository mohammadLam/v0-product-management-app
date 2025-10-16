"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchProducts, setSearchQuery, setCategoryFilter } from "@/lib/features/products/productsSlice"
import { logout } from "@/lib/features/auth/authSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Plus, Search, LogOut, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Loader2 } from "lucide-react"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"

export default function ProductsPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { items, loading, error, pagination, searchQuery, categoryFilter } = useAppSelector((state) => state.products)
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProducts({ page: pagination.currentPage, search: searchQuery, category: categoryFilter }))
    }
  }, [dispatch, isAuthenticated, pagination.currentPage, searchQuery, categoryFilter])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localSearch))
    }, 500)

    return () => clearTimeout(timer)
  }, [localSearch, dispatch])

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  const handlePageChange = (newPage: number) => {
    dispatch(fetchProducts({ page: newPage, search: searchQuery, category: categoryFilter }))
  }

  const handleCategoryChange = (category: string) => {
    dispatch(setCategoryFilter(category))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
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
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Product Management</h1>
                <p className="text-sm text-muted-foreground">Manage your product inventory</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-border text-foreground hover:bg-accent bg-transparent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-4 flex-col sm:flex-row">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 bg-card border-input text-foreground"
              />
            </div>
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-[180px] bg-card border-input text-foreground">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => router.push("/products/create")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/10">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Products Grid */}
        {!loading && items.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((product) => (
                <Card key={product.id} className="border-border bg-card hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-foreground line-clamp-1">{product.name}</CardTitle>
                        <CardDescription className="mt-1 text-muted-foreground line-clamp-2">
                          {product.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-foreground">{formatPrice(product.price)}</span>
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Stock:</span>
                        <span className={`font-medium ${product.stock > 10 ? "text-green-500" : "text-destructive"}`}>
                          {product.stock} units
                        </span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/products/${product.id}`)}
                          className="flex-1 border-border text-foreground hover:bg-accent"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/products/${product.id}/edit`)}
                          className="flex-1 border-border text-foreground hover:bg-accent"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteProductId(product.id)}
                          className="border-destructive/50 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="border-border text-foreground hover:bg-accent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === pagination.currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={
                        page === pagination.currentPage
                          ? "bg-primary text-primary-foreground"
                          : "border-border text-foreground hover:bg-accent"
                      }
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="border-border text-foreground hover:bg-accent"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || categoryFilter
                  ? "Try adjusting your filters"
                  : "Get started by adding your first product"}
              </p>
              {!searchQuery && !categoryFilter && (
                <Button
                  onClick={() => router.push("/products/create")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <DeleteConfirmDialog
        open={!!deleteProductId}
        onClose={() => setDeleteProductId(null)}
        productId={deleteProductId}
      />
    </div>
  )
}
