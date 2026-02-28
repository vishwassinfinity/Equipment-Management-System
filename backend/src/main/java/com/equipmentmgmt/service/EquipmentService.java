package com.equipmentmgmt.service;

import com.equipmentmgmt.dto.EquipmentRequest;
import com.equipmentmgmt.dto.EquipmentResponse;
import com.equipmentmgmt.exception.ResourceNotFoundException;
import com.equipmentmgmt.model.Equipment;
import com.equipmentmgmt.model.EquipmentType;
import com.equipmentmgmt.repository.EquipmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentTypeService equipmentTypeService;

    public EquipmentService(EquipmentRepository equipmentRepository, EquipmentTypeService equipmentTypeService) {
        this.equipmentRepository = equipmentRepository;
        this.equipmentTypeService = equipmentTypeService;
    }

    @Transactional(readOnly = true)
    public List<EquipmentResponse> getAllEquipment() {
        return equipmentRepository.findAll()
                .stream()
                .map(EquipmentResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public EquipmentResponse getEquipmentById(Long id) {
        Equipment equipment = findEquipmentOrThrow(id);
        return EquipmentResponse.fromEntity(equipment);
    }

    @Transactional
    public EquipmentResponse createEquipment(EquipmentRequest request) {
        validateStatus(request.getStatus());
        EquipmentType type = equipmentTypeService.findTypeOrThrow(request.getTypeId());

        Equipment equipment = new Equipment(
                request.getName().trim(),
                type,
                request.getStatus().trim(),
                request.getLastCleanedDate()
        );

        Equipment saved = equipmentRepository.save(equipment);
        return EquipmentResponse.fromEntity(saved);
    }

    @Transactional
    public EquipmentResponse updateEquipment(Long id, EquipmentRequest request) {
        Equipment equipment = findEquipmentOrThrow(id);
        validateStatus(request.getStatus());
        EquipmentType type = equipmentTypeService.findTypeOrThrow(request.getTypeId());

        equipment.setName(request.getName().trim());
        equipment.setEquipmentType(type);
        equipment.setStatus(request.getStatus().trim());
        equipment.setLastCleanedDate(request.getLastCleanedDate());

        Equipment saved = equipmentRepository.save(equipment);
        return EquipmentResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteEquipment(Long id) {
        Equipment equipment = findEquipmentOrThrow(id);
        equipmentRepository.delete(equipment);
    }

    /**
     * Package-private helper so MaintenanceService can also look up equipment.
     */
    Equipment findEquipmentOrThrow(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));
    }

    /**
     * Validates that the status is one of the allowed values.
     */
    private void validateStatus(String status) {
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
        String trimmed = status.trim();
        if (!trimmed.equals("Active") && !trimmed.equals("Inactive") && !trimmed.equals("Under Maintenance")) {
            throw new IllegalArgumentException(
                    "Invalid status: '" + status + "'. Must be one of: Active, Inactive, Under Maintenance"
            );
        }
    }
}
