package com.equipmentmgmt.service;

import com.equipmentmgmt.dto.MaintenanceRecordResponse;
import com.equipmentmgmt.dto.MaintenanceRequest;
import com.equipmentmgmt.model.Equipment;
import com.equipmentmgmt.model.MaintenanceRecord;
import com.equipmentmgmt.repository.EquipmentRepository;
import com.equipmentmgmt.repository.MaintenanceRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final EquipmentRepository equipmentRepository;
    private final EquipmentService equipmentService;

    public MaintenanceService(
            MaintenanceRecordRepository maintenanceRecordRepository,
            EquipmentRepository equipmentRepository,
            EquipmentService equipmentService
    ) {
        this.maintenanceRecordRepository = maintenanceRecordRepository;
        this.equipmentRepository = equipmentRepository;
        this.equipmentService = equipmentService;
    }

    /**
     * Logs a new maintenance event.
     *
     * Business Rules:
     * 1. Equipment status is automatically set to Active
     * 2. Equipment lastCleanedDate is updated to the maintenance date
     * 3. The maintenance record is persisted
     */
    @Transactional
    public MaintenanceRecordResponse logMaintenance(MaintenanceRequest request) {
        Equipment equipment = equipmentService.findEquipmentOrThrow(request.getEquipmentId());

        // Create and save maintenance record
        MaintenanceRecord record = new MaintenanceRecord(
                equipment,
                request.getDate(),
                request.getNotes().trim(),
                request.getPerformedBy().trim()
        );
        MaintenanceRecord saved = maintenanceRecordRepository.save(record);

        // Business rule: set status to Active and update lastCleanedDate
        // Validate the 30-day rule before setting Active
        equipmentService.validateActiveStatusCleanedDate("Active", request.getDate());
        equipment.setStatus("Active");
        equipment.setLastCleanedDate(request.getDate());
        equipmentRepository.save(equipment);

        return MaintenanceRecordResponse.fromEntity(saved);
    }

    /**
     * Returns all maintenance records for a given equipment, ordered by date descending.
     */
    @Transactional(readOnly = true)
    public List<MaintenanceRecordResponse> getMaintenanceHistory(Long equipmentId) {
        // Verify the equipment exists
        equipmentService.findEquipmentOrThrow(equipmentId);

        return maintenanceRecordRepository.findByEquipmentIdOrderByDateDesc(equipmentId)
                .stream()
                .map(MaintenanceRecordResponse::fromEntity)
                .toList();
    }
}
