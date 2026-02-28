package com.equipmentmgmt.service;

import com.equipmentmgmt.dto.EquipmentRequest;
import com.equipmentmgmt.dto.EquipmentResponse;
import com.equipmentmgmt.exception.ResourceNotFoundException;
import com.equipmentmgmt.model.Equipment;
import com.equipmentmgmt.model.EquipmentStatus;
import com.equipmentmgmt.repository.EquipmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;

    public EquipmentService(EquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
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
        EquipmentStatus status = EquipmentStatus.fromDisplayString(request.getStatus());

        Equipment equipment = new Equipment(
                request.getName().trim(),
                request.getType().trim(),
                status,
                request.getLastCleanedDate()
        );

        Equipment saved = equipmentRepository.save(equipment);
        return EquipmentResponse.fromEntity(saved);
    }

    @Transactional
    public EquipmentResponse updateEquipment(Long id, EquipmentRequest request) {
        Equipment equipment = findEquipmentOrThrow(id);
        EquipmentStatus status = EquipmentStatus.fromDisplayString(request.getStatus());

        equipment.setName(request.getName().trim());
        equipment.setType(request.getType().trim());
        equipment.setStatus(status);
        equipment.setLastCleanedDate(request.getLastCleanedDate());

        Equipment saved = equipmentRepository.save(equipment);
        return EquipmentResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteEquipment(Long id) {
        Equipment equipment = findEquipmentOrThrow(id);
        equipmentRepository.delete(equipment);
    }

    @Transactional(readOnly = true)
    public List<String> getDistinctTypes() {
        return equipmentRepository.findDistinctTypes();
    }

    /**
     * Package-private helper so MaintenanceService can also look up equipment.
     */
    Equipment findEquipmentOrThrow(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + id));
    }
}
