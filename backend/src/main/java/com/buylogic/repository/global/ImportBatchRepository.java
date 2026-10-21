package com.buylogic.repository.global;

import java.util.Optional;

import com.buylogic.model.ImportBatch;
import com.buylogic.repository.GenericRepository;

public interface ImportBatchRepository
        extends GenericRepository<ImportBatch, Integer> {

    Optional<ImportBatch> findByIdCompanyAndFileHash(
            Integer idCompany,
            String fileHash
    );
}