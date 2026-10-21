package com.buylogic.repository.global;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.buylogic.model.PurchaseOrder;
import com.buylogic.repository.GenericRepository;

public interface PurchaseOrderRepository
        extends GenericRepository<PurchaseOrder, Integer> {

    List<PurchaseOrder> findAllByCompany_IdCompany(Integer companyId);

    Optional<PurchaseOrder> findByIdPurchaseOrderAndCompany_IdCompany(
            Integer idPurchaseOrder,
            Integer companyId
    );

    void deleteByIdPurchaseOrderAndCompany_IdCompany(
            Integer idPurchaseOrder,
            Integer companyId
    );

    @Query("SELECT po FROM PurchaseOrder po LEFT JOIN FETCH po.items WHERE po.idPurchaseOrder = :id AND po.company.idCompany = :companyId")
    Optional<PurchaseOrder> findByIdAndCompanyIdWithItems(@Param("id") Integer id, @Param("companyId") Integer companyId);
}