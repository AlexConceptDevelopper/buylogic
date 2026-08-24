package com.buylogic.mapper;

import org.springframework.stereotype.Component;

import com.buylogic.dto.ProductionRecommendationDTO;
import com.buylogic.model.ProductionRecommendation;

@Component
public class ProductionRecommendationMapper {

    public ProductionRecommendationDTO toDTO(
            ProductionRecommendation recommendation) {

        if (recommendation == null) {
            return null;
        }

        ProductionRecommendationDTO dto = new ProductionRecommendationDTO();

        dto.setIdProductionRecommendation(
                recommendation.getIdProductionRecommendation());

        dto.setIdCompany(
                recommendation.getCompany() != null
                        ? recommendation.getCompany().getIdCompany()
                        : null);

        dto.setIdProduct(
                recommendation.getProduct() != null
                        ? recommendation.getProduct().getIdProduct()
                        : null);

        dto.setProductReference(
                recommendation.getProduct() != null
                        ? recommendation.getProduct().getReference()
                        : null);

        dto.setProductName(
                recommendation.getProduct() != null
                        ? recommendation.getProduct().getName()
                        : null);

        dto.setStatus(
                recommendation.getStatus());

        dto.setRecommendedQuantity(
                recommendation.getRecommendedQuantity());

        dto.setCurrentStock(
                recommendation.getCurrentStock());

        dto.setSafetyStock(
                recommendation.getSafetyStock());

        dto.setEstimatedDailyConsumption(
                recommendation.getEstimatedDailyConsumption());

        dto.setEstimatedStockoutDate(
                recommendation.getEstimatedStockoutDate());

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