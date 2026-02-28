package com.equipmentmgmt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class EquipmentRequest {

    @NotBlank(message = "Equipment name is required")
    @Size(min = 2, max = 255, message = "Name must be between 2 and 255 characters")
    private String name;

    @NotBlank(message = "Equipment type is required")
    private String type;

    @NotBlank(message = "Status is required")
    private String status;

    @NotNull(message = "Last cleaned date is required")
    private LocalDate lastCleanedDate;

    public EquipmentRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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
}
