package com.buylogic.repository.global;

import java.util.List;
import java.util.Optional;

import com.buylogic.model.AppUser;
import com.buylogic.repository.GenericRepository;

public interface AppUserRepository
        extends GenericRepository<AppUser, Integer> {

    boolean existsByEmail(String email);

    Optional<AppUser> findByEmail(String email);

    List<AppUser> findAllByCompany_IdCompany(
        Integer companyId
    );

    Optional<AppUser>
    findByIdUserAndCompany_IdCompany(
        Integer idUser,
        Integer companyId
    );

    //reset password token
    Optional<AppUser> findByResetToken(String resetToken);
}