package com.buylogic.mapper;

import org.springframework.stereotype.Component;

import com.buylogic.dto.PurchaseRecommendationDTO;
import com.buylogic.model.PurchaseRecommendation;

@Component
public class PurchaseRecommendationMapper {

    public PurchaseRecommendationDTO toDTO(
            PurchaseRecommendation recommendation) {

        if (recommendation == null) {
            return null;
        }

        PurchaseRecommendationDTO dto = new PurchaseRecommendationDTO();

        dto.setIdRecommendation(
                recommendation.getIdRecommendation());

        dto.setIdCompany(
                recommendation.getCompany() != null
                        ? recommendation.getCompany().getIdCompany()
                        : null);

        dto.setIdProduct(
                recommendation.getProduct() != null
                        ? recommendation.getProduct().getIdProduct()
                        : null);

        dto.setIdSupplier(
                recommendation.getSupplier() != null
                        ? recommendation.getSupplier().getIdSupplier()
                        : null);

        dto.setProductReference(
                recommendation.getProduct() != null
                        ? recommendation.getProduct().getReference()
                        : null);

        dto.setProductName(
                recommendation.getProduct() != null
                        ? recommendation.getProduct().getName()
                        : null);

        dto.setSupplierName(
                recommendation.getSupplier() != null
                        ? recommendation.getSupplier().getName()
                        : null);

        dto.setStatus(
                recommendation.getStatus());

        dto.setRecommendedQuantity(
                recommendation.getRecommendedQuantity());

        dto.setCurrentStock(
                recommendation.getCurrentStock());

        dto.setSafetyStock(
                recommendation.getSafetyStock());

        dto.setReorderPoint(
                recommendation.getReorderPoint());

        dto.setEstimatedDailyConsumption(
                recommendation.getEstimatedDailyConsumption());

        dto.setEstimatedLeadTimeDays(
                recommendation.getEstimatedLeadTimeDays());

        dto.setEstimatedStockoutDate(
                recommendation.getEstimatedStockoutDate());

        dto.setEstimatedPurchaseAmount(
                recommendation.getEstimatedPurchaseAmount());

        dto.setConfidenceScore(
                recommendation.getConfidenceScore());

        dto.setReason(
                recommendation.getReason());

        dto.setCreatedAt(
                recommendation.getCreatedAt());

        dto.setResolvedAt(
                recommendation.getResolvedAt());

        return dto;
    }
}