package com.buylogic.repository.global;

import java.util.Optional;

import com.buylogic.model.SuperAdmin;
import com.buylogic.repository.GenericRepository;

public interface SuperAdminRepository extends GenericRepository<SuperAdmin, Integer> {

    boolean existsByEmail(String email);

    Optional<SuperAdmin> findByEmail(String email);
}