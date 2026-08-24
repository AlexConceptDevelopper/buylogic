package com.buylogic.repository.global;

import java.util.List;
import java.util.Optional;

import com.buylogic.model.Product;
import com.buylogic.model.PurchaseRecommendation;
import com.buylogic.repository.GenericRepository;

public interface PurchaseRecommendationRepository
        extends GenericRepository<PurchaseRecommendation, Integer> {

    List<PurchaseRecommendation> findAllByCompany_IdCompany(
            Integer companyId);

    Optional<PurchaseRecommendation> findByIdRecommendationAndCompany_IdCompany(
            Integer idRecommendation,
            Integer companyId);

    Optional<PurchaseRecommendation> findByProduct_IdProductAndCompany_IdCompany(Integer productId, Integer companyId);

    List<PurchaseRecommendation> findByCompany_IdCompanyAndProductInAndStatus(
            Integer companyId,
            List<Product> products,
            String status);
}