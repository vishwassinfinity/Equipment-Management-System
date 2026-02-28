import { format } from "date-fns"
import { MoreHorizontal, Pencil, Trash2, History, Wrench } from "lucide-react"

import type { Equipment } from "@/types/equipment"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EquipmentTableProps {
  equipment: Equipment[]
  onEdit: (equipment: Equipment) => void
  onDelete: (equipment: Equipment) => void
  onViewHistory: (equipment: Equipment) => void
  onLogMaintenance: (equipment: Equipment) => void
}

function getStatusVariant(status: Equipment["status"]) {
  switch (status) {
    case "Active":
      return "default" as const
    case "Inactive":
      return "secondary" as const
    case "Under Maintenance":
      return "destructive" as const
  }
}

export function EquipmentTable({
  equipment,
  onEdit,
  onDelete,
  onViewHistory,
  onLogMaintenance,
}: EquipmentTableProps) {
  if (equipment.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No equipment found
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by adding your first piece of equipment.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Cleaned</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipment.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(item.lastCleanedDate), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewHistory(item)}>
                      <History className="mr-2 h-4 w-4" />
                      Maintenance History
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onLogMaintenance(item)}>
                      <Wrench className="mr-2 h-4 w-4" />
                      Log Maintenance
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
