import type {
  Equipment,
  EquipmentFormData,
  EquipmentQuery,
  EquipmentType,
  MaintenanceLogFormData,
  MaintenanceRecord,
  PageResponse,
} from "@/types/equipment"

const API_BASE = "http://localhost:8080/api"

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message = body?.message || `Request failed with status ${response.status}`
    throw new Error(message)
  }
  return response.json()
}

// ─── Equipment Types ───────────────────────────────────────

export async function fetchEquipmentTypes(): Promise<EquipmentType[]> {
  const res = await fetch(`${API_BASE}/equipment-types`)
  return handleResponse<EquipmentType[]>(res)
}

export async function createEquipmentType(name: string): Promise<EquipmentType> {
  const res = await fetch(`${API_BASE}/equipment-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  })
  return handleResponse<EquipmentType>(res)
}

// ─── Equipment ─────────────────────────────────────────────

/**
 * Paginated, filterable, searchable, sortable equipment list.
 */
export async function fetchEquipment(query: EquipmentQuery): Promise<PageResponse<Equipment>> {
  const params = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
    sortBy: query.sortBy,
    sortDir: query.sortDir,
  })
  if (query.status) params.set("status", query.status)
  if (query.search) params.set("search", query.search)

  const res = await fetch(`${API_BASE}/equipment?${params}`)
  return handleResponse<PageResponse<Equipment>>(res)
}

export async function fetchEquipmentById(id: number): Promise<Equipment> {
  const res = await fetch(`${API_BASE}/equipment/${id}`)
  return handleResponse<Equipment>(res)
}

export async function createEquipment(data: EquipmentFormData): Promise<Equipment> {
  const res = await fetch(`${API_BASE}/equipment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      typeId: data.typeId,
      status: data.status,
      lastCleanedDate: data.lastCleanedDate,
    }),
  })
  return handleResponse<Equipment>(res)
}

export async function updateEquipment(id: number, data: EquipmentFormData): Promise<Equipment> {
  const res = await fetch(`${API_BASE}/equipment/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      typeId: data.typeId,
      status: data.status,
      lastCleanedDate: data.lastCleanedDate,
    }),
  })
  return handleResponse<Equipment>(res)
}

export async function deleteEquipment(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/equipment/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || `Delete failed with status ${res.status}`)
  }
}

// ─── Maintenance ───────────────────────────────────────────

export async function fetchMaintenanceHistory(equipmentId: number): Promise<MaintenanceRecord[]> {
  const res = await fetch(`${API_BASE}/equipment/${equipmentId}/maintenance`)
  return handleResponse<MaintenanceRecord[]>(res)
}

export async function logMaintenance(
  equipmentId: number,
  data: MaintenanceLogFormData
): Promise<MaintenanceRecord> {
  const res = await fetch(`${API_BASE}/maintenance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      equipmentId,
      date: data.date,
      notes: data.notes,
      performedBy: data.performedBy,
    }),
  })
  return handleResponse<MaintenanceRecord>(res)
}
