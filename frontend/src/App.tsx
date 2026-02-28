import { useState } from "react"
import { Plus } from "lucide-react"

import type { Equipment, EquipmentFormData } from "@/types/equipment"
import { EQUIPMENT_TYPES, SEED_EQUIPMENT } from "@/data/equipment-data"
import { Button } from "@/components/ui/button"
import { EquipmentTable } from "@/components/equipment-table"
import { EquipmentFormDialog } from "@/components/equipment-form-dialog"
import { MaintenanceHistoryDialog } from "@/components/maintenance-history-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"

function generateId(): string {
  return `eq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function App() {
  const [equipment, setEquipment] = useState<Equipment[]>(SEED_EQUIPMENT)

  // Form dialog state
  const [formOpen, setFormOpen] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)

  // Maintenance history dialog state
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyEquipment, setHistoryEquipment] = useState<Equipment | null>(null)

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingEquipment, setDeletingEquipment] = useState<Equipment | null>(null)

  // --- Handlers ---

  function handleAdd() {
    setEditingEquipment(null)
    setFormOpen(true)
  }

  function handleEdit(item: Equipment) {
    setEditingEquipment(item)
    setFormOpen(true)
  }

  function handleFormSubmit(data: EquipmentFormData) {
    if (editingEquipment) {
      // Update existing
      setEquipment((prev) =>
        prev.map((item) =>
          item.id === editingEquipment.id
            ? { ...item, ...data }
            : item
        )
      )
    } else {
      // Add new
      const newEquipment: Equipment = {
        id: generateId(),
        ...data,
        maintenanceHistory: [],
      }
      setEquipment((prev) => [...prev, newEquipment])
    }
    setFormOpen(false)
    setEditingEquipment(null)
  }

  function handleDelete(item: Equipment) {
    setDeletingEquipment(item)
    setDeleteOpen(true)
  }

  function handleConfirmDelete() {
    if (!deletingEquipment) return
    setEquipment((prev) => prev.filter((item) => item.id !== deletingEquipment.id))
    setDeleteOpen(false)
    setDeletingEquipment(null)
  }

  function handleViewHistory(item: Equipment) {
    setHistoryEquipment(item)
    setHistoryOpen(true)
  }

  // Derive form initial data from editing equipment
  const formInitialData: EquipmentFormData | null = editingEquipment
    ? {
        name: editingEquipment.name,
        type: editingEquipment.type,
        status: editingEquipment.status,
        lastCleanedDate: editingEquipment.lastCleanedDate,
      }
    : null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Equipment Management
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage and track all laboratory equipment in one place.
            </p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Equipment
          </Button>
        </div>

        {/* Equipment Table */}
        <EquipmentTable
          equipment={equipment}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewHistory={handleViewHistory}
        />

        {/* Add/Edit Dialog (reuses the same form component) */}
        <EquipmentFormDialog
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open)
            if (!open) setEditingEquipment(null)
          }}
          initialData={formInitialData}
          equipmentTypes={EQUIPMENT_TYPES}
          onSubmit={handleFormSubmit}
        />

        {/* Maintenance History Dialog */}
        <MaintenanceHistoryDialog
          equipment={historyEquipment}
          open={historyOpen}
          onOpenChange={(open) => {
            setHistoryOpen(open)
            if (!open) setHistoryEquipment(null)
          }}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          equipment={deletingEquipment}
          open={deleteOpen}
          onOpenChange={(open) => {
            setDeleteOpen(open)
            if (!open) setDeletingEquipment(null)
          }}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  )
}

export default App
