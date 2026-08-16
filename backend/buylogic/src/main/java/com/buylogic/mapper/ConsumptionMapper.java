package com.buylogic.mapper;

import org.springframework.stereotype.Component;

import com.buylogic.dto.consumption.ConsumptionCreateDTO;
import com.buylogic.dto.consumption.ConsumptionDTO;
import com.buylogic.model.Consumption;
import com.buylogic.model.Product;

@Component
public class ConsumptionMapper {

    public ConsumptionDTO toDTO(Consumption consumption) {
        if (consumption == null) {
            return null;
        }

        ConsumptionDTO dto = new ConsumptionDTO();

        dto.setIdConsumption(consumption.getIdConsumption());

        dto.setIdProduct(
            consumption.getProduct() != null
                ? consumption.getProduct().getIdProduct()
                : null
        );

        dto.setQuantity(consumption.getQuantity());
        dto.setConsumptionDate(consumption.getConsumptionDate());
        dto.setSource(consumption.getSource());
        dto.setCreatedAt(consumption.getCreatedAt());

        return dto;
    }

    public Consumption toEntity(
            ConsumptionCreateDTO dto,
            Product product) {

        if (dto == null) {
            return null;
        }

        Consumption consumption = new Consumption();

        consumption.setProduct(product);
        consumption.setQuantity(dto.getQuantity());
        consumption.setConsumptionDate(dto.getConsumptionDate());

        consumption.setSource(
            dto.getSource() != null
                && !dto.getSource().isBlank()
                ? dto.getSource().toUpperCase()
                : "MANUAL"
        );

        return consumption;
    }
}