package com.equipmentmgmt.dto;

import com.equipmentmgmt.model.MaintenanceRecord;
import java.time.LocalDate;

public class MaintenanceRecordResponse {

    private Long id;
    private LocalDate date;
    private String notes;
    private String performedBy;

    public MaintenanceRecordResponse() {
    }

    public static MaintenanceRecordResponse fromEntity(MaintenanceRecord record) {
        MaintenanceRecordResponse response = new MaintenanceRecordResponse();
        response.setId(record.getId());
        response.setDate(record.getMaintenanceDate());
        response.setNotes(record.getNotes());
        response.setPerformedBy(record.getPerformedBy());
        return response;
    }

    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
