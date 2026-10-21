package com.buylogic.repository.global;

import java.util.List;
import java.util.Optional;

import com.buylogic.model.Product;
import com.buylogic.repository.GenericRepository;

public interface ProductRepository extends GenericRepository<Product, Integer> {

    List<Product> findAllByCompany_IdCompany(
            Integer idCompany);

    Optional<Product> findByIdProductAndCompany_IdCompany(
            Integer idProduct,
            Integer idCompany);

    Optional<Product> findByCompanyIdCompanyAndReference(
            Integer idCompany,
            String reference);

    boolean existsByCompanyIdCompanyAndReference(
            Integer idCompany,
            String reference);

    Optional<Product> findByReferenceAndCompany_IdCompany(
            String reference,
            Integer companyId);
}