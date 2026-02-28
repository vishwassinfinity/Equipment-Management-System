package com.equipmentmgmt.model;

public enum EquipmentStatus {
    Active,
    Inactive,
    Under_Maintenance;

    /**
     * Converts a display string like "Under Maintenance" to the enum value.
     */
    public static EquipmentStatus fromDisplayString(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
        String normalized = value.trim().replace(" ", "_");
        try {
            return EquipmentStatus.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Invalid status: '" + value + "'. Must be one of: Active, Inactive, Under Maintenance"
            );
        }
    }

    /**
     * Returns the display-friendly string (e.g., "Under Maintenance" instead of "Under_Maintenance").
     */
    public String toDisplayString() {
        return this.name().replace("_", " ");
    }
}
