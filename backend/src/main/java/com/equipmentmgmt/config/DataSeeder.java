package com.equipmentmgmt.config;

import com.equipmentmgmt.model.Equipment;
import com.equipmentmgmt.model.EquipmentStatus;
import com.equipmentmgmt.model.MaintenanceRecord;
import com.equipmentmgmt.repository.EquipmentRepository;
import com.equipmentmgmt.repository.MaintenanceRecordRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDatabase(EquipmentRepository equipmentRepo, MaintenanceRecordRepository maintenanceRepo) {
        return args -> {
            if (equipmentRepo.count() > 0) {
                return; // Don't seed if data already exists
            }

            // --- Equipment ---
            Equipment centrifuge = new Equipment("Centrifuge Alpha", "Centrifuge", EquipmentStatus.Active, LocalDate.of(2026, 2, 25));
            Equipment microscope = new Equipment("Microscope Beta", "Microscope", EquipmentStatus.Under_Maintenance, LocalDate.of(2026, 2, 18));
            Equipment autoclave = new Equipment("Autoclave Gamma", "Autoclave", EquipmentStatus.Active, LocalDate.of(2026, 2, 27));
            Equipment spectro = new Equipment("Spectro Delta", "Spectrophotometer", EquipmentStatus.Inactive, LocalDate.of(2026, 1, 30));
            Equipment incubator = new Equipment("Incubator Epsilon", "Incubator", EquipmentStatus.Active, LocalDate.of(2026, 2, 26));

            equipmentRepo.save(centrifuge);
            equipmentRepo.save(microscope);
            equipmentRepo.save(autoclave);
            equipmentRepo.save(spectro);
            equipmentRepo.save(incubator);

            // --- Maintenance Records ---
            maintenanceRepo.save(new MaintenanceRecord(centrifuge, LocalDate.of(2026, 2, 20), "Routine calibration and rotor inspection", "Dr. Smith"));
            maintenanceRepo.save(new MaintenanceRecord(centrifuge, LocalDate.of(2026, 1, 15), "Replaced bearing assembly", "Tech. Johnson"));

            maintenanceRepo.save(new MaintenanceRecord(microscope, LocalDate.of(2026, 2, 18), "Lens realignment and cleaning", "Tech. Davis"));

            maintenanceRepo.save(new MaintenanceRecord(autoclave, LocalDate.of(2026, 2, 10), "Pressure valve replacement", "Eng. Williams"));
            maintenanceRepo.save(new MaintenanceRecord(autoclave, LocalDate.of(2026, 1, 5), "Annual safety inspection", "Safety Team"));
            maintenanceRepo.save(new MaintenanceRecord(autoclave, LocalDate.of(2025, 12, 1), "Gasket replacement and seal test", "Tech. Johnson"));

            maintenanceRepo.save(new MaintenanceRecord(incubator, LocalDate.of(2026, 2, 15), "Temperature sensor recalibration", "Tech. Davis"));
        };
    }
}
