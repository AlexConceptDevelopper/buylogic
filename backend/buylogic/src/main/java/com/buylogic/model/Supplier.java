package com.buylogic.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "supplier")
@Getter
@Setter
@NoArgsConstructor
public class Supplier {

    public Supplier(Integer idSupplier, Company company, String name, String email, String phone, String address, Boolean active, LocalDateTime createdAt, LocalDateTime updatedAt, List<SupplierProduct> supplierProducts, List<PurchaseOrder> purchaseOrders) {
        this.idSupplier = idSupplier;
        this.company = company;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.supplierProducts = supplierProducts;
        this.purchaseOrders = purchaseOrders;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSupplier;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_company", nullable = false)
    private Company company;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 255)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(length = 500)
    private String address;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SupplierProduct> supplierProducts;

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseOrder> purchaseOrders;

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