package com.buylogic.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "subscription")
@Getter
@Setter
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSubscription;

    @OneToOne(optional = false)
    @JoinColumn(
        name = "idCompany",
        nullable = false,
        unique = true
    )
    private Company company;

    @Column(nullable = false, length = 50)
    private String plan = "PRO";

    @Column(nullable = false, length = 30)
    private String status = "TRIAL";

    @Column(nullable = false)
    private LocalDateTime trialStart;

    @Column(nullable = false)
    private LocalDateTime trialEnd;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        if (trialStart == null) {
            trialStart = now;
        }

        if (trialEnd == null) {
            trialEnd = trialStart.plusDays(30);
        }

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}