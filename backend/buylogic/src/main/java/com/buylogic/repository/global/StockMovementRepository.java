package com.buylogic.repository.global;

import java.util.List;
import java.util.Optional;

import com.buylogic.model.StockMovement;
import com.buylogic.repository.GenericRepository;

public interface StockMovementRepository
        extends GenericRepository<StockMovement, Integer> {

    List<StockMovement> findAllByProduct_Company_IdCompany(
        Integer companyId
    );

    Optional<StockMovement>
    findByIdStockMovementAndProduct_Company_IdCompany(
        Integer idStockMovement,
        Integer companyId
    );

    // Ajout de cette méthode pour vérifier si un produit a déjà un mouvement STOCK_INITIAL
    boolean existsByProduct_IdProductAndProduct_Company_IdCompanyAndReference(
        Integer idProduct,
        Integer companyId,
        String reference
    );
}