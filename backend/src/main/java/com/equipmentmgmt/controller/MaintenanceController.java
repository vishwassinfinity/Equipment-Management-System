package com.equipmentmgmt.controller;

import com.equipmentmgmt.dto.MaintenanceRecordResponse;
import com.equipmentmgmt.dto.MaintenanceRequest;
import com.equipmentmgmt.service.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @PostMapping
    public ResponseEntity<MaintenanceRecordResponse> logMaintenance(@Valid @RequestBody MaintenanceRequest request) {
        MaintenanceRecordResponse response = maintenanceService.logMaintenance(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
