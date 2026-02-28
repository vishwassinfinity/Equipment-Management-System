package com.equipmentmgmt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class MaintenanceRequest {

    @NotNull(message = "Equipment ID is required")
    private Long equipmentId;

    @NotNull(message = "Maintenance date is required")
    private LocalDate date;

    @NotBlank(message = "Notes are required")
    @Size(min = 3, max = 1000, message = "Notes must be between 3 and 1000 characters")
    private String notes;

    @NotBlank(message = "Performed by is required")
    @Size(min = 2, max = 255, message = "Performed by must be between 2 and 255 characters")
    private String performedBy;

    public MaintenanceRequest() {
    }

    public Long getEquipmentId() {
        return equipmentId;
    }

    public void setEquipmentId(Long equipmentId) {
        this.equipmentId = equipmentId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }
}
