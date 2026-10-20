package com.buylogic.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "notification")
@Getter
@Setter
@NoArgsConstructor
public class Notification {

    public Notification(Integer idNotification, AppUser user, String type, String title, String message, PurchaseRecommendation recommendation, LocalDateTime readAt, LocalDateTime createdAt) {
        this.idNotification = idNotification;
        this.user = user;
        this.type = type;
        this.title = title;
        this.message = message;
        this.recommendation = recommendation;
        this.readAt = readAt;
        this.createdAt = createdAt;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idNotification;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_user", nullable = false)
    private AppUser user;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_recommendation")
    private PurchaseRecommendation recommendation;

    private LocalDateTime readAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
