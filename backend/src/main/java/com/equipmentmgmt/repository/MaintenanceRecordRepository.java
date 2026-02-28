package com.equipmentmgmt.repository;

import com.equipmentmgmt.model.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {

    @Query("SELECT m FROM MaintenanceRecord m WHERE m.equipment.id = :equipmentId ORDER BY m.maintenanceDate DESC")
    List<MaintenanceRecord> findByEquipmentIdOrderByDateDesc(@Param("equipmentId") Long equipmentId);
}
