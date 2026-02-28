package com.equipmentmgmt.dto;

import com.equipmentmgmt.model.EquipmentType;

public class EquipmentTypeResponse {

    private Integer id;
    private String name;

    public EquipmentTypeResponse() {
    }

    public static EquipmentTypeResponse fromEntity(EquipmentType type) {
        EquipmentTypeResponse response = new EquipmentTypeResponse();
        response.setId(type.getId());
        response.setName(type.getName());
        return response;
    }

    // --- Getters & Setters ---

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
