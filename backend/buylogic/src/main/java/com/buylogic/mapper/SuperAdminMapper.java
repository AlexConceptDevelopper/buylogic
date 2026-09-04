package com.buylogic.mapper;

import org.springframework.stereotype.Component;

import com.buylogic.dto.superadmin.SuperAdminDTO;
import com.buylogic.model.SuperAdmin;

@Component
public class SuperAdminMapper {

    public SuperAdminDTO toDTO(SuperAdmin superAdmin) {
        if (superAdmin == null) {
            return null;
        }

        SuperAdminDTO dto = new SuperAdminDTO();

        dto.setIdSuperAdmin(superAdmin.getIdSuperAdmin());
        dto.setEmail(superAdmin.getEmail());
        dto.setFirstName(superAdmin.getFirstName());
        dto.setLastName(superAdmin.getLastName());
        dto.setActive(superAdmin.getActive());

        return dto;
    }
}