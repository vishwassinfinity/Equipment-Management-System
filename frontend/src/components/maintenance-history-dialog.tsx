import { format } from "date-fns"
import { Plus } from "lucide-react"

import type { Equipment } from "@/types/equipment"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface MaintenanceHistoryDialogProps {
  equipment: Equipment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogMaintenance: (equipment: Equipment) => void
}

export function MaintenanceHistoryDialog({
  equipment,
  open,
  onOpenChange,
  onLogMaintenance,
}: MaintenanceHistoryDialogProps) {
  if (!equipment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between pr-8">
            <div>
              <DialogTitle>Maintenance History</DialogTitle>
              <DialogDescription>
                Showing maintenance records for{" "}
                <span className="font-semibold text-foreground">{equipment.name}</span>
              </DialogDescription>
            </div>
            <Button
              size="sm"
              onClick={() => onLogMaintenance(equipment)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Log Maintenance
            </Button>
          </div>
        </DialogHeader>

        {equipment.maintenanceHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No maintenance records found for this equipment.
            </p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Performed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipment.maintenanceHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {format(new Date(record.date), "MMM dd, yyyy")}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.notes}</TableCell>
                    <TableCell className="font-medium">
                      {record.performedBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
