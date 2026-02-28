package com.equipmentmgmt.controller;

import com.equipmentmgmt.dto.EquipmentTypeResponse;
import com.equipmentmgmt.service.EquipmentTypeService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment-types")
public class EquipmentTypeController {

    private final EquipmentTypeService equipmentTypeService;

    public EquipmentTypeController(EquipmentTypeService equipmentTypeService) {
        this.equipmentTypeService = equipmentTypeService;
    }

    @GetMapping
    public ResponseEntity<List<EquipmentTypeResponse>> getAllTypes() {
        return ResponseEntity.ok(equipmentTypeService.getAllTypes());
    }

    @PostMapping
    public ResponseEntity<EquipmentTypeResponse> createType(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Type name is required");
        }
        if (name.trim().length() > 100) {
            throw new IllegalArgumentException("Type name must be at most 100 characters");
        }
        EquipmentTypeResponse created = equipmentTypeService.createType(name);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipmentTypeResponse> updateType(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body
    ) {
        String name = body.get("name");
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Type name is required");
        }
        if (name.trim().length() > 100) {
            throw new IllegalArgumentException("Type name must be at most 100 characters");
        }
        return ResponseEntity.ok(equipmentTypeService.updateType(id, name));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteType(@PathVariable Integer id) {
        equipmentTypeService.deleteType(id);
        return ResponseEntity.noContent().build();
    }
}
