import type { Equipment } from "@/types/equipment"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteConfirmDialogProps {
  equipment: Equipment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteConfirmDialog({
  equipment,
  open,
  onOpenChange,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!equipment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Equipment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{equipment.name}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
