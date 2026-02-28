export type EquipmentStatus = "Active" | "Inactive" | "Under Maintenance"

export interface MaintenanceRecord {
  id: number
  date: string
  notes: string
  performedBy: string
}

export interface EquipmentType {
  id: number
  name: string
}

export interface Equipment {
  id: number
  name: string
  typeId: number
  typeName: string
  status: EquipmentStatus
  lastCleanedDate: string
  maintenanceHistory: MaintenanceRecord[]
}

export interface EquipmentFormData {
  name: string
  typeId: number
  status: EquipmentStatus
  lastCleanedDate: string
}

export interface MaintenanceLogFormData {
  date: string
  notes: string
  performedBy: string
}

/** Server-side paginated response */
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

/** Query parameters for the paginated equipment endpoint */
export interface EquipmentQuery {
  page: number
  size: number
  status?: string
  search?: string
  sortBy: string
  sortDir: "asc" | "desc"
}

export const EQUIPMENT_STATUSES: EquipmentStatus[] = [
  "Active",
  "Inactive",
  "Under Maintenance",
]
