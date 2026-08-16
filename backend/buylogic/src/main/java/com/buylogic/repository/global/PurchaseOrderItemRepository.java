package com.buylogic.repository.global;

import java.util.List;
import java.util.Optional;

import com.buylogic.model.PurchaseOrderItem;
import com.buylogic.repository.GenericRepository;

public interface PurchaseOrderItemRepository
                extends GenericRepository<PurchaseOrderItem, Integer> {

        List<PurchaseOrderItem> findAllByPurchaseOrder_Company_IdCompany(
                        Integer companyId);

        Optional<PurchaseOrderItem> findByIdPurchaseOrderItemAndPurchaseOrder_Company_IdCompany(
                        Integer idPurchaseOrderItem,
                        Integer companyId);

        List<PurchaseOrderItem> findAllByPurchaseOrder_IdPurchaseOrderAndPurchaseOrder_Company_IdCompany(
                        Integer idPurchaseOrder,
                        Integer companyId);
}