package com.buylogic.repository.global;

import java.util.Optional;

import com.buylogic.model.Company;
import com.buylogic.repository.GenericRepository;

public interface CompanyRepository extends GenericRepository<Company, Integer> {

    Optional<Company> findByEmail(String email);

    boolean existsByEmail(String email);
}