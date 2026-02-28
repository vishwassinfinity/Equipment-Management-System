package com.equipmentmgmt.service;

import com.equipmentmgmt.dto.EquipmentTypeResponse;
import com.equipmentmgmt.exception.ResourceNotFoundException;
import com.equipmentmgmt.model.EquipmentType;
import com.equipmentmgmt.repository.EquipmentTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class EquipmentTypeService {

    private final EquipmentTypeRepository equipmentTypeRepository;

    public EquipmentTypeService(EquipmentTypeRepository equipmentTypeRepository) {
        this.equipmentTypeRepository = equipmentTypeRepository;
    }

    @Transactional(readOnly = true)
    public List<EquipmentTypeResponse> getAllTypes() {
        return equipmentTypeRepository.findAllOrderByName()
                .stream()
                .map(EquipmentTypeResponse::fromEntity)
                .toList();
    }

    @Transactional
    public EquipmentTypeResponse createType(String name) {
        // Check for duplicate
        equipmentTypeRepository.findByName(name.trim())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Equipment type '" + name.trim() + "' already exists");
                });

        EquipmentType type = new EquipmentType(name.trim());
        EquipmentType saved = equipmentTypeRepository.save(type);
        return EquipmentTypeResponse.fromEntity(saved);
    }

    @Transactional
    public EquipmentTypeResponse updateType(Integer id, String name) {
        EquipmentType type = findTypeOrThrow(id);

        // Check for duplicate (excluding current)
        equipmentTypeRepository.findByName(name.trim())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new IllegalArgumentException("Equipment type '" + name.trim() + "' already exists");
                    }
                });

        type.setName(name.trim());
        EquipmentType saved = equipmentTypeRepository.save(type);
        return EquipmentTypeResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteType(Integer id) {
        EquipmentType type = findTypeOrThrow(id);
        equipmentTypeRepository.delete(type);
    }

    /**
     * Package-private helper so EquipmentService can look up types.
     */
    EquipmentType findTypeOrThrow(Integer id) {
        return equipmentTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment type not found with id: " + id));
    }
}
