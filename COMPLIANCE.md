# Compliance Checklist

This document confirms compliance with all submission requirements.

---

## UI Compliance

- **No inline styles were used** — All styling uses Tailwind CSS utility classes via `className`. Zero `style={{}}` or `style={}` attributes exist in the codebase.
- **No raw HTML form elements were used** — All form elements (`Input`, `Select`, `Button`, `Label`, `Calendar`, `Popover`, `Dialog`) are shadcn/ui components built on Radix UI primitives. No raw `<input>`, `<select>`, `<button>`, or `<textarea>` elements are used in application components.
- **Add and Edit reuse the same form component** — A single `EquipmentForm` component (`frontend/src/components/equipment-form.tsx`) handles both add and edit modes. It receives optional `initialData` (null for add, populated for edit) and adapts accordingly.

## Database Compliance

- **Equipment types are not hardcoded in the database schema** — Equipment types are stored in a separate `equipment_types` table with a foreign key from `equipment.type_id`. New types can be added, updated, or deleted at any time via the `/api/equipment-types` API without any code changes.

## Business Rules (Backend-Enforced)

- **30-day Active status rule** — `EquipmentService.validateActiveStatusCleanedDate()` rejects any attempt to set status to "Active" if the last cleaned date is older than 30 days. Returns HTTP 400 with a descriptive error message including the exact day count. Enforced on create, update, and maintenance logging.
- **Maintenance updates status and date** — `MaintenanceService.logMaintenance()` automatically sets equipment status to "Active" and updates last cleaned date to the maintenance date.
- **Status validation** — Only "Active", "Inactive", and "Under Maintenance" are accepted. Enforced by both backend validation and a PostgreSQL CHECK constraint.

---

## Requirement-to-Implementation Map

### Core Features

| # | Requirement | Status | Implementation |
|---|-------------|--------|----------------|
| 1 | View equipment in table format | Done | `EquipmentTable` component with sortable columns |
| 2 | Add new equipment | Done | `EquipmentForm` via `EquipmentFormDialog` (add mode) |
| 3 | Edit existing equipment | Done | Same `EquipmentForm` via `EquipmentFormDialog` (edit mode) |
| 4 | Delete equipment | Done | `DeleteConfirmDialog` with confirmation |
| 5 | Equipment fields: Name, Type, Status, Last Cleaned Date | Done | All four fields in entity, DTO, form, and table |
| 6 | Type as dynamic dropdown from database | Done | `equipment_types` table; `EquipmentTypeController` CRUD API; frontend fetches types dynamically |

### Workflow 1 — Maintenance Logging

| # | Requirement | Status | Implementation |
|---|-------------|--------|----------------|
| 1 | Log maintenance with Equipment, Date, Notes, Performed By | Done | `MaintenanceController` POST `/api/maintenance` |
| 2 | Status auto-changes to Active on maintenance | Done | `MaintenanceService.logMaintenance()` |
| 3 | Last Cleaned Date updates to Maintenance Date | Done | `MaintenanceService.logMaintenance()` |
| 4 | Maintenance history viewable per equipment | Done | GET `/api/equipment/{id}/maintenance`; `MaintenanceHistoryDialog` in frontend |
| 5 | Logic implemented in backend | Done | All in `MaintenanceService` |

### Workflow 2 — Status Constraint

| # | Requirement | Status | Implementation |
|---|-------------|--------|----------------|
| 1 | Cannot mark Active if Last Cleaned > 30 days | Done | `EquipmentService.validateActiveStatusCleanedDate()` |
| 2 | Backend rejects the request | Done | Throws `IllegalArgumentException` → HTTP 400 |
| 3 | Meaningful error shown in UI | Done | Error banner in `EquipmentFormDialog` and `MaintenanceLogDialog` |

### Technical — Frontend

| # | Requirement | Status | Implementation |
|---|-------------|--------|----------------|
| 1 | React | Done | React 19 with TypeScript |
| 2 | shadcn/ui + Tailwind only | Done | All components use shadcn/ui (Radix UI) + Tailwind |
| 3 | No inline styles | Done | Zero `style=` attributes |
| 4 | No raw HTML form elements | Done | All use shadcn `Button`, `Input`, `Select`, `Label` |
| 5 | Add/Edit reuse same form | Done | Single `EquipmentForm` component |
| 6 | Basic validation | Done | Client-side + server-side validation |
| 7 | Equipment displayed in table | Done | `EquipmentTable` with `Table` component |
| 8 | Maintenance history display | Done | `MaintenanceHistoryDialog` (modal) |

### Technical — Backend

| # | Requirement | Status | Implementation |
|---|-------------|--------|----------------|
| 1 | Spring Boot with Java | Done | Spring Boot 3.2.3, Java 17 |
| 2 | Layered architecture (Controller/Service/Repository) | Done | Separate packages for each layer |
| 3 | All required REST endpoints | Done | See API table in README.md |
| 4 | Parameterized queries | Done | JPA methods + `@Param` JPQL + Criteria API Specifications |
| 5 | Exception handling | Done | `GlobalExceptionHandler` with structured JSON responses |
| 6 | Appropriate HTTP status codes | Done | 200, 201, 204, 400, 404, 500 |

### Technical — Database

| # | Requirement | Status | Implementation |
|---|-------------|--------|----------------|
| 1 | PostgreSQL | Done | PostgreSQL 16 |
| 2 | Proper relationships | Done | `equipment_types` ←FK— `equipment` ←FK— `maintenance_records` |
| 3 | Equipment types modifiable without code changes | Done | Separate `equipment_types` table + full CRUD API |

### Bonus Features

| # | Feature | Status | Implementation |
|---|---------|--------|----------------|
| 1 | Filtering by status | Done | Server-side via JPA Specification |
| 2 | Pagination | Done | Spring Data `Pageable` with frontend controls |
| 3 | Search | Done | Case-insensitive LIKE on name and type |
| 4 | Server-side sorting | Done | `PageRequest` with `Sort` + sort dropdown |
| 5 | Docker setup | Not done | — |

### Submission

| # | Requirement | Status |
|---|-------------|--------|
| 1 | Public GitHub repository | Ready to push |
| 2 | Monorepo with `/backend`, `/frontend`, `/db` | Done |
| 3 | `README.md` with setup + libraries + assumptions | Done |
| 4 | `COMPLIANCE.md` | Done (this file) |
