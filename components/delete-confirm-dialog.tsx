"use client"

import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { deleteProduct, fetchProducts } from "@/lib/features/products/productsSlice"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"

interface DeleteConfirmDialogProps {
  open: boolean
  onClose: () => void
  productId: string | null
  onDeleteSuccess?: () => void
}

export function DeleteConfirmDialog({ open, onClose, productId, onDeleteSuccess }: DeleteConfirmDialogProps) {
  const dispatch = useAppDispatch()
  const { loading, pagination, searchQuery, categoryFilter } = useAppSelector((state) => state.products)

  const handleDelete = async () => {
    if (!productId) return

    try {
      await dispatch(deleteProduct(productId)).unwrap()
      // Refresh the products list after deletion
      dispatch(fetchProducts({ page: pagination.currentPage, search: searchQuery, category: categoryFilter }))
      onClose()
      // Call success callback if provided (for navigation from details page)
      if (onDeleteSuccess) {
        onDeleteSuccess()
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            This action cannot be undone. This will permanently delete the product from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border text-foreground hover:bg-accent" disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
