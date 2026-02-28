import type { Equipment, MaintenanceLogFormData } from "@/types/equipment"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MaintenanceLogForm } from "@/components/maintenance-log-form"

interface MaintenanceLogDialogProps {
  equipment: Equipment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (equipmentId: number, data: MaintenanceLogFormData) => void
}

export function MaintenanceLogDialog({
  equipment,
  open,
  onOpenChange,
  onSubmit,
}: MaintenanceLogDialogProps) {
  if (!equipment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Maintenance</DialogTitle>
          <DialogDescription>
            Record a maintenance event for{" "}
            <span className="font-semibold text-foreground">{equipment.name}</span>.
            This will set the equipment status to Active and update the last cleaned date.
          </DialogDescription>
        </DialogHeader>
        <MaintenanceLogForm
          onSubmit={(data) => onSubmit(equipment.id, data)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
