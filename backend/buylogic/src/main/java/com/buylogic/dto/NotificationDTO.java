package com.buylogic.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

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