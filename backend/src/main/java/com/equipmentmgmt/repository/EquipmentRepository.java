package com.equipmentmgmt.repository;

import com.equipmentmgmt.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    @Query("SELECT DISTINCT e.type FROM Equipment e ORDER BY e.type")
    List<String> findDistinctTypes();
}
