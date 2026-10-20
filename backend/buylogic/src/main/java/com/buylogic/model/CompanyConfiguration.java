package com.buylogic.model;

import java.time.LocalDateTime;

import com.buylogic.model.enums.ProductManagementMode;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "company_configuration")
@Getter
@Setter
@NoArgsConstructor
public class CompanyConfiguration {

    public CompanyConfiguration(Integer idCompanyConfiguration, Company company, ProductManagementMode productManagementMode, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.idCompanyConfiguration = idCompanyConfiguration;
        this.company = company;
        this.productManagementMode = productManagementMode;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCompanyConfiguration;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "id_company",
        nullable = false,
        unique = true
    )
    private Company company;

    @Enumerated(EnumType.STRING)
    @Column(
        nullable = false,
        length = 30
    )
    private ProductManagementMode productManagementMode;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}