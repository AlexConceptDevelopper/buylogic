package com.buylogic.repository.global;

import java.util.List;
import java.util.Optional;

import com.buylogic.model.PurchaseRecommendation;
import com.buylogic.repository.GenericRepository;

public interface PurchaseRecommendationRepository
        extends GenericRepository<PurchaseRecommendation, Integer> {

    List<PurchaseRecommendation> findAllByCompany_IdCompany(
        Integer companyId
    );

    Optional<PurchaseRecommendation>
    findByIdRecommendationAndCompany_IdCompany(
        Integer idRecommendation,
        Integer companyId
    );
}