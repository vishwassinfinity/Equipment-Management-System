-- ============================================================
-- Equipment Management System — PostgreSQL Schema
-- Normalized design with 3 tables:
--   1. equipment_types  (lookup / reference table)
--   2. equipment        (FK → equipment_types)
--   3. maintenance_records (FK → equipment)
-- ============================================================

-- Drop tables in reverse dependency order (idempotent)
DROP TABLE IF EXISTS maintenance_records CASCADE;
DROP TABLE IF EXISTS equipment           CASCADE;
DROP TABLE IF EXISTS equipment_types     CASCADE;

-- ============================================================
-- 1. Equipment Types (modifiable without code changes)
-- ============================================================
CREATE TABLE equipment_types (
    id   SERIAL       PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================================
-- 2. Equipment
-- ============================================================
CREATE TABLE equipment (
    id                BIGSERIAL    PRIMARY KEY,
    name              VARCHAR(255) NOT NULL,
    type_id           INTEGER      NOT NULL REFERENCES equipment_types(id),
    status            VARCHAR(50)  NOT NULL DEFAULT 'Active'
                      CHECK (status IN ('Active', 'Inactive', 'Under Maintenance')),
    last_cleaned_date DATE         NOT NULL,
    created_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_equipment_type_id ON equipment(type_id);
CREATE INDEX idx_equipment_status  ON equipment(status);

-- ============================================================
-- 3. Maintenance Records
-- ============================================================
CREATE TABLE maintenance_records (
    id               BIGSERIAL    PRIMARY KEY,
    equipment_id     BIGINT       NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    maintenance_date DATE         NOT NULL,
    notes            TEXT         NOT NULL,
    performed_by     VARCHAR(255) NOT NULL,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_maintenance_equipment_id ON maintenance_records(equipment_id);
CREATE INDEX idx_maintenance_date         ON maintenance_records(maintenance_date);

-- ============================================================
-- Seed Data — Equipment Types
-- ============================================================
INSERT INTO equipment_types (name) VALUES
    ('Centrifuge'),
    ('Microscope'),
    ('Autoclave'),
    ('Spectrophotometer'),
    ('Incubator'),
    ('Fume Hood'),
    ('PCR Machine'),
    ('Water Bath');

-- ============================================================
-- Seed Data — Equipment
-- ============================================================
INSERT INTO equipment (name, type_id, status, last_cleaned_date) VALUES
    ('Centrifuge Alpha',   (SELECT id FROM equipment_types WHERE name = 'Centrifuge'),         'Active',            '2026-02-25'),
    ('Microscope Beta',    (SELECT id FROM equipment_types WHERE name = 'Microscope'),          'Under Maintenance', '2026-02-18'),
    ('Autoclave Gamma',    (SELECT id FROM equipment_types WHERE name = 'Autoclave'),           'Active',            '2026-02-27'),
    ('Spectro Delta',      (SELECT id FROM equipment_types WHERE name = 'Spectrophotometer'),   'Inactive',          '2026-01-30'),
    ('Incubator Epsilon',  (SELECT id FROM equipment_types WHERE name = 'Incubator'),           'Active',            '2026-02-26');

-- ============================================================
-- Seed Data — Maintenance Records
-- ============================================================
INSERT INTO maintenance_records (equipment_id, maintenance_date, notes, performed_by) VALUES
    ((SELECT id FROM equipment WHERE name = 'Centrifuge Alpha'), '2026-02-20', 'Routine calibration and rotor inspection',  'Dr. Smith'),
    ((SELECT id FROM equipment WHERE name = 'Centrifuge Alpha'), '2026-01-15', 'Replaced bearing assembly',                 'Tech. Johnson'),
    ((SELECT id FROM equipment WHERE name = 'Microscope Beta'),  '2026-02-18', 'Lens realignment and cleaning',             'Tech. Davis'),
    ((SELECT id FROM equipment WHERE name = 'Autoclave Gamma'),  '2026-02-10', 'Pressure valve replacement',                'Eng. Williams'),
    ((SELECT id FROM equipment WHERE name = 'Autoclave Gamma'),  '2026-01-05', 'Annual safety inspection',                  'Safety Team'),
    ((SELECT id FROM equipment WHERE name = 'Autoclave Gamma'),  '2025-12-01', 'Gasket replacement and seal test',          'Tech. Johnson'),
    ((SELECT id FROM equipment WHERE name = 'Incubator Epsilon'),'2026-02-15', 'Temperature sensor recalibration',          'Tech. Davis');
