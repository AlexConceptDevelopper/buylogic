package com.buylogic.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.purchaseorder.PurchaseOrderDTO;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.PurchaseOrderMapper;
import com.buylogic.model.PurchaseOrder;
import com.buylogic.model.PurchaseOrderItem;
import com.buylogic.repository.global.PurchaseOrderItemRepository;
import com.buylogic.repository.global.PurchaseOrderRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PurchaseOrderService {

        private final PurchaseOrderRepository purchaseOrderRepository;
        private final PurchaseOrderItemRepository purchaseOrderItemRepository;
        private final PurchaseOrderMapper purchaseOrderMapper;

        public List<PurchaseOrderDTO> getAll() {
                Integer companyId = getCurrentCompanyId();

                return purchaseOrderRepository
                                .findAllByCompany_IdCompany(companyId)
                                .stream()
                                .map(order -> toDTOWithCalculatedTotal(order, companyId))
                                .toList();
        }

        public PurchaseOrderDTO getById(Integer id) {
                Integer companyId = getCurrentCompanyId();

                PurchaseOrder order = purchaseOrderRepository
                                .findByIdPurchaseOrderAndCompany_IdCompany(
                                                id,
                                                companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Purchase order not found with id: "
                                                                + id));

                return toDTOWithCalculatedTotal(order, companyId);
        }

        @Transactional
        public void delete(Integer id) {
                Integer companyId = getCurrentCompanyId();

                PurchaseOrder order = purchaseOrderRepository
                                .findByIdPurchaseOrderAndCompany_IdCompany(
                                                id,
                                                companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Purchase order not found with id: "
                                                                + id));

                purchaseOrderRepository.delete(order);
        }

        private PurchaseOrderDTO toDTOWithCalculatedTotal(
                        PurchaseOrder order,
                        Integer companyId) {
                PurchaseOrderDTO dto = purchaseOrderMapper.toDTO(order);

                BigDecimal totalAmount = BigDecimal.ZERO;

                List<PurchaseOrderItem> items = purchaseOrderItemRepository
                                .findAllByPurchaseOrder_IdPurchaseOrderAndPurchaseOrder_Company_IdCompany(
                                                order.getIdPurchaseOrder(),
                                                companyId);

                for (PurchaseOrderItem item : items) {
                        totalAmount = totalAmount.add(
                                        calculateLineTotal(item));
                }

                dto.setTotalAmount(totalAmount);

                return dto;
        }

        private BigDecimal calculateLineTotal(
                        PurchaseOrderItem item) {
                if (item.getQuantityOrdered() == null
                                || item.getUnitPrice() == null) {
                        return BigDecimal.ZERO;
                }

                return item.getQuantityOrdered()
                                .multiply(item.getUnitPrice());
        }

        private Integer getCurrentCompanyId() {
                Authentication authentication = SecurityContextHolder
                                .getContext()
                                .getAuthentication();

                if (authentication == null
                                || !(authentication.getPrincipal() instanceof JwtPrincipal principal)) {

                        throw new IllegalStateException(
                                        "Authenticated company not found.");
                }

                return principal.companyId();
        }
}