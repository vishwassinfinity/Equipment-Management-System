package com.equipmentmgmt.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "equipment")
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    private EquipmentType equipmentType;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "last_cleaned_date", nullable = false)
    private LocalDate lastCleanedDate;

    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("maintenanceDate DESC")
    private List<MaintenanceRecord> maintenanceHistory = new ArrayList<>();

    public Equipment() {
    }

    public Equipment(String name, EquipmentType equipmentType, String status, LocalDate lastCleanedDate) {
        this.name = name;
        this.equipmentType = equipmentType;
        this.status = status;
        this.lastCleanedDate = lastCleanedDate;
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

    public EquipmentType getEquipmentType() {
        return equipmentType;
    }

    public void setEquipmentType(EquipmentType equipmentType) {
        this.equipmentType = equipmentType;
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

    public List<MaintenanceRecord> getMaintenanceHistory() {
        return maintenanceHistory;
    }

    public void setMaintenanceHistory(List<MaintenanceRecord> maintenanceHistory) {
        this.maintenanceHistory = maintenanceHistory;
    }
}
