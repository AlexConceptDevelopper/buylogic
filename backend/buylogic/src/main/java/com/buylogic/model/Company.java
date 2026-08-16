package com.buylogic.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "company")
@Getter
@Setter
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCompany;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 255)
    private String email;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "company")
    private List<AppUser> users;

    @OneToMany(mappedBy = "company")
    private List<Product> products;

    @OneToMany(mappedBy = "company")
    private List<Supplier> suppliers;

    @OneToOne(mappedBy = "company")
    private Subscription subscription;

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