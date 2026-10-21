package com.buylogic.dto.company;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CompanyDTO {

    public CompanyDTO(Integer idCompany, String name, String email, String phone, Boolean active, Boolean onboardingCompleted, String siret, String address, String receptionHours, String logoUrl, Long remainingTrialDays, Boolean trialExpired, String subscriptionStatus, LocalDateTime currentPeriodEnd) {
        this.idCompany = idCompany;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.active = active;
        this.onboardingCompleted = onboardingCompleted;
        this.siret = siret;
        this.address = address;
        this.receptionHours = receptionHours;
        this.logoUrl = logoUrl;
        this.remainingTrialDays = remainingTrialDays;
        this.trialExpired = trialExpired;
        this.subscriptionStatus = subscriptionStatus;
        this.currentPeriodEnd = currentPeriodEnd;
    }

    private Integer idCompany;
    private String name;
    private String email;
    private String phone;
    private Boolean active;
    private Boolean onboardingCompleted;
    private String siret;
    private String address;
    private String receptionHours;
    private String logoUrl;

    private Long remainingTrialDays;
    private Boolean trialExpired;
    private String subscriptionStatus;

    private LocalDateTime currentPeriodEnd;
}