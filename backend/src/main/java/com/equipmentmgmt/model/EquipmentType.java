package com.equipmentmgmt.model;

import jakarta.persistence.*;

@Entity
@Table(name = "equipment_types")
public class EquipmentType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    public EquipmentType() {
    }

    public EquipmentType(String name) {
        this.name = name;
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
