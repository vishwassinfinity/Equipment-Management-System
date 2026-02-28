import { useState, useEffect, useCallback } from "react"
import { Plus } from "lucide-react"

import type {
  Equipment,
  EquipmentFormData,
  EquipmentQuery,
  EquipmentType,
  MaintenanceLogFormData,
  PageResponse,
} from "@/types/equipment"
import * as api from "@/services/api"
import { Button } from "@/components/ui/button"
import { EquipmentTable } from "@/components/equipment-table"
import { EquipmentFormDialog } from "@/components/equipment-form-dialog"
import { MaintenanceHistoryDialog } from "@/components/maintenance-history-dialog"
import { MaintenanceLogDialog } from "@/components/maintenance-log-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"

const DEFAULT_QUERY: EquipmentQuery = {
  page: 0,
  size: 10,
  sortBy: "name",
  sortDir: "asc",
}

function App() {
  const [pageData, setPageData] = useState<PageResponse<Equipment>>({
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  })
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([])
  const [loading, setLoading] = useState(true)

  // Query state (drives server-side filtering, search, sort, pagination)
  const [query, setQuery] = useState<EquipmentQuery>(DEFAULT_QUERY)

  // Form dialog state
  const [formOpen, setFormOpen] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)

  // Maintenance history dialog state
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyEquipment, setHistoryEquipment] = useState<Equipment | null>(null)

  // Maintenance log dialog state
  const [logOpen, setLogOpen] = useState(false)
  const [loggingEquipment, setLoggingEquipment] = useState<Equipment | null>(null)

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingEquipment, setDeletingEquipment] = useState<Equipment | null>(null)

  // Error message state (shown in dialogs)
  const [formError, setFormError] = useState<string | null>(null)
  const [logError, setLogError] = useState<string | null>(null)

  // --- Data Fetching ---

  const loadEquipment = useCallback(async (q: EquipmentQuery) => {
    try {
      const data = await api.fetchEquipment(q)
      setPageData(data)
    } catch (err) {
      console.error("Failed to load equipment:", err)
    }
  }, [])

  const loadEquipmentTypes = useCallback(async () => {
    try {
      const types = await api.fetchEquipmentTypes()
      setEquipmentTypes(types)
    } catch (err) {
      console.error("Failed to load equipment types:", err)
    }
  }, [])

  useEffect(() => {
    async function init() {
      setLoading(true)
      await Promise.all([loadEquipment(query), loadEquipmentTypes()])
      setLoading(false)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-fetch whenever query changes (after initial load)
  useEffect(() => {
    if (!loading) {
      loadEquipment(query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, loadEquipment])

  // Helpers to update query
  function updateQuery(partial: Partial<EquipmentQuery>) {
    setQuery((prev) => ({
      ...prev,
      ...partial,
      // Reset to first page when filter/search/sort changes
      page: "page" in partial ? (partial.page ?? 0) : 0,
    }))
  }

  function handleSort(field: string) {
    setQuery((prev) => ({
      ...prev,
      sortBy: field,
      sortDir: prev.sortBy === field && prev.sortDir === "asc" ? "desc" : "asc",
      page: 0,
    }))
  }

  function handlePageChange(newPage: number) {
    setQuery((prev) => ({ ...prev, page: newPage }))
  }

  // --- Handlers ---

  function handleAdd() {
    setEditingEquipment(null)
    setFormOpen(true)
  }

  function handleEdit(item: Equipment) {
    setEditingEquipment(item)
    setFormOpen(true)
  }

  async function handleFormSubmit(data: EquipmentFormData) {
    try {
      setFormError(null)
      if (editingEquipment) {
        await api.updateEquipment(editingEquipment.id, data)
      } else {
        await api.createEquipment(data)
      }
      await loadEquipment(query)
      setFormOpen(false)
      setEditingEquipment(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save equipment"
      setFormError(message)
    }
  }

  function handleDelete(item: Equipment) {
    setDeletingEquipment(item)
    setDeleteOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deletingEquipment) return
    try {
      await api.deleteEquipment(deletingEquipment.id)
      await loadEquipment(query)
      setDeleteOpen(false)
      setDeletingEquipment(null)
    } catch (err) {
      console.error("Failed to delete equipment:", err)
    }
  }

  async function handleViewHistory(item: Equipment) {
    try {
      const fresh = await api.fetchEquipmentById(item.id)
      setHistoryEquipment(fresh)
      setHistoryOpen(true)
    } catch (err) {
      console.error("Failed to load equipment details:", err)
    }
  }

  function handleOpenLogMaintenance(item: Equipment) {
    setLoggingEquipment(item)
    setLogOpen(true)
  }

  async function handleLogMaintenanceSubmit(equipmentId: number, data: MaintenanceLogFormData) {
    try {
      setLogError(null)
      await api.logMaintenance(equipmentId, data)
      await loadEquipment(query)

      if (historyEquipment?.id === equipmentId) {
        const fresh = await api.fetchEquipmentById(equipmentId)
        setHistoryEquipment(fresh)
      }

      setLogOpen(false)
      setLoggingEquipment(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to log maintenance"
      setLogError(message)
    }
  }

  // Derive form initial data from editing equipment
  const formInitialData: EquipmentFormData | null = editingEquipment
    ? {
        name: editingEquipment.name,
        typeId: editingEquipment.typeId,
        status: editingEquipment.status,
        lastCleanedDate: editingEquipment.lastCleanedDate,
      }
    : null

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading equipment...</p>
      </div>
    )
  }

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

        {/* Equipment Table with server-side controls */}
        <EquipmentTable
          equipment={pageData.content}
          query={query}
          totalElements={pageData.totalElements}
          totalPages={pageData.totalPages}
          onQueryChange={updateQuery}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewHistory={handleViewHistory}
          onLogMaintenance={handleOpenLogMaintenance}
        />

        {/* Add/Edit Dialog */}
        <EquipmentFormDialog
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open)
            if (!open) {
              setEditingEquipment(null)
              setFormError(null)
            }
          }}
          initialData={formInitialData}
          equipmentTypes={equipmentTypes}
          onSubmit={handleFormSubmit}
          errorMessage={formError}
        />

        {/* Maintenance History Dialog */}
        <MaintenanceHistoryDialog
          equipment={historyEquipment}
          open={historyOpen}
          onOpenChange={(open) => {
            setHistoryOpen(open)
            if (!open) setHistoryEquipment(null)
          }}
          onLogMaintenance={handleOpenLogMaintenance}
        />

        {/* Maintenance Log Dialog */}
        <MaintenanceLogDialog
          equipment={loggingEquipment}
          open={logOpen}
          onOpenChange={(open) => {
            setLogOpen(open)
            if (!open) {
              setLoggingEquipment(null)
              setLogError(null)
            }
          }}
          onSubmit={handleLogMaintenanceSubmit}
          errorMessage={logError}
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
