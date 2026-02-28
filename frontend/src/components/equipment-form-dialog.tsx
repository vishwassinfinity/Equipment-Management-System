import type { EquipmentFormData, EquipmentType } from "@/types/equipment"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EquipmentForm } from "@/components/equipment-form"

interface EquipmentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** null = add mode, object = edit mode */
  initialData: EquipmentFormData | null
  equipmentTypes: EquipmentType[]
  onSubmit: (data: EquipmentFormData) => void
  /** Error message from API to display */
  errorMessage?: string | null
}

export function EquipmentFormDialog({
  open,
  onOpenChange,
  initialData,
  equipmentTypes,
  onSubmit,
  errorMessage,
}: EquipmentFormDialogProps) {
  const isEditing = !!initialData

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Equipment" : "Add New Equipment"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the equipment details below."
              : "Fill in the details to add new equipment."}
          </DialogDescription>
        </DialogHeader>
        {errorMessage && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}
        <EquipmentForm
          initialData={initialData}
          equipmentTypes={equipmentTypes}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
