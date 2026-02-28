package com.equipmentmgmt.service;

import com.equipmentmgmt.dto.EquipmentRequest;
import com.equipmentmgmt.dto.EquipmentResponse;
import com.equipmentmgmt.dto.PageResponse;
import com.equipmentmgmt.exception.ResourceNotFoundException;
import com.equipmentmgmt.model.Equipment;
import com.equipmentmgmt.model.EquipmentType;
import com.equipmentmgmt.repository.EquipmentRepository;
import com.equipmentmgmt.repository.EquipmentSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

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

    /**
     * Paginated, filterable, searchable, sortable query.
     *
     * @param status  optional status filter (exact match)
     * @param search  optional keyword (matches name or type name, case-insensitive)
     * @param page    zero-based page number
     * @param size    page size
     * @param sortBy  field to sort by (name, status, typeName, lastCleanedDate)
     * @param sortDir asc or desc
     */
    @Transactional(readOnly = true)
    public PageResponse<EquipmentResponse> getEquipmentPage(
            String status, String search,
            int page, int size,
            String sortBy, String sortDir
    ) {
        // Map frontend field names to JPA paths
        String sortField = mapSortField(sortBy);

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        // Build dynamic specification
        Specification<Equipment> spec = Specification.where(null);

        if (status != null && !status.isBlank()) {
            spec = spec.and(EquipmentSpecifications.hasStatus(status));
        }
        if (search != null && !search.isBlank()) {
            spec = spec.and(EquipmentSpecifications.searchByKeyword(search));
        }

        Page<Equipment> result = equipmentRepository.findAll(spec, pageable);

        List<EquipmentResponse> content = result.getContent()
                .stream()
                .map(EquipmentResponse::fromEntity)
                .toList();

        return new PageResponse<>(
                content,
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    /**
     * Maps frontend column names to actual JPA entity paths.
     */
    private String mapSortField(String field) {
        if (field == null || field.isBlank()) {
            return "name";
        }
        // Allow only known fields to prevent injection
        Set<String> allowed = Set.of("name", "status", "lastCleanedDate", "typeName", "id");
        String trimmed = field.trim();
        if (trimmed.equals("typeName")) {
            return "equipmentType.name";
        }
        if (allowed.contains(trimmed)) {
            return trimmed;
        }
        return "name"; // safe default
    }

    @Transactional(readOnly = true)
    public EquipmentResponse getEquipmentById(Long id) {
        Equipment equipment = findEquipmentOrThrow(id);
        return EquipmentResponse.fromEntity(equipment);
    }

    @Transactional
    public EquipmentResponse createEquipment(EquipmentRequest request) {
        validateStatus(request.getStatus());
        validateActiveStatusCleanedDate(request.getStatus(), request.getLastCleanedDate());
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
        validateActiveStatusCleanedDate(request.getStatus(), request.getLastCleanedDate());
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
     * Equipment cannot be marked as "Active" if the Last Cleaned Date is older than 30 days.
     */
    void validateActiveStatusCleanedDate(String status, LocalDate lastCleanedDate) {
        if (status != null && status.trim().equals("Active") && lastCleanedDate != null) {
            long daysSinceCleaned = ChronoUnit.DAYS.between(lastCleanedDate, LocalDate.now());
            if (daysSinceCleaned > 30) {
                throw new IllegalArgumentException(
                        "Equipment cannot be marked as Active because the Last Cleaned Date is more than 30 days ago (" + daysSinceCleaned + " days). Please perform maintenance first."
                );
            }
        }
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
