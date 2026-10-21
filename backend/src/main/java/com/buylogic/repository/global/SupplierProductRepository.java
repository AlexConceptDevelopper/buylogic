package com.buylogic.repository.global;

import java.util.List;
import java.util.Optional;

import com.buylogic.model.SupplierProduct;
import com.buylogic.repository.GenericRepository;

public interface SupplierProductRepository
        extends GenericRepository<SupplierProduct, Integer> {

    List<SupplierProduct> findAllByProduct_Company_IdCompany(
            Integer companyId
    );

    Optional<SupplierProduct>
    findByIdSupplierProductAndProduct_Company_IdCompany(
            Integer idSupplierProduct,
            Integer companyId
    );

    boolean existsByProductIdProductAndSupplierIdSupplier(
            Integer idProduct,
            Integer idSupplier
    );

    Optional<SupplierProduct>
    findByProductIdProductAndSupplierIdSupplier(
            Integer idProduct,
            Integer idSupplier
    );
}