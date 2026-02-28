import type { Equipment } from "@/types/equipment"

/**
 * Simulated equipment types from the database.
 * In production, this will be fetched from the backend API.
 */
export const EQUIPMENT_TYPES: string[] = [
  "Centrifuge",
  "Microscope",
  "Autoclave",
  "Spectrophotometer",
  "Incubator",
  "Fume Hood",
  "PCR Machine",
  "Water Bath",
]

/**
 * Seed data for development/testing.
 * Will be replaced by API calls to the backend.
 */
export const SEED_EQUIPMENT: Equipment[] = [
  {
    id: "eq-001",
    name: "Centrifuge Alpha",
    type: "Centrifuge",
    status: "Active",
    lastCleanedDate: "2026-02-25",
    maintenanceHistory: [
      {
        id: "mh-001",
        date: "2026-02-20",
        description: "Routine calibration and rotor inspection",
        performedBy: "Dr. Smith",
      },
      {
        id: "mh-002",
        date: "2026-01-15",
        description: "Replaced bearing assembly",
        performedBy: "Tech. Johnson",
      },
    ],
  },
  {
    id: "eq-002",
    name: "Microscope Beta",
    type: "Microscope",
    status: "Under Maintenance",
    lastCleanedDate: "2026-02-18",
    maintenanceHistory: [
      {
        id: "mh-003",
        date: "2026-02-18",
        description: "Lens realignment and cleaning",
        performedBy: "Tech. Davis",
      },
    ],
  },
  {
    id: "eq-003",
    name: "Autoclave Gamma",
    type: "Autoclave",
    status: "Active",
    lastCleanedDate: "2026-02-27",
    maintenanceHistory: [
      {
        id: "mh-004",
        date: "2026-02-10",
        description: "Pressure valve replacement",
        performedBy: "Eng. Williams",
      },
      {
        id: "mh-005",
        date: "2026-01-05",
        description: "Annual safety inspection",
        performedBy: "Safety Team",
      },
      {
        id: "mh-006",
        date: "2025-12-01",
        description: "Gasket replacement and seal test",
        performedBy: "Tech. Johnson",
      },
    ],
  },
  {
    id: "eq-004",
    name: "Spectro Delta",
    type: "Spectrophotometer",
    status: "Inactive",
    lastCleanedDate: "2026-01-30",
    maintenanceHistory: [],
  },
  {
    id: "eq-005",
    name: "Incubator Epsilon",
    type: "Incubator",
    status: "Active",
    lastCleanedDate: "2026-02-26",
    maintenanceHistory: [
      {
        id: "mh-007",
        date: "2026-02-15",
        description: "Temperature sensor recalibration",
        performedBy: "Tech. Davis",
      },
    ],
  },
]
