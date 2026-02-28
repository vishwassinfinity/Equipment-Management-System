package com.equipmentmgmt.repository;

import com.equipmentmgmt.model.EquipmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentTypeRepository extends JpaRepository<EquipmentType, Integer> {

    @Query("SELECT et FROM EquipmentType et ORDER BY et.name")
    List<EquipmentType> findAllOrderByName();

    @Query("SELECT et FROM EquipmentType et WHERE et.name = :name")
    Optional<EquipmentType> findByName(String name);
}
