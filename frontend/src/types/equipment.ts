export type EquipmentStatus = "Active" | "Inactive" | "Under Maintenance"

export interface MaintenanceRecord {
  id: string
  date: string
  notes: string
  performedBy: string
}

export interface Equipment {
  id: string
  name: string
  type: string
  status: EquipmentStatus
  lastCleanedDate: string
  maintenanceHistory: MaintenanceRecord[]
}

export interface EquipmentFormData {
  name: string
  type: string
  status: EquipmentStatus
  lastCleanedDate: string
}

export interface MaintenanceLogFormData {
  date: string
  notes: string
  performedBy: string
}

export const EQUIPMENT_STATUSES: EquipmentStatus[] = [
  "Active",
  "Inactive",
  "Under Maintenance",
]
