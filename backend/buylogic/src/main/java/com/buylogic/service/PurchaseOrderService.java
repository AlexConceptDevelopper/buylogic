package com.buylogic.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.dto.purchaseorder.PurchaseOrderArcUpdateDTO;
import com.buylogic.dto.purchaseorder.PurchaseOrderCreate;
import com.buylogic.dto.purchaseorder.PurchaseOrderDTO;
import com.buylogic.dto.purchaseorder.PurchaseOrderItemReceiveDTO;
import com.buylogic.dto.purchaseorder.PurchaseOrderReceiveDTO;
import com.buylogic.dto.purchaseorderitem.PurchaseOrderItemCreate;
import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.mapper.PurchaseOrderMapper;
import com.buylogic.model.Company;
import com.buylogic.model.Product;
import com.buylogic.model.PurchaseOrder;
import com.buylogic.model.PurchaseOrderItem;
import com.buylogic.model.PurchaseRecommendation;
import com.buylogic.model.StockMovement;
import com.buylogic.model.Supplier;
import com.buylogic.model.enums.OrderStatus;
import com.buylogic.repository.global.CompanyRepository;
import com.buylogic.repository.global.ProductRepository;
import com.buylogic.repository.global.PurchaseOrderItemRepository;
import com.buylogic.repository.global.PurchaseOrderRepository;
import com.buylogic.repository.global.PurchaseRecommendationRepository;
import com.buylogic.repository.global.StockMovementRepository;
import com.buylogic.repository.global.SupplierRepository;
import com.buylogic.security.JwtAuthFilter.JwtPrincipal;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional(readOnly = true)
public class PurchaseOrderService {

        private final PurchaseOrderRepository purchaseOrderRepository;
        private final PurchaseOrderItemRepository purchaseOrderItemRepository;
        private final PurchaseOrderMapper purchaseOrderMapper;
        private final CompanyRepository companyRepository;
        private final SupplierRepository supplierRepository;
        private final ProductRepository productRepository;
        private final PurchaseRecommendationRepository purchaseRecommendationRepository;
        private final StockMovementRepository stockMovementRepository;
        private final PdfService pdfService;
        private final EmailService emailService;

        public PurchaseOrderService(
                        PurchaseOrderRepository purchaseOrderRepository,
                        PurchaseOrderItemRepository purchaseOrderItemRepository,
                        PurchaseOrderMapper purchaseOrderMapper,
                        CompanyRepository companyRepository,
                        SupplierRepository supplierRepository,
                        ProductRepository productRepository,
                        PurchaseRecommendationRepository purchaseRecommendationRepository,
                        StockMovementRepository stockMovementRepository,
                        PdfService pdfService,
                        @Lazy EmailService emailService) {
                this.purchaseOrderRepository = purchaseOrderRepository;
                this.purchaseOrderItemRepository = purchaseOrderItemRepository;
                this.purchaseOrderMapper = purchaseOrderMapper;
                this.companyRepository = companyRepository;
                this.supplierRepository = supplierRepository;
                this.productRepository = productRepository;
                this.purchaseRecommendationRepository = purchaseRecommendationRepository;
                this.stockMovementRepository = stockMovementRepository;
                this.pdfService = pdfService;
                this.emailService = emailService;
        }

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
        public PurchaseOrderDTO create(PurchaseOrderCreate data) {
                Integer companyId = getCurrentCompanyId();

                Company company = companyRepository.findById(companyId)
                                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

                Supplier supplier = supplierRepository
                                .findByIdSupplierAndCompany_IdCompany(data.getIdSupplier(), companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Supplier not found with id: " + data.getIdSupplier()));

                PurchaseOrder order = new PurchaseOrder();
                order.setCompany(company);
                order.setSupplier(supplier);
                order.setOrderNumber(data.getOrderNumber());
                order.setStatus(OrderStatus.DRAFT);
                order.setExpectedDeliveryDate(data.getExpectedDeliveryDate());
                order.setTotalAmount(BigDecimal.ZERO);

                PurchaseOrder savedOrder = purchaseOrderRepository.save(order);

                if (data.getItems() != null && !data.getItems().isEmpty()) {
                        for (PurchaseOrderItemCreate itemDto : data.getItems()) {
                                Product product = productRepository
                                                .findByIdProductAndCompany_IdCompany(itemDto.getIdProduct(), companyId)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Product not found with id: "
                                                                                + itemDto.getIdProduct()));

                                PurchaseOrderItem item = new PurchaseOrderItem();
                                item.setPurchaseOrder(savedOrder);
                                item.setProduct(product);
                                item.setQuantityOrdered(itemDto.getQuantityOrdered());
                                item.setQuantityReceived(BigDecimal.ZERO);
                                item.setUnitPrice(itemDto.getUnitPrice());

                                purchaseOrderItemRepository.save(item);
                        }
                }

                return toDTOWithCalculatedTotal(savedOrder, companyId);
        }

        @Transactional
        public List<PurchaseOrderDTO> createDraftOrdersFromRecommendations(List<Integer> recommendationIds) {
                Integer companyId = getCurrentCompanyId();

                List<PurchaseRecommendation> recommendations = purchaseRecommendationRepository
                                .findAllById(recommendationIds)
                                .stream()
                                .filter(rec -> rec.getCompany() != null
                                                && rec.getCompany().getIdCompany().equals(companyId))
                                .toList();

                if (recommendations.isEmpty()) {
                        throw new ResourceNotFoundException("Aucune recommandation valide trouvée.");
                }

                for (PurchaseRecommendation rec : recommendations) {
                        if (rec.getSupplier() == null) {
                                throw new IllegalStateException("Le produit " + rec.getProduct().getName()
                                                + " n'a pas de fournisseur assigné dans la recommandation.");
                        }
                }

                Map<Supplier, List<PurchaseRecommendation>> groupedBySupplier = new java.util.HashMap<>();
                for (PurchaseRecommendation rec : recommendations) {
                        groupedBySupplier.computeIfAbsent(rec.getSupplier(), k -> new ArrayList<>()).add(rec);
                }

                List<PurchaseOrder> createdOrders = new ArrayList<>();
                int counter = 1;

                for (Map.Entry<Supplier, List<PurchaseRecommendation>> entry : groupedBySupplier.entrySet()) {
                        Supplier supplier = entry.getKey();
                        List<PurchaseRecommendation> supplierRecs = entry.getValue();

                        PurchaseOrder order = new PurchaseOrder();
                        order.setCompany(supplier.getCompany());
                        order.setSupplier(supplier);
                        order.setStatus(OrderStatus.DRAFT);
                        order.setOrderNumber("RCO-CMD-" + System.currentTimeMillis() + "-" + counter++);
                        order.setIsAutoRecommended(true);

                        PurchaseOrder savedOrder = purchaseOrderRepository.save(order);
                        BigDecimal totalOrderAmount = BigDecimal.ZERO;

                        for (PurchaseRecommendation rec : supplierRecs) {
                                PurchaseOrderItem item = new PurchaseOrderItem();
                                item.setPurchaseOrder(savedOrder);
                                item.setProduct(rec.getProduct());
                                item.setQuantityOrdered(rec.getRecommendedQuantity());
                                item.setQuantityReceived(BigDecimal.ZERO);

                                BigDecimal unitPrice = getSupplierUnitPrice(rec);
                                item.setUnitPrice(unitPrice);

                                purchaseOrderItemRepository.save(item);

                                if (rec.getRecommendedQuantity() != null && unitPrice != null) {
                                        totalOrderAmount = totalOrderAmount.add(
                                                        rec.getRecommendedQuantity().multiply(unitPrice));
                                }
                        }

                        savedOrder.setTotalAmount(totalOrderAmount);
                        createdOrders.add(purchaseOrderRepository.save(savedOrder));
                }

                LocalDateTime now = LocalDateTime.now();
                for (PurchaseRecommendation rec : recommendations) {
                        rec.setStatus("APPROVED");
                        rec.setResolvedAt(now);
                }
                purchaseRecommendationRepository.saveAll(recommendations);

                return createdOrders.stream()
                                .map(purchaseOrderMapper::toDTO)
                                .toList();
        }

        private BigDecimal getSupplierUnitPrice(PurchaseRecommendation rec) {
                if (rec.getProduct() != null && rec.getProduct().getSupplierProducts() != null) {
                        return rec.getProduct().getSupplierProducts().stream()
                                        .filter(sp -> sp != null
                                                        && sp.getSupplier() != null
                                                        && sp.getSupplier().getIdSupplier()
                                                                        .equals(rec.getSupplier().getIdSupplier()))
                                        .map(sp -> sp.getUnitPrice())
                                        .findFirst()
                                        .orElse(BigDecimal.ZERO);
                }
                return BigDecimal.ZERO;
        }

        @Transactional
        public PurchaseOrderDTO update(Integer id, PurchaseOrderCreate data) {
                Integer companyId = getCurrentCompanyId();

                PurchaseOrder order = purchaseOrderRepository
                                .findByIdPurchaseOrderAndCompany_IdCompany(id, companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Purchase order not found with id: " + id));

                if (data.getIdSupplier() != null) {
                        Supplier supplier = supplierRepository
                                        .findByIdSupplierAndCompany_IdCompany(data.getIdSupplier(), companyId)
                                        .orElseThrow(() -> new ResourceNotFoundException(
                                                        "Supplier not found with id: " + data.getIdSupplier()));
                        order.setSupplier(supplier);
                }

                if (data.getExpectedDeliveryDate() != null) {
                        order.setExpectedDeliveryDate(data.getExpectedDeliveryDate());
                }

                purchaseOrderRepository.save(order);

                List<PurchaseOrderItem> existingItems = purchaseOrderItemRepository
                                .findAllByPurchaseOrder_IdPurchaseOrderAndPurchaseOrder_Company_IdCompany(id,
                                                companyId);

                purchaseOrderItemRepository.deleteAll(existingItems);

                if (data.getItems() != null && !data.getItems().isEmpty()) {
                        for (PurchaseOrderItemCreate itemDto : data.getItems()) {
                                Product product = productRepository
                                                .findByIdProductAndCompany_IdCompany(itemDto.getIdProduct(), companyId)
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Product not found with id: "
                                                                                + itemDto.getIdProduct()));

                                PurchaseOrderItem item = new PurchaseOrderItem();
                                item.setPurchaseOrder(order);
                                item.setProduct(product);
                                item.setQuantityOrdered(itemDto.getQuantityOrdered());
                                item.setQuantityReceived(BigDecimal.ZERO);
                                item.setUnitPrice(itemDto.getUnitPrice());

                                purchaseOrderItemRepository.save(item);
                        }
                }

                return toDTOWithCalculatedTotal(order, companyId);
        }

        @Transactional
        public PurchaseOrderDTO updateStatus(Integer id, String newStatusStr) {
                Integer companyId = getCurrentCompanyId();

                PurchaseOrder order = purchaseOrderRepository
                                .findByIdPurchaseOrderAndCompany_IdCompany(id, companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Purchase order not found with id: " + id));

                order.setStatus(OrderStatus.valueOf(newStatusStr));
                purchaseOrderRepository.save(order);

                return toDTOWithCalculatedTotal(order, companyId);
        }

        @Transactional
        public PurchaseOrderDTO createFromRecommendation(Integer recommendationId) {
                Integer companyId = getCurrentCompanyId();

                PurchaseRecommendation recommendation = purchaseRecommendationRepository
                                .findByIdRecommendationAndCompany_IdCompany(recommendationId, companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Purchase recommendation not found with id: " + recommendationId));

                if (recommendation.getSupplier() == null) {
                        throw new IllegalStateException(
                                        "Cannot create a purchase order from a recommendation without a supplier.");
                }

                Company company = companyRepository.findById(companyId)
                                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

                Supplier supplier = recommendation.getSupplier();

                Product product = recommendation.getProduct();
                if (product == null) {
                        throw new IllegalStateException("Recommendation has no associated product.");
                }

                PurchaseOrder order = new PurchaseOrder();
                order.setCompany(company);
                order.setSupplier(supplier);
                order.setStatus(OrderStatus.DRAFT);
                order.setTotalAmount(BigDecimal.ZERO);

                PurchaseOrder savedOrder = purchaseOrderRepository.save(order);

                BigDecimal unitPrice = BigDecimal.ZERO;
                if (product.getSupplierProducts() != null) {
                        unitPrice = product.getSupplierProducts().stream()
                                        .filter(sp -> sp != null
                                                        && sp.getSupplier() != null
                                                        && sp.getSupplier().getIdSupplier()
                                                                        .equals(supplier.getIdSupplier())
                                                        && Boolean.TRUE.equals(sp.getActive()))
                                        .map(sp -> sp.getUnitPrice())
                                        .filter(price -> price != null)
                                        .findFirst()
                                        .orElse(BigDecimal.ZERO);
                }

                PurchaseOrderItem item = new PurchaseOrderItem();
                item.setPurchaseOrder(savedOrder);
                item.setProduct(product);
                item.setQuantityOrdered(recommendation.getRecommendedQuantity() != null
                                ? recommendation.getRecommendedQuantity()
                                : BigDecimal.ONE);
                item.setQuantityReceived(BigDecimal.ZERO);
                item.setUnitPrice(unitPrice);

                purchaseOrderItemRepository.save(item);

                recommendation.setStatus("APPROVED");
                recommendation.setResolvedAt(java.time.LocalDateTime.now());
                purchaseRecommendationRepository.save(recommendation);

                return toDTOWithCalculatedTotal(savedOrder, companyId);
        }

        @Transactional
        public PurchaseOrderDTO receiveOrder(Integer id, PurchaseOrderReceiveDTO receiveData) {
                Integer companyId = getCurrentCompanyId();

                PurchaseOrder order = purchaseOrderRepository
                                .findByIdPurchaseOrderAndCompany_IdCompany(id, companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Purchase order not found with id: " + id));

                if (OrderStatus.DRAFT.equals(order.getStatus()) || OrderStatus.RECEIVED.equals(order.getStatus())) {
                        throw new IllegalStateException(
                                        "Cette commande ne peut pas être réceptionnée dans son état actuel : "
                                                        + order.getStatus());
                }

                List<PurchaseOrderItem> orderItems = purchaseOrderItemRepository
                                .findAllByPurchaseOrder_IdPurchaseOrderAndPurchaseOrder_Company_IdCompany(id,
                                                companyId);

                Map<Integer, PurchaseOrderItemReceiveDTO> receiveMap = new java.util.HashMap<>();
                if (receiveData.getItems() != null) {
                        for (PurchaseOrderItemReceiveDTO itemReceive : receiveData.getItems()) {
                                receiveMap.put(itemReceive.getIdPurchaseOrderItem(), itemReceive);
                        }
                }

                boolean allItemsFullyReceived = true;
                boolean anyItemReceived = false;

                for (PurchaseOrderItem item : orderItems) {
                        PurchaseOrderItemReceiveDTO receiveDto = receiveMap.get(item.getIdPurchaseOrderItem());

                        BigDecimal qtyReceivedNow = BigDecimal.ZERO;
                        if (receiveDto != null && receiveDto.getQuantityReceivedNow() != null) {
                                qtyReceivedNow = receiveDto.getQuantityReceivedNow();
                        }

                        if (qtyReceivedNow.compareTo(BigDecimal.ZERO) > 0) {
                                anyItemReceived = true;

                                if (receiveDto != null && receiveDto.getUnitPrice() != null) {
                                        item.setUnitPrice(receiveDto.getUnitPrice());
                                }

                                BigDecimal currentReceived = item.getQuantityReceived() != null
                                                ? item.getQuantityReceived()
                                                : BigDecimal.ZERO;
                                BigDecimal newTotalReceived = currentReceived.add(qtyReceivedNow);
                                item.setQuantityReceived(newTotalReceived);

                                purchaseOrderItemRepository.save(item);

                                Product product = item.getProduct();
                                if (product != null) {
                                        BigDecimal currentStock = product.getCurrentStock() != null
                                                        ? product.getCurrentStock()
                                                        : BigDecimal.ZERO;

                                        product.setCurrentStock(currentStock.add(qtyReceivedNow));
                                        productRepository.save(product);

                                        StockMovement movement = new StockMovement();
                                        movement.setProduct(product);
                                        movement.setMovementType("PURCHASE");
                                        movement.setQuantity(qtyReceivedNow);
                                        movement.setReference("Réception Commande n° " + order.getOrderNumber());
                                        stockMovementRepository.save(movement);
                                }
                        }

                        BigDecimal ordered = item.getQuantityOrdered() != null ? item.getQuantityOrdered()
                                        : BigDecimal.ZERO;
                        BigDecimal received = item.getQuantityReceived() != null ? item.getQuantityReceived()
                                        : BigDecimal.ZERO;

                        if (received.compareTo(ordered) < 0) {
                                allItemsFullyReceived = false;
                        }
                }

                if (allItemsFullyReceived) {
                        order.setStatus(OrderStatus.RECEIVED);
                        order.setReceivedAt(LocalDateTime.now());
                } else if (anyItemReceived) {
                        order.setStatus(OrderStatus.PARTIALLY_RECEIVED);
                        if (order.getReceivedAt() == null) {
                                order.setReceivedAt(LocalDateTime.now());
                        }
                }
                purchaseOrderRepository.save(order);

                return toDTOWithCalculatedTotal(order, companyId);
        }

        @Transactional(readOnly = true)
        public PurchaseOrderDTO getOrderWithItems(Integer orderId) {
                Integer companyId = getCurrentCompanyId();

                PurchaseOrder order = purchaseOrderRepository.findByIdAndCompanyIdWithItems(orderId, companyId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Purchase order not found with id: " + orderId));

                return purchaseOrderMapper.toDTO(order);
        }

        @Transactional
        public void deletePurchaseOrder(Integer orderId) {
                Integer companyId = getCurrentCompanyId();

                PurchaseOrder order = purchaseOrderRepository
                                .findByIdPurchaseOrderAndCompany_IdCompany(orderId, companyId)
                                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable"));

                if (!OrderStatus.DRAFT.equals(order.getStatus())) {
                        throw new IllegalStateException(
                                        "Seules les commandes en brouillon (DRAFT) peuvent être supprimées.");
                }

                List<PurchaseOrderItem> items = purchaseOrderItemRepository
                                .findAllByPurchaseOrder_IdPurchaseOrderAndPurchaseOrder_Company_IdCompany(orderId,
                                                companyId);

                if (Boolean.TRUE.equals(order.getIsAutoRecommended())) {
                        List<Product> products = items.stream()
                                        .filter(item -> item != null && item.getProduct() != null)
                                        .map((PurchaseOrderItem item) -> item.getProduct())
                                        .toList();

                        if (!products.isEmpty()) {
                                List<PurchaseRecommendation> recommendations = purchaseRecommendationRepository
                                                .findByCompany_IdCompanyAndProductInAndStatus(
                                                                companyId,
                                                                products,
                                                                "APPROVED");

                                if (!recommendations.isEmpty()) {
                                        purchaseRecommendationRepository.deleteAll(recommendations);
                                }
                        }
                }

                purchaseOrderItemRepository.deleteAll(items);
                purchaseOrderRepository.deleteByIdPurchaseOrderAndCompany_IdCompany(orderId, companyId);
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

        @Transactional
        public PurchaseOrderDTO updateArc(Integer id, PurchaseOrderArcUpdateDTO arcData) {
                Integer companyId = getCurrentCompanyId();

                PurchaseOrder order = purchaseOrderRepository
                                .findByIdPurchaseOrderAndCompany_IdCompany(id, companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Purchase order not found with id: " + id));

                if (arcData.getArcNumber() != null) {
                        order.setArcNumber(arcData.getArcNumber());
                }

                if (arcData.getExpectedDeliveryDate() != null) {
                        order.setExpectedDeliveryDate(arcData.getExpectedDeliveryDate());
                }

                if (OrderStatus.SENT.equals(order.getStatus())) {
                        order.setStatus(OrderStatus.CONFIRMED);
                }

                purchaseOrderRepository.save(order);

                return toDTOWithCalculatedTotal(order, companyId);
        }

        @Transactional
        public void sendOrderEmail(Integer orderId, String toEmail, String subject, String body) {
                Integer companyId = getCurrentCompanyId();

                PurchaseOrder order = purchaseOrderRepository
                                .findByIdPurchaseOrderAndCompany_IdCompany(orderId, companyId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Commande introuvable avec l'id : " + orderId));

                Company company = companyRepository.findById(companyId).orElse(null);
                Supplier supplier = order.getSupplier();

                List<PurchaseOrderItem> items = purchaseOrderItemRepository
                                .findAllByPurchaseOrder_IdPurchaseOrderAndPurchaseOrder_Company_IdCompany(orderId,
                                                companyId);

                byte[] pdfBytes = pdfService.generatePurchaseOrderPdf(company, supplier, order, items);
                String attachmentName = "BonDeCommande_" + order.getOrderNumber() + ".pdf";

                emailService.sendEmailWithAttachment(
                                toEmail,
                                subject,
                                body,
                                pdfBytes,
                                attachmentName);

                order.setStatus(OrderStatus.SENT);
                purchaseOrderRepository.save(order);
        }
}