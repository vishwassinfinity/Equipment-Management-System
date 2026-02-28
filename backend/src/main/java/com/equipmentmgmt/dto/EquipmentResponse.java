package com.equipmentmgmt.dto;

import com.equipmentmgmt.model.Equipment;
import java.time.LocalDate;
import java.util.List;

public class EquipmentResponse {

    private Long id;
    private String name;
    private Integer typeId;
    private String typeName;
    private String status;
    private LocalDate lastCleanedDate;
    private List<MaintenanceRecordResponse> maintenanceHistory;

    public EquipmentResponse() {
    }

    public static EquipmentResponse fromEntity(Equipment equipment) {
        EquipmentResponse response = new EquipmentResponse();
        response.setId(equipment.getId());
        response.setName(equipment.getName());
        response.setTypeId(equipment.getEquipmentType().getId());
        response.setTypeName(equipment.getEquipmentType().getName());
        response.setStatus(equipment.getStatus());
        response.setLastCleanedDate(equipment.getLastCleanedDate());
        response.setMaintenanceHistory(
                equipment.getMaintenanceHistory()
                        .stream()
                        .map(MaintenanceRecordResponse::fromEntity)
                        .toList()
        );
        return response;
    }

    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getTypeId() {
        return typeId;
    }

    public void setTypeId(Integer typeId) {
        this.typeId = typeId;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getLastCleanedDate() {
        return lastCleanedDate;
    }

    public void setLastCleanedDate(LocalDate lastCleanedDate) {
        this.lastCleanedDate = lastCleanedDate;
    }

    public List<MaintenanceRecordResponse> getMaintenanceHistory() {
        return maintenanceHistory;
    }

    public void setMaintenanceHistory(List<MaintenanceRecordResponse> maintenanceHistory) {
        this.maintenanceHistory = maintenanceHistory;
    }
}
