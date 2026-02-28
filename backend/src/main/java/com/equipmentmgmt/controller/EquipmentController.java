package com.equipmentmgmt.controller;

import com.equipmentmgmt.dto.EquipmentRequest;
import com.equipmentmgmt.dto.EquipmentResponse;
import com.equipmentmgmt.dto.MaintenanceRecordResponse;
import com.equipmentmgmt.service.EquipmentService;
import com.equipmentmgmt.service.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentService equipmentService;
    private final MaintenanceService maintenanceService;

    public EquipmentController(EquipmentService equipmentService, MaintenanceService maintenanceService) {
        this.equipmentService = equipmentService;
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public ResponseEntity<List<EquipmentResponse>> getAllEquipment() {
        return ResponseEntity.ok(equipmentService.getAllEquipment());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentResponse> getEquipmentById(@PathVariable Long id) {
        return ResponseEntity.ok(equipmentService.getEquipmentById(id));
    }

    @PostMapping
    public ResponseEntity<EquipmentResponse> createEquipment(@Valid @RequestBody EquipmentRequest request) {
        EquipmentResponse created = equipmentService.createEquipment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipmentResponse> updateEquipment(
            @PathVariable Long id,
            @Valid @RequestBody EquipmentRequest request
    ) {
        return ResponseEntity.ok(equipmentService.updateEquipment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/maintenance")
    public ResponseEntity<List<MaintenanceRecordResponse>> getMaintenanceHistory(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceHistory(id));
    }
}
