package com.buylogic.repository.global;

import java.util.Optional;

import com.buylogic.model.CompanyConfiguration;
import com.buylogic.repository.GenericRepository;

public interface CompanyConfigurationRepository
        extends GenericRepository<CompanyConfiguration, Integer> {

    Optional<CompanyConfiguration> findByCompany_IdCompany(
            Integer companyId);
}