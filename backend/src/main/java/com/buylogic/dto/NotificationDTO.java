package com.buylogic.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NotificationDTO {

    public NotificationDTO(Integer idNotification, Integer idUser, Integer idRecommendation, Integer idProduct, String productReference, String productName, String type, String title, String message, LocalDateTime readAt, LocalDateTime createdAt) {
        this.idNotification = idNotification;
        this.idUser = idUser;
        this.idRecommendation = idRecommendation;
        this.idProduct = idProduct;
        this.productReference = productReference;
        this.productName = productName;
        this.type = type;
        this.title = title;
        this.message = message;
        this.readAt = readAt;
        this.createdAt = createdAt;
    }

    private Integer idNotification;
    private Integer idUser;

    private Integer idRecommendation;

    private Integer idProduct;
    private String productReference;
    private String productName;

    private String type;
    private String title;
    private String message;

    private LocalDateTime readAt;
    private LocalDateTime createdAt;
}