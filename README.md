# Equipment Management System

A full-stack web application for managing and tracking laboratory equipment, maintenance history, and cleaning schedules.

## Project Structure

```
├── backend/          # Spring Boot REST API (Java 17, Maven)
├── frontend/         # React SPA (TypeScript, Vite, Tailwind CSS)
├── db/               # PostgreSQL schema and seed data
│   └── schema.sql
├── README.md
└── COMPLIANCE.md
```

---

## Prerequisites

| Tool          | Version  | Install (macOS)                          |
| ------------- | -------- | ---------------------------------------- |
| Node.js       | ≥ 18     | `brew install node`                      |
| Java (JDK)    | 17       | `brew install --cask corretto@17`        |
| Maven         | ≥ 3.9    | Included via `./mvnw` wrapper in backend |
| PostgreSQL    | ≥ 15     | `brew install postgresql@16`             |

---

## 1. Database Setup

### Start PostgreSQL

```bash
brew services start postgresql@16
```

> If `psql` is not on your PATH, run:
> ```bash
> export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
> ```

### Create the database and user

```bash
psql -U postgres
```

```sql
CREATE USER equipment_admin WITH PASSWORD 'equipment_pass';
CREATE DATABASE equipment_management_db OWNER equipment_admin;
GRANT ALL PRIVILEGES ON DATABASE equipment_management_db TO equipment_admin;
\q
```

### Run the schema and seed data

```bash
psql -U equipment_admin -d equipment_management_db -f db/schema.sql
```

This creates three normalised tables (`equipment_types`, `equipment`, `maintenance_records`) with indexes and sample data.

---

## 2. Backend Setup

```bash
cd backend
```

### Set Java 17 (if multiple JDKs are installed)

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

### Build

```bash
./mvnw package -q
```

### Run

```bash
java -jar target/equipment-management-0.0.1-SNAPSHOT.jar
```

The API starts on **http://localhost:8080**.

### Configuration

Database connection details are in `backend/src/main/resources/application.properties`:

| Property               | Default Value                                              |
| ---------------------- | ---------------------------------------------------------- |
| `spring.datasource.url`      | `jdbc:postgresql://localhost:5432/equipment_management_db` |
| `spring.datasource.username` | `equipment_admin`                                          |
| `spring.datasource.password` | `equipment_pass`                                           |
| `spring.jpa.hibernate.ddl-auto` | `validate`                                              |

### API Endpoints

| Method | Endpoint                        | Description                                      |
| ------ | ------------------------------- | ------------------------------------------------ |
| GET    | `/api/equipment`                | Paginated list (supports `status`, `search`, `sortBy`, `sortDir`, `page`, `size`) |
| GET    | `/api/equipment/{id}`           | Get single equipment                             |
| POST   | `/api/equipment`                | Create equipment                                 |
| PUT    | `/api/equipment/{id}`           | Update equipment                                 |
| DELETE | `/api/equipment/{id}`           | Delete equipment                                 |
| GET    | `/api/equipment/{id}/maintenance` | Maintenance history for equipment              |
| POST   | `/api/maintenance`              | Log a maintenance record                         |
| GET    | `/api/equipment-types`          | List all equipment types                         |
| POST   | `/api/equipment-types`          | Create equipment type                            |
| PUT    | `/api/equipment-types/{id}`     | Update equipment type                            |
| DELETE | `/api/equipment-types/{id}`     | Delete equipment type                            |

---

## 3. Frontend Setup

```bash
cd frontend
```

### Install dependencies

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required because `react-day-picker@8` has a peer dependency on React 18, while this project uses React 19.

### Run development server

```bash
npm run dev
```

The app starts on **http://localhost:5173**.

### Production build

```bash
npm run build
npm run preview    # serves the build locally
```

---

## Libraries Used

### Backend (Spring Boot 3.2.3)

| Library                                | Purpose                                   |
| -------------------------------------- | ----------------------------------------- |
| `spring-boot-starter-web`             | REST controllers, embedded Tomcat          |
| `spring-boot-starter-data-jpa`        | JPA / Hibernate ORM, `JpaSpecificationExecutor` for dynamic queries |
| `spring-boot-starter-validation`      | Bean validation (`@NotBlank`, `@NotNull`)  |
| `postgresql` (runtime)                | PostgreSQL JDBC driver                     |

### Frontend (Vite + React 19 + TypeScript)

| Library                     | Purpose                                        |
| --------------------------- | ---------------------------------------------- |
| `react` / `react-dom`      | UI framework                                   |
| `tailwindcss`              | Utility-first CSS (no inline styles)            |
| `tailwindcss-animate`      | Animation utilities for Tailwind                |
| `@radix-ui/react-dialog`   | Accessible modal dialogs                       |
| `@radix-ui/react-dropdown-menu` | Action menus on table rows                |
| `@radix-ui/react-select`   | Accessible select/dropdown component           |
| `@radix-ui/react-popover`  | Popover for date picker                        |
| `@radix-ui/react-label`    | Accessible form labels                         |
| `@radix-ui/react-slot`     | Primitives for component composition           |
| `react-day-picker`         | Calendar date picker                            |
| `date-fns`                 | Date formatting                                 |
| `lucide-react`             | Icon set                                        |
| `class-variance-authority` | Component variant styling (shadcn/ui pattern)   |
| `clsx` / `tailwind-merge`  | Conditional class merging                       |

---

## Features

- **CRUD** — Create, read, update, and delete equipment
- **Maintenance Logging** — Log maintenance records with date, notes, and performer
- **Maintenance History** — View full maintenance timeline per equipment
- **Server-side Pagination** — Paginated API with page controls (first, prev, next, last)
- **Search** — Case-insensitive search across equipment name and type
- **Status Filtering** — Filter by Active, Inactive, or Under Maintenance
- **Server-side Sorting** — Sort by name, type, status, or last cleaned date (asc/desc)
- **30-day Active Rule** — Equipment cannot be set to Active if last cleaned date is more than 30 days ago (enforced on backend)
- **Last Cleaned Date Protection** — Last cleaned date is read-only during edit; only updated via maintenance logging
- **Equipment Types Management** — Dynamic equipment types stored in database (no hardcoded values)
- **Input Validation** — Both client-side form validation and server-side bean validation with error display

---

## Assumptions

1. **Single-user system** — No authentication or authorisation is implemented. The application is designed for a single operator or small team.
2. **Local development** — PostgreSQL runs on `localhost:5432`. No Docker or cloud deployment configuration is provided.
3. **Status values are fixed** — The three allowed statuses (`Active`, `Inactive`, `Under Maintenance`) are enforced by a database CHECK constraint and backend validation.
4. **Maintenance sets status to Active** — Logging a maintenance record automatically marks the equipment as Active and updates its last cleaned date.
5. **Last cleaned date is immutable via edit** — To prevent bypassing the 30-day rule, the last cleaned date can only be updated through the maintenance log workflow.
6. **Equipment types are user-managed** — New types can be added via API without code changes.
7. **No inline CSS** — All styling uses Tailwind CSS utility classes; no `style=` attributes are used anywhere.
8. **react-day-picker v8** — Installed with `--legacy-peer-deps` due to a React 19 peer dependency mismatch.
9. **Schema managed externally** — Hibernate is set to `validate` mode; the database schema is created and seeded via `db/schema.sql`, not auto-generated by JPA.
