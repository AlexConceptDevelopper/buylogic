package com.buylogic.mapper;

import org.springframework.stereotype.Component;

import com.buylogic.dto.NotificationDTO;
import com.buylogic.model.Notification;
import com.buylogic.model.PurchaseRecommendation;

@Component
public class NotificationMapper {

    public NotificationDTO toDTO(Notification notification) {

        if (notification == null) {
            return null;
        }

        NotificationDTO dto = new NotificationDTO();

        dto.setIdNotification(
                notification.getIdNotification());

        dto.setIdUser(
                notification.getUser() != null
                        ? notification.getUser().getIdUser()
                        : null);

        dto.setType(
                notification.getType());

        dto.setTitle(
                notification.getTitle());

        dto.setMessage(
                notification.getMessage());

        dto.setReadAt(
                notification.getReadAt());

        dto.setCreatedAt(
                notification.getCreatedAt());

        PurchaseRecommendation recommendation = notification.getRecommendation();

        if (recommendation != null) {

            dto.setIdRecommendation(
                    recommendation.getIdRecommendation());

            if (recommendation.getProduct() != null) {

                dto.setIdProduct(
                        recommendation
                                .getProduct()
                                .getIdProduct());

                dto.setProductReference(
                        recommendation
                                .getProduct()
                                .getReference());

                dto.setProductName(
                        recommendation
                                .getProduct()
                                .getName());
            }
        }

        return dto;
    }
}