package com.equipmentmgmt.repository;

import com.equipmentmgmt.model.Equipment;
import com.equipmentmgmt.model.EquipmentType;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

/**
 * Reusable JPA Specifications for filtering Equipment queries.
 */
public final class EquipmentSpecifications {

    private EquipmentSpecifications() {
    }

    /**
     * Filter by exact status match.
     */
    public static Specification<Equipment> hasStatus(String status) {
        return (root, query, cb) ->
                cb.equal(root.get("status"), status.trim());
    }

    /**
     * Case-insensitive LIKE search across equipment name and type name.
     */
    public static Specification<Equipment> searchByKeyword(String keyword) {
        return (root, query, cb) -> {
            String pattern = "%" + keyword.trim().toLowerCase() + "%";
            Join<Equipment, EquipmentType> typeJoin = root.join("equipmentType");
            return cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(typeJoin.get("name")), pattern)
            );
        };
    }
}
