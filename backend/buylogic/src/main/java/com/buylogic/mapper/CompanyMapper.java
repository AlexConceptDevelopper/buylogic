package com.buylogic.mapper;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Component;

import com.buylogic.dto.company.CompanyCreateDTO;
import com.buylogic.dto.company.CompanyDTO;
import com.buylogic.dto.company.CompanyUpdateDTO;
import com.buylogic.model.Company;
import com.buylogic.model.Subscription;
import com.buylogic.repository.global.SubscriptionRepository;

@Component
public class CompanyMapper {

    private final SubscriptionRepository subscriptionRepository;

    public CompanyMapper(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    public CompanyDTO toDTO(Company company) {
        if (company == null) {
            return null;
        }

        CompanyDTO dto = new CompanyDTO();

        dto.setIdCompany(company.getIdCompany());
        dto.setName(company.getName());
        dto.setEmail(company.getEmail());
        dto.setPhone(company.getPhone());
        dto.setActive(company.getActive());
        dto.setSiret(company.getSiret()); 
        dto.setAddress(company.getAddress()); 
        dto.setReceptionHours(company.getReceptionHours());
        dto.setLogoUrl(company.getLogoUrl()); 

        // Recherche de l'abonnement associé avec la bonne méthode du repository
       Subscription subscription = subscriptionRepository.findByCompany_IdCompany(company.getIdCompany()).orElse(null);

        if (subscription != null) {
            dto.setSubscriptionStatus(subscription.getStatus()); // <-- Transmet le status au DTO

            if (subscription.getTrialEnd() != null) {
                long remaining = ChronoUnit.DAYS.between(LocalDateTime.now(), subscription.getTrialEnd());
                remaining = Math.max(0, remaining);
                
                dto.setRemainingTrialDays(remaining);
                dto.setTrialExpired(remaining == 0 || "EXPIRED".equalsIgnoreCase(subscription.getStatus()));
            } else {
                dto.setRemainingTrialDays(0L);
                dto.setTrialExpired(true);
            }
        } else {
            dto.setSubscriptionStatus("TRIAL"); // Valeur par défaut si aucun abonnement trouvé
            dto.setRemainingTrialDays(0L);
            dto.setTrialExpired(true);
        }
        return dto;
    }

    public Company toEntity(CompanyCreateDTO dto) {
        if (dto == null) {
            return null;
        }

        Company company = new Company();
        company.setName(dto.getName());
        company.setEmail(dto.getEmail());
        company.setPhone(dto.getPhone());
        company.setActive(true);
        company.setSiret(dto.getSiret()); 
        company.setAddress(dto.getAddress()); 
        company.setReceptionHours(dto.getReceptionHours()); 
        company.setLogoUrl(dto.getLogoUrl()); 

        return company;
    }

    public void updateEntity(Company company, CompanyUpdateDTO dto) {
        company.setName(dto.getName());
        company.setEmail(dto.getEmail());
        company.setPhone(dto.getPhone()); 
        company.setSiret(dto.getSiret()); 
        company.setAddress(dto.getAddress()); 
        company.setReceptionHours(dto.getReceptionHours()); 
        company.setLogoUrl(dto.getLogoUrl());
    }
}