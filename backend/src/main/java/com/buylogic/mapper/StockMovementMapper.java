package com.buylogic.mapper;

import org.springframework.stereotype.Component;

import com.buylogic.dto.stockmouvement.StockMovementCreateDTO;
import com.buylogic.dto.stockmouvement.StockMovementDTO;
import com.buylogic.model.Product;
import com.buylogic.model.StockMovement;

@Component
public class StockMovementMapper {

    public StockMovementDTO toDTO(StockMovement movement) {

        if (movement == null) {
            return null;
        }

        StockMovementDTO dto = new StockMovementDTO();

        dto.setIdStockMovement(
            movement.getIdStockMovement()
        );

        dto.setIdProduct(
            movement.getProduct() != null
                ? movement.getProduct().getIdProduct()
                : null
        );

        dto.setMovementType(
            movement.getMovementType()
        );

        dto.setQuantity(
            movement.getQuantity()
        );

        dto.setMovementDate(
            movement.getMovementDate()
        );

        dto.setReference(
            movement.getReference()
        );

        dto.setCreatedAt(
            movement.getCreatedAt()
        );

        return dto;
    }

    public StockMovement toEntity(
            StockMovementCreateDTO dto,
            Product product) {

        if (dto == null) {
            return null;
        }

        StockMovement movement = new StockMovement();

        movement.setProduct(product);
        movement.setMovementType(
            dto.getMovementType().toUpperCase()
        );
        movement.setQuantity(
            dto.getQuantity()
        );
        movement.setMovementDate(
            dto.getMovementDate()
        );
        movement.setReference(
            dto.getReference()
        );

        return movement;
    }
}