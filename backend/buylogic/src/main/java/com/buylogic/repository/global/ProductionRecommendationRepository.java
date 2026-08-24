package com.buylogic.repository.global;

import java.util.List;
import java.util.Optional;

import com.buylogic.model.ProductionRecommendation;
import com.buylogic.repository.GenericRepository;

public interface ProductionRecommendationRepository
        extends GenericRepository<ProductionRecommendation, Integer> {

    List<ProductionRecommendation> findAllByCompany_IdCompany(Integer companyId);

    Optional<ProductionRecommendation> findByIdProductionRecommendationAndCompany_IdCompany(
            Integer idRecommendation,
            Integer companyId);

    Optional<ProductionRecommendation> findByProduct_IdProductAndCompany_IdCompany(
            Integer productId, 
            Integer companyId);
}