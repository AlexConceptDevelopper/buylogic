package com.buylogic.mapper;

import org.springframework.stereotype.Component;

import com.buylogic.dto.appuser.AppUserDTO;
import com.buylogic.model.AppUser;

@Component
public class AppUserMapper {

    public AppUserDTO toDTO(AppUser user) {
        if (user == null) {
            return null;
        }

        AppUserDTO dto = new AppUserDTO();

        dto.setIdUser(user.getIdUser());

        dto.setIdCompany(
                user.getCompany() != null
                        ? user.getCompany().getIdCompany()
                        : null);

        dto.setCompanyName(
                user.getCompany() != null
                        ? user.getCompany().getName()
                        : null);

        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());

        dto.setRole(
                user.getRole() != null
                        ? user.getRole().name()
                        : null);

        dto.setActive(user.getActive());

        return dto;
    }
}