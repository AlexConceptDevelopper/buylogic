package com.buylogic.repository.global;

import java.util.List;
import java.util.Optional;

import com.buylogic.model.PurchaseOrder;
import com.buylogic.repository.GenericRepository;

public interface PurchaseOrderRepository
        extends GenericRepository<PurchaseOrder, Integer> {

    List<PurchaseOrder> findAllByCompany_IdCompany(Integer companyId);

    Optional<PurchaseOrder> findByIdPurchaseOrderAndCompany_IdCompany(
            Integer idPurchaseOrder,
            Integer companyId
    );
}