# Compliance Checklist

This document maps each project requirement to its implementation.

---

## Functional Requirements

| # | Requirement | Status | Implementation |
|---|-------------|--------|----------------|
| 1 | CRUD operations for equipment | Done | `EquipmentController` — POST, GET, PUT, DELETE at `/api/equipment` |
| 2 | Equipment fields: name, type, status, last cleaned date | Done | `Equipment` entity with all four fields; `EquipmentRequest` DTO with validation |
| 3 | Status values: Active, Inactive, Under Maintenance | Done | Database CHECK constraint + backend `validateStatus()` |
| 4 | Maintenance history logging | Done | `MaintenanceController` POST `/api/maintenance`; records stored in `maintenance_records` table |
| 5 | View maintenance history per equipment | Done | GET `/api/equipment/{id}/maintenance`; dialog in frontend |
| 6 | 30-day Active rule: cannot set Active if last cleaned > 30 days | Done | `EquipmentService.validateActiveStatusCleanedDate()` enforced on create, update, and maintenance log |
| 7 | Last cleaned date not editable during edit | Done | Frontend form disables the date picker in edit mode; helper text directs user to log maintenance |
| 8 | Search (by name and type) | Done | Server-side via JPA Specification `searchByKeyword()` with case-insensitive LIKE |
| 9 | Filter by status | Done | Server-side via JPA Specification `hasStatus()` |
| 10 | Pagination | Done | Server-side using Spring Data `Pageable`; frontend pagination controls |
| 11 | Server-side sorting | Done | `PageRequest.of(page, size, sort)` with column mapping; sort dropdown + clickable column headers |

## Technical Requirements

| # | Requirement | Status | Implementation |
|---|-------------|--------|----------------|
| 1 | React frontend | Done | React 19 with TypeScript, Vite 7, Tailwind CSS |
| 2 | Spring Boot backend | Done | Spring Boot 3.2.3, Java 17, Maven |
| 3 | PostgreSQL database | Done | PostgreSQL 16; schema in `db/schema.sql` |
| 4 | No inline CSS | Done | All styling uses Tailwind utility classes via `className`; zero `style=` attributes in codebase |
| 5 | `/backend`, `/frontend`, `/db` folder structure | Done | Project root contains all three directories |
| 6 | `README.md` with setup instructions | Done | Comprehensive README with prerequisite, database, backend, and frontend setup steps |
| 7 | `COMPLIANCE.md` | Done | This document |

## Business Rules

| Rule | Enforcement Layer | Details |
|------|-------------------|---------|
| Equipment cannot be Active if last cleaned > 30 days | Backend | `EquipmentService.validateActiveStatusCleanedDate()` returns HTTP 400 with day count in message |
| Maintenance log sets equipment to Active | Backend | `MaintenanceService.logMaintenance()` updates status and last cleaned date |
| Valid statuses only | Backend + Database | Backend validation + PostgreSQL CHECK constraint |
| Last cleaned date immutable in edit | Frontend | Date picker disabled in edit mode; only updated via maintenance log |
| Equipment type is required | Backend + Frontend | `@NotNull` on `typeId` in DTO; frontend form validation |

## Database Schema

- **`equipment_types`** — Lookup table for dynamic equipment types (SERIAL PK)
- **`equipment`** — Main table with FK to `equipment_types`, CHECK on status, indexes on `type_id` and `status`
- **`maintenance_records`** — FK to `equipment` with CASCADE delete, indexes on `equipment_id` and `maintenance_date`
- Schema uses `ddl-auto=validate` — Hibernate verifies entity mappings against the existing schema without modifying it
