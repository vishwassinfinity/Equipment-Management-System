import type { EquipmentFormData } from "@/types/equipment"
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
  equipmentTypes: string[]
  onSubmit: (data: EquipmentFormData) => void
}

export function EquipmentFormDialog({
  open,
  onOpenChange,
  initialData,
  equipmentTypes,
  onSubmit,
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
