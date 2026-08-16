package com.buylogic.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "import_batch", uniqueConstraints = {
        @UniqueConstraint(name = "uk_import_batch_company_hash", columnNames = {
                "id_company",
                "file_hash"
        })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImportBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idImportBatch;

    @Column(name = "id_company", nullable = false)
    private Integer idCompany;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_hash", nullable = false, length = 64)
    private String fileHash;

    @Column(name = "imported_count", nullable = false)
    private Integer importedCount;

    @Column(name = "imported_at", nullable = false)
    private LocalDateTime importedAt;

    @PrePersist
    protected void onCreate() {
        if (importedAt == null) {
            importedAt = LocalDateTime.now();
        }
    }
}