"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"
import { ProductForm } from "@/components/product-form"
import { ArrowLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CreateProductPage() {
  const router = useRouter()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

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
              <h1 className="text-xl font-bold text-foreground">Create Product</h1>
              <p className="text-sm text-muted-foreground">Add a new product to your inventory</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <ProductForm mode="create" />
      </main>
    </div>
  )
}
