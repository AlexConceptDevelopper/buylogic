package com.buylogic.repository.global;

import java.util.List;
import java.util.Optional;

import com.buylogic.model.Supplier;
import com.buylogic.repository.GenericRepository;

public interface SupplierRepository
        extends GenericRepository<Supplier, Integer> {

    List<Supplier> findAllByCompany_IdCompany(
        Integer idCompany
    );

    Optional<Supplier> findByIdSupplierAndCompany_IdCompany(
        Integer idSupplier,
        Integer idCompany
    );

    boolean existsByCompanyIdCompanyAndName(
        Integer idCompany,
        String name
    );

    Optional<Supplier> findByCompanyIdCompanyAndName(
        Integer idCompany,
        String name
    );
}