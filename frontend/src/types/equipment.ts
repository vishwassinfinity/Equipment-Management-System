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

export const EQUIPMENT_STATUSES: EquipmentStatus[] = [
  "Active",
  "Inactive",
  "Under Maintenance",
]
