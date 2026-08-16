package com.buylogic.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "consumption")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Consumption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idConsumption;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_product", nullable = false)
    private Product product;

    @Column(nullable = false, precision = 14, scale = 3)
    private BigDecimal quantity;

    @Column(name = "consumption_date", nullable = false)
    private LocalDate consumptionDate;

    @Column(nullable = false, length = 30)
    private String source = "IMPORT";

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (consumptionDate == null) {
            consumptionDate = LocalDate.now();
        }

        createdAt = LocalDateTime.now();
    }
}
