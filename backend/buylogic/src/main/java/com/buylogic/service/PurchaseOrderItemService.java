package com.buylogic.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.purchaseorder.PurchaseOrderItemCreate;
import com.buylogic.dto.PurchaseOrderItemDTO;
import com.buylogic.dto.purchaseorder.PurchaseOrderItemUpdate;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.PurchaseOrderItemMapper;
import com.buylogic.model.Product;
import com.buylogic.model.PurchaseOrder;
import com.buylogic.model.PurchaseOrderItem;
import com.buylogic.repository.global.ProductRepository;
import com.buylogic.repository.global.PurchaseOrderItemRepository;
import com.buylogic.repository.global.PurchaseOrderRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PurchaseOrderItemService {

    private final PurchaseOrderItemRepository purchaseOrderItemRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;
    private final PurchaseOrderItemMapper purchaseOrderItemMapper;

    public List<PurchaseOrderItemDTO> getAll() {
        Integer companyId = getCurrentCompanyId();

        return purchaseOrderItemRepository
                .findAllByPurchaseOrder_Company_IdCompany(companyId)
                .stream()
                .map(purchaseOrderItemMapper::toDTO)
                .toList();
    }

    public List<PurchaseOrderItemDTO> getByPurchaseOrderId(
            Integer idPurchaseOrder
    ) {
        Integer companyId = getCurrentCompanyId();

        verifyPurchaseOrder(idPurchaseOrder, companyId);

        return purchaseOrderItemRepository
                .findAllByPurchaseOrder_IdPurchaseOrderAndPurchaseOrder_Company_IdCompany(
                        idPurchaseOrder,
                        companyId
                )
                .stream()
                .map(purchaseOrderItemMapper::toDTO)
                .toList();
    }

    public PurchaseOrderItemDTO getById(Integer id) {
        Integer companyId = getCurrentCompanyId();

        PurchaseOrderItem item =
                purchaseOrderItemRepository
                        .findByIdPurchaseOrderItemAndPurchaseOrder_Company_IdCompany(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase order item not found with id: "
                                                + id
                                )
                        );

        return purchaseOrderItemMapper.toDTO(item);
    }

    @Transactional
    public PurchaseOrderItemDTO create(
            PurchaseOrderItemCreate data
    ) {
        Integer companyId = getCurrentCompanyId();

        PurchaseOrder order = verifyPurchaseOrder(
                data.getIdPurchaseOrder(),
                companyId
        );

        Product product =
                productRepository
                        .findByIdProductAndCompany_IdCompany(
                                data.getIdProduct(),
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found with id: "
                                                + data.getIdProduct()
                                )
                        );

        PurchaseOrderItem item =
                new PurchaseOrderItem();

        item.setPurchaseOrder(order);
        item.setProduct(product);
        item.setQuantityOrdered(
                data.getQuantityOrdered()
        );
        item.setQuantityReceived(
                data.getQuantityReceived() != null
                        ? data.getQuantityReceived()
                        : BigDecimal.ZERO
        );
        item.setUnitPrice(data.getUnitPrice());

        PurchaseOrderItem savedItem =
                purchaseOrderItemRepository.save(item);

        recalculateOrderTotal(
                order.getIdPurchaseOrder(),
                companyId
        );

        return purchaseOrderItemMapper.toDTO(savedItem);
    }

    @Transactional
    public PurchaseOrderItemDTO update(
            Integer id,
            PurchaseOrderItemUpdate data
    ) {
        Integer companyId = getCurrentCompanyId();

        PurchaseOrderItem item =
                purchaseOrderItemRepository
                        .findByIdPurchaseOrderItemAndPurchaseOrder_Company_IdCompany(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase order item not found with id: "
                                                + id
                                )
                        );

        if (data.getQuantityOrdered() != null) {
            item.setQuantityOrdered(
                    data.getQuantityOrdered()
            );
        }

        if (data.getQuantityReceived() != null) {
            item.setQuantityReceived(
                    data.getQuantityReceived()
            );
        }

        if (data.getUnitPrice() != null) {
            item.setUnitPrice(data.getUnitPrice());
        }

        PurchaseOrderItem savedItem =
                purchaseOrderItemRepository.save(item);

        recalculateOrderTotal(
                item.getPurchaseOrder().getIdPurchaseOrder(),
                companyId
        );

        return purchaseOrderItemMapper.toDTO(savedItem);
    }

    @Transactional
    public void delete(Integer id) {
        Integer companyId = getCurrentCompanyId();

        PurchaseOrderItem item =
                purchaseOrderItemRepository
                        .findByIdPurchaseOrderItemAndPurchaseOrder_Company_IdCompany(
                                id,
                                companyId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Purchase order item not found with id: "
                                                + id
                                )
                        );

        Integer idPurchaseOrder =
                item.getPurchaseOrder() != null
                        ? item.getPurchaseOrder().getIdPurchaseOrder()
                        : null;

        purchaseOrderItemRepository.delete(item);

        if (idPurchaseOrder != null) {
            recalculateOrderTotal(
                    idPurchaseOrder,
                    companyId
            );
        }
    }

    private PurchaseOrder verifyPurchaseOrder(
            Integer idPurchaseOrder,
            Integer companyId
    ) {
        return purchaseOrderRepository
                .findByIdPurchaseOrderAndCompany_IdCompany(
                        idPurchaseOrder,
                        companyId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Purchase order not found with id: "
                                        + idPurchaseOrder
                        )
                );
    }

    private void recalculateOrderTotal(
            Integer idPurchaseOrder,
            Integer companyId
    ) {
        PurchaseOrder order = verifyPurchaseOrder(
                idPurchaseOrder,
                companyId
        );

        BigDecimal total = BigDecimal.ZERO;

        List<PurchaseOrderItem> items =
                purchaseOrderItemRepository
                        .findAllByPurchaseOrder_IdPurchaseOrderAndPurchaseOrder_Company_IdCompany(
                                idPurchaseOrder,
                                companyId
                        );

        for (PurchaseOrderItem item : items) {
            if (item.getQuantityOrdered() == null
                    || item.getUnitPrice() == null) {
                continue;
            }

            total = total.add(
                    item.getQuantityOrdered()
                            .multiply(item.getUnitPrice())
            );
        }

        order.setTotalAmount(total);

        purchaseOrderRepository.save(order);
    }

    private Integer getCurrentCompanyId() {
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !(authentication.getPrincipal()
                instanceof JwtPrincipal principal)) {

            throw new IllegalStateException(
                    "Authenticated company not found."
            );
        }

        return principal.companyId();
    }
}