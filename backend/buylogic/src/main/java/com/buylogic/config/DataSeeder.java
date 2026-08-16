package com.buylogic.config;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.buylogic.model.AppUser;
import com.buylogic.model.Company;
import com.buylogic.model.Consumption;
import com.buylogic.model.Notification;
import com.buylogic.model.Product;
import com.buylogic.model.PurchaseOrder;
import com.buylogic.model.PurchaseOrderItem;
import com.buylogic.model.PurchaseRecommendation;
import com.buylogic.model.StockMovement;
import com.buylogic.model.Supplier;
import com.buylogic.model.SupplierProduct;
import com.buylogic.repository.global.AppUserRepository;
import com.buylogic.repository.global.CompanyRepository;
import com.buylogic.repository.global.ConsumptionRepository;
import com.buylogic.repository.global.NotificationRepository;
import com.buylogic.repository.global.ProductRepository;
import com.buylogic.repository.global.PurchaseOrderItemRepository;
import com.buylogic.repository.global.PurchaseOrderRepository;
import com.buylogic.repository.global.PurchaseRecommendationRepository;
import com.buylogic.repository.global.StockMovementRepository;
import com.buylogic.repository.global.SupplierProductRepository;
import com.buylogic.repository.global.SupplierRepository;
import com.buylogic.model.Role;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import tools.jackson.databind.ObjectMapper;

@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

        private final CompanyRepository companyRepository;
        private final AppUserRepository appUserRepository;
        private final SupplierRepository supplierRepository;
        private final ProductRepository productRepository;
        private final SupplierProductRepository supplierProductRepository;
        private final StockMovementRepository stockMovementRepository;
        private final ConsumptionRepository consumptionRepository;
        private final PurchaseOrderRepository purchaseOrderRepository;
        private final PurchaseOrderItemRepository purchaseOrderItemRepository;
        private final PurchaseRecommendationRepository purchaseRecommendationRepository;
        private final NotificationRepository notificationRepository;

        private final ObjectMapper mapper = new ObjectMapper();

        private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        public DataSeeder(
                        CompanyRepository companyRepository,
                        AppUserRepository appUserRepository,
                        SupplierRepository supplierRepository,
                        ProductRepository productRepository,
                        SupplierProductRepository supplierProductRepository,
                        StockMovementRepository stockMovementRepository,
                        ConsumptionRepository consumptionRepository,
                        PurchaseOrderRepository purchaseOrderRepository,
                        PurchaseOrderItemRepository purchaseOrderItemRepository,
                        PurchaseRecommendationRepository purchaseRecommendationRepository,
                        NotificationRepository notificationRepository) {

                this.companyRepository = companyRepository;
                this.appUserRepository = appUserRepository;
                this.supplierRepository = supplierRepository;
                this.productRepository = productRepository;
                this.supplierProductRepository = supplierProductRepository;
                this.stockMovementRepository = stockMovementRepository;
                this.consumptionRepository = consumptionRepository;
                this.purchaseOrderRepository = purchaseOrderRepository;
                this.purchaseOrderItemRepository = purchaseOrderItemRepository;
                this.purchaseRecommendationRepository = purchaseRecommendationRepository;
                this.notificationRepository = notificationRepository;
        }

        @Override
        @Transactional
        public void run(String... args) throws Exception {

                if (companyRepository.count() > 0) {
                        System.out.println(
                                        "⚠️ BuyLogic : données déjà présentes, seed ignoré.");
                        return;
                }

                System.out.println(
                                "========== BUYLOGIC DATA SEED ==========");

                Map<String, Company> companies = seedCompanies();

                Map<String, AppUser> users = seedUsers(companies);

                Map<String, Supplier> suppliers = seedSuppliers(companies);

                Map<String, Product> products = seedProducts(companies);

                seedSupplierProducts(
                                products,
                                suppliers);

                seedStockMovements(products);

                seedConsumptions(products);

                Map<String, PurchaseOrder> purchaseOrders = seedPurchaseOrders(
                                companies,
                                suppliers);

                seedPurchaseOrderItems(
                                purchaseOrders,
                                products);

                Map<String, PurchaseRecommendation> recommendations = seedRecommendations(
                                companies,
                                products,
                                suppliers);

                seedNotifications(
                                users,
                                recommendations);

                printSummary();

                System.out.println(
                                "========== BUYLOGIC SEED TERMINE ==========");
        }

        // =========================================================
        // COMPANIES
        // =========================================================

        private Map<String, Company> seedCompanies()
                        throws Exception {

                if (companyRepository.count() > 0) {
                        return getCompaniesFromDatabase();
                }

                List<Map<String, Object>> data = readJson("seed/companies.json");

                Map<String, Company> companies = new HashMap<>();

                for (Map<String, Object> entry : data) {

                        Company company = new Company();

                        company.setName(
                                        getRequiredString(
                                                        entry,
                                                        "name",
                                                        "companies.json"));

                        company.setEmail(
                                        getRequiredString(
                                                        entry,
                                                        "email",
                                                        "companies.json"));

                        company.setActive(
                                        getBoolean(
                                                        entry,
                                                        "active",
                                                        true));

                        company = companyRepository.save(company);

                        companies.put(
                                        company.getEmail(),
                                        company);
                }

                System.out.println(
                                "✅ Companies seedées : " + data.size());

                return companies;
        }

        // =========================================================
        // USERS
        // =========================================================

        private Map<String, AppUser> seedUsers(
                        Map<String, Company> companies)
                        throws Exception {

                if (appUserRepository.count() > 0) {
                        return getUsersFromDatabase();
                }

                List<Map<String, Object>> data = readJson("seed/users.json");

                Map<String, AppUser> users = new HashMap<>();

                for (Map<String, Object> entry : data) {

                        String companyEmail = getRequiredString(
                                        entry,
                                        "companyEmail",
                                        "users.json");

                        Company company = getCompany(
                                        companies,
                                        companyEmail);

                        AppUser user = new AppUser();

                        user.setCompany(company);

                        user.setEmail(
                                        getRequiredString(
                                                        entry,
                                                        "email",
                                                        "users.json"));

                        String password = getRequiredString(
                                        entry,
                                        "password",
                                        "users.json");

                        user.setPasswordHash(
                                        passwordEncoder.encode(password));

                        user.setFirstName(
                                        (String) entry.get("firstName"));

                        user.setLastName(
                                        (String) entry.get("lastName"));

                        user.setRole(
                                        Role.valueOf(
                                                        getRequiredString(
                                                                        entry,
                                                                        "role",
                                                                        "users.json").toUpperCase()));

                        user.setActive(
                                        getBoolean(
                                                        entry,
                                                        "active",
                                                        true));

                        user = appUserRepository.save(user);

                        users.put(
                                        user.getEmail(),
                                        user);
                }

                System.out.println(
                                "✅ Utilisateurs seedés : " + data.size());

                return users;
        }

        // =========================================================
        // SUPPLIERS
        // =========================================================

        private Map<String, Supplier> seedSuppliers(
                        Map<String, Company> companies)
                        throws Exception {

                if (supplierRepository.count() > 0) {
                        return getSuppliersFromDatabase();
                }

                List<Map<String, Object>> data = readJson("seed/suppliers.json");

                Map<String, Supplier> suppliers = new HashMap<>();

                for (Map<String, Object> entry : data) {

                        String companyEmail = getRequiredString(
                                        entry,
                                        "companyEmail",
                                        "suppliers.json");

                        Company company = getCompany(
                                        companies,
                                        companyEmail);

                        String name = getRequiredString(
                                        entry,
                                        "name",
                                        "suppliers.json");

                        Supplier supplier = new Supplier();

                        supplier.setCompany(company);
                        supplier.setName(name);

                        supplier.setEmail(
                                        (String) entry.get("email"));

                        supplier.setPhone(
                                        (String) entry.get("phone"));

                        supplier.setActive(
                                        getBoolean(
                                                        entry,
                                                        "active",
                                                        true));

                        supplier = supplierRepository.save(supplier);

                        suppliers.put(
                                        supplierKey(
                                                        companyEmail,
                                                        name),
                                        supplier);
                }

                System.out.println(
                                "✅ Fournisseurs seedés : " + data.size());

                return suppliers;
        }

        // =========================================================
        // PRODUCTS
        // =========================================================

        private Map<String, Product> seedProducts(
                        Map<String, Company> companies)
                        throws Exception {

                if (productRepository.count() > 0) {
                        return getProductsFromDatabase();
                }

                List<Map<String, Object>> data = readJson("seed/products.json");

                Map<String, Product> products = new HashMap<>();

                for (Map<String, Object> entry : data) {

                        String companyEmail = getRequiredString(
                                        entry,
                                        "companyEmail",
                                        "products.json");

                        Company company = getCompany(
                                        companies,
                                        companyEmail);

                        String reference = getRequiredString(
                                        entry,
                                        "reference",
                                        "products.json");

                        Product product = new Product();

                        product.setCompany(company);
                        product.setReference(reference);

                        product.setName(
                                        getRequiredString(
                                                        entry,
                                                        "name",
                                                        "products.json"));

                        product.setDescription(
                                        (String) entry.get("description"));

                        product.setUnit(
                                        getString(
                                                        entry,
                                                        "unit",
                                                        "UNIT"));

                        /*
                         * On construit le vrai stock avec stock-movements.json.
                         */
                        product.setCurrentStock(
                                        BigDecimal.ZERO);

                        product.setActive(
                                        getBoolean(
                                                        entry,
                                                        "active",
                                                        true));

                        product = productRepository.save(product);

                        products.put(
                                        productKey(
                                                        companyEmail,
                                                        reference),
                                        product);
                }

                System.out.println(
                                "✅ Produits seedés : " + data.size());

                return products;
        }

        // =========================================================
        // SUPPLIER PRODUCTS
        // =========================================================

        private void seedSupplierProducts(
                        Map<String, Product> products,
                        Map<String, Supplier> suppliers)
                        throws Exception {

                if (supplierProductRepository.count() > 0) {
                        return;
                }

                List<Map<String, Object>> data = readJson(
                                "seed/supplier-products.json");

                for (Map<String, Object> entry : data) {

                        String productReference = getRequiredString(
                                        entry,
                                        "productReference",
                                        "supplier-products.json");

                        String supplierName = getRequiredString(
                                        entry,
                                        "supplierName",
                                        "supplier-products.json");

                        Product product = findProductByReference(
                                        products,
                                        productReference);

                        Supplier supplier = findSupplierByName(
                                        suppliers,
                                        supplierName);

                        SupplierProduct supplierProduct = new SupplierProduct();

                        supplierProduct.setProduct(product);
                        supplierProduct.setSupplier(supplier);

                        supplierProduct.setSupplierReference(
                                        (String) entry.get(
                                                        "supplierReference"));

                        supplierProduct.setUnitPrice(
                                        toBigDecimal(
                                                        entry.get("unitPrice")));

                        supplierProduct.setMinimumOrderQuantity(
                                        toBigDecimal(
                                                        entry.get(
                                                                        "minimumOrderQuantity")));

                        supplierProduct.setExpectedLeadTimeDays(
                                        getInteger(
                                                        entry,
                                                        "expectedLeadTimeDays"));

                        supplierProduct.setActive(
                                        getBoolean(
                                                        entry,
                                                        "active",
                                                        true));

                        supplierProductRepository.save(
                                        supplierProduct);
                }

                System.out.println(
                                "✅ SupplierProducts seedés : "
                                                + data.size());
        }

        // =========================================================
        // STOCK MOVEMENTS
        // =========================================================

        private void seedStockMovements(
                        Map<String, Product> products)
                        throws Exception {

                if (stockMovementRepository.count() > 0) {
                        return;
                }

                List<Map<String, Object>> data = readJson(
                                "seed/stock-movements.json");

                for (Map<String, Object> entry : data) {

                        String productReference = getRequiredString(
                                        entry,
                                        "productReference",
                                        "stock-movements.json");

                        Product product = findProductByReference(
                                        products,
                                        productReference);

                        BigDecimal quantity = toBigDecimal(
                                        entry.get("quantity"));

                        if (quantity == null) {
                                throw new RuntimeException(
                                                "Quantity manquante dans stock-movements.json : "
                                                                + entry);
                        }

                        BigDecimal newStock = product.getCurrentStock()
                                        .add(quantity);

                        if (newStock.compareTo(
                                        BigDecimal.ZERO) < 0) {

                                throw new RuntimeException(
                                                "Le seed crée un stock négatif pour : "
                                                                + product.getReference());
                        }

                        StockMovement movement = new StockMovement();

                        movement.setProduct(product);

                        movement.setMovementType(
                                        getRequiredString(
                                                        entry,
                                                        "movementType",
                                                        "stock-movements.json").toUpperCase());

                        movement.setQuantity(quantity);

                        movement.setReference(
                                        (String) entry.get(
                                                        "reference"));

                        movement.setMovementDate(
                                        LocalDateTime.parse(
                                                        getRequiredString(
                                                                        entry,
                                                                        "movementDate",
                                                                        "stock-movements.json")));

                        stockMovementRepository.save(
                                        movement);

                        product.setCurrentStock(
                                        newStock);

                        productRepository.save(
                                        product);
                }

                System.out.println(
                                "✅ Mouvements de stock seedés : "
                                                + data.size());
        }

        // =========================================================
        // CONSUMPTIONS
        // =========================================================

        private void seedConsumptions(
                        Map<String, Product> products)
                        throws Exception {

                if (consumptionRepository.count() > 0) {
                        return;
                }

                List<Map<String, Object>> data = readJson(
                                "seed/consumptions.json");

                for (Map<String, Object> entry : data) {

                        Product product = findProductByReference(
                                        products,
                                        getRequiredString(
                                                        entry,
                                                        "productReference",
                                                        "consumptions.json"));

                        Consumption consumption = new Consumption();

                        consumption.setProduct(product);

                        consumption.setQuantity(
                                        toBigDecimal(
                                                        entry.get("quantity")));

                        consumption.setConsumptionDate(
                                        LocalDate.parse(
                                                        getRequiredString(
                                                                        entry,
                                                                        "consumptionDate",
                                                                        "consumptions.json")));

                        consumption.setSource(
                                        getString(
                                                        entry,
                                                        "source",
                                                        "SEED").toUpperCase());

                        consumptionRepository.save(
                                        consumption);
                }

                System.out.println(
                                "✅ Consommations seedées : "
                                                + data.size());
        }

        // =========================================================
        // PURCHASE ORDERS
        // =========================================================

        private Map<String, PurchaseOrder> seedPurchaseOrders(
                        Map<String, Company> companies,
                        Map<String, Supplier> suppliers)
                        throws Exception {

                if (purchaseOrderRepository.count() > 0) {
                        return getPurchaseOrdersFromDatabase();
                }

                List<Map<String, Object>> data = readJson(
                                "seed/purchase-orders.json");

                Map<String, PurchaseOrder> orders = new HashMap<>();

                for (Map<String, Object> entry : data) {

                        String companyEmail = getRequiredString(
                                        entry,
                                        "companyEmail",
                                        "purchase-orders.json");

                        String supplierName = getRequiredString(
                                        entry,
                                        "supplierName",
                                        "purchase-orders.json");

                        Company company = getCompany(
                                        companies,
                                        companyEmail);

                        Supplier supplier = getSupplier(
                                        suppliers,
                                        companyEmail,
                                        supplierName);

                        PurchaseOrder order = new PurchaseOrder();

                        order.setCompany(company);
                        order.setSupplier(supplier);

                        order.setOrderNumber(
                                        getRequiredString(
                                                        entry,
                                                        "orderNumber",
                                                        "purchase-orders.json"));

                        order.setStatus(
                                        getRequiredString(
                                                        entry,
                                                        "status",
                                                        "purchase-orders.json"));

                        String orderedAt = (String) entry.get(
                                        "orderedAt");

                        if (orderedAt != null) {
                                order.setOrderedAt(
                                                LocalDateTime.parse(
                                                                orderedAt));
                        }

                        String expectedDeliveryDate = (String) entry.get(
                                        "expectedDeliveryDate");

                        if (expectedDeliveryDate != null) {
                                order.setExpectedDeliveryDate(
                                                LocalDate.parse(
                                                                expectedDeliveryDate));
                        }

                        String receivedAt = (String) entry.get(
                                        "receivedAt");

                        if (receivedAt != null) {
                                order.setReceivedAt(
                                                LocalDateTime.parse(
                                                                receivedAt));
                        }

                        order.setTotalAmount(
                                        toBigDecimal(
                                                        entry.get("totalAmount")));

                        order = purchaseOrderRepository.save(
                                        order);

                        orders.put(
                                        order.getOrderNumber(),
                                        order);
                }

                System.out.println(
                                "✅ PurchaseOrders seedées : "
                                                + data.size());

                return orders;
        }

        // =========================================================
        // PURCHASE ORDER ITEMS
        // =========================================================

        private void seedPurchaseOrderItems(
                        Map<String, PurchaseOrder> orders,
                        Map<String, Product> products)
                        throws Exception {

                if (purchaseOrderItemRepository.count() > 0) {
                        return;
                }

                List<Map<String, Object>> data = readJson(
                                "seed/purchase-order-items.json");

                for (Map<String, Object> entry : data) {

                        String orderNumber = getRequiredString(
                                        entry,
                                        "orderNumber",
                                        "purchase-order-items.json");

                        PurchaseOrder order = orders.get(orderNumber);

                        if (order == null) {
                                throw new RuntimeException(
                                                "Commande introuvable : "
                                                                + orderNumber);
                        }

                        Product product = findProductByReference(
                                        products,
                                        getRequiredString(
                                                        entry,
                                                        "productReference",
                                                        "purchase-order-items.json"));

                        PurchaseOrderItem item = new PurchaseOrderItem();

                        item.setPurchaseOrder(order);
                        item.setProduct(product);

                        item.setQuantityOrdered(
                                        toBigDecimal(
                                                        entry.get(
                                                                        "quantityOrdered")));

                        item.setQuantityReceived(
                                        toBigDecimal(
                                                        entry.get(
                                                                        "quantityReceived")));

                        item.setUnitPrice(
                                        toBigDecimal(
                                                        entry.get(
                                                                        "unitPrice")));

                        purchaseOrderItemRepository.save(
                                        item);
                }

                System.out.println(
                                "✅ PurchaseOrderItems seedés : "
                                                + data.size());
        }

        // =========================================================
        // RECOMMENDATIONS
        // =========================================================

        private Map<String, PurchaseRecommendation> seedRecommendations(
                        Map<String, Company> companies,
                        Map<String, Product> products,
                        Map<String, Supplier> suppliers)
                        throws Exception {

                if (purchaseRecommendationRepository.count() > 0) {
                        return getRecommendationsFromDatabase();
                }

                List<Map<String, Object>> data = readJson(
                                "seed/recommendations.json");

                Map<String, PurchaseRecommendation> recommendations = new HashMap<>();

                for (Map<String, Object> entry : data) {

                        String companyEmail = getRequiredString(
                                        entry,
                                        "companyEmail",
                                        "recommendations.json");

                        Company company = getCompany(
                                        companies,
                                        companyEmail);

                        String productReference = getRequiredString(
                                        entry,
                                        "productReference",
                                        "recommendations.json");

                        Product product = getProduct(
                                        products,
                                        companyEmail,
                                        productReference);

                        String supplierName = getRequiredString(
                                        entry,
                                        "supplierName",
                                        "recommendations.json");

                        Supplier supplier = getSupplier(
                                        suppliers,
                                        companyEmail,
                                        supplierName);

                        PurchaseRecommendation recommendation = new PurchaseRecommendation();

                        recommendation.setCompany(company);
                        recommendation.setProduct(product);
                        recommendation.setSupplier(supplier);

                        recommendation.setStatus(
                                        getRequiredString(
                                                        entry,
                                                        "status",
                                                        "recommendations.json"));

                        recommendation.setRecommendedQuantity(
                                        toBigDecimal(
                                                        entry.get(
                                                                        "recommendedQuantity")));

                        recommendation.setCurrentStock(
                                        toBigDecimal(
                                                        entry.get(
                                                                        "currentStock")));

                        recommendation.setSafetyStock(
                                        toBigDecimal(
                                                        entry.get(
                                                                        "safetyStock")));

                        recommendation.setReorderPoint(
                                        toBigDecimal(
                                                        entry.get(
                                                                        "reorderPoint")));

                        recommendation.setEstimatedDailyConsumption(
                                        toBigDecimal(
                                                        entry.get(
                                                                        "estimatedDailyConsumption")));

                        recommendation.setEstimatedLeadTimeDays(
                                        toBigDecimal(
                                                        entry.get(
                                                                        "estimatedLeadTimeDays")));

                        recommendation.setEstimatedStockoutDate(
                                        LocalDate.parse(
                                                        getRequiredString(
                                                                        entry,
                                                                        "estimatedStockoutDate",
                                                                        "recommendations.json")));

                        recommendation.setEstimatedPurchaseAmount(
                                        toBigDecimal(
                                                        entry.get(
                                                                        "estimatedPurchaseAmount")));

                        recommendation.setConfidenceScore(
                                        toBigDecimal(
                                                        entry.get(
                                                                        "confidenceScore")));

                        recommendation.setReason(
                                        (String) entry.get(
                                                        "reason"));

                        recommendation = purchaseRecommendationRepository.save(
                                        recommendation);

                        recommendations.put(
                                        recommendationKey(
                                                        companyEmail,
                                                        productReference),
                                        recommendation);
                }

                System.out.println(
                                "✅ Recommendations seedées : "
                                                + data.size());

                return recommendations;
        }

        // =========================================================
        // NOTIFICATIONS
        // =========================================================

        private void seedNotifications(
                        Map<String, AppUser> users,
                        Map<String, PurchaseRecommendation> recommendations)
                        throws Exception {

                if (notificationRepository.count() > 0) {
                        return;
                }

                List<Map<String, Object>> data = readJson(
                                "seed/notifications.json");

                for (Map<String, Object> entry : data) {

                        String userEmail = getRequiredString(
                                        entry,
                                        "userEmail",
                                        "notifications.json");

                        AppUser user = users.get(userEmail);

                        if (user == null) {
                                throw new RuntimeException(
                                                "Utilisateur introuvable : "
                                                                + userEmail);
                        }

                        String productReference = (String) entry.get(
                                        "productReference");

                        PurchaseRecommendation recommendation = null;

                        if (productReference != null) {

                                recommendation = findRecommendation(
                                                recommendations,
                                                user.getCompany().getEmail(),
                                                productReference);
                        }

                        Notification notification = new Notification();

                        notification.setUser(user);

                        notification.setType(
                                        getRequiredString(
                                                        entry,
                                                        "type",
                                                        "notifications.json"));

                        notification.setTitle(
                                        getRequiredString(
                                                        entry,
                                                        "title",
                                                        "notifications.json"));

                        notification.setMessage(
                                        getRequiredString(
                                                        entry,
                                                        "message",
                                                        "notifications.json"));

                        notification.setRecommendation(
                                        recommendation);

                        notificationRepository.save(
                                        notification);
                }

                System.out.println(
                                "✅ Notifications seedées : "
                                                + data.size());
        }

        // =========================================================
        // JSON
        // =========================================================

        private List<Map<String, Object>> readJson(
                        String path) throws Exception {

                InputStream inputStream = new ClassPathResource(path)
                                .getInputStream();

                return mapper.readValue(
                                inputStream,
                                mapper.getTypeFactory()
                                                .constructCollectionType(
                                                                List.class,
                                                                Map.class));
        }

        // =========================================================
        // HELPERS
        // =========================================================

        private String getRequiredString(
                        Map<String, Object> data,
                        String field,
                        String file) {

                Object value = data.get(field);

                if (value == null) {
                        throw new RuntimeException(
                                        "Champ '" + field
                                                        + "' manquant dans "
                                                        + file
                                                        + " : "
                                                        + data);
                }

                return value.toString();
        }

        private String getString(
                        Map<String, Object> data,
                        String field,
                        String defaultValue) {

                Object value = data.get(field);

                return value != null
                                ? value.toString()
                                : defaultValue;
        }

        private Boolean getBoolean(
                        Map<String, Object> data,
                        String field,
                        boolean defaultValue) {

                Object value = data.get(field);

                if (value == null) {
                        return defaultValue;
                }

                if (value instanceof Boolean) {
                        return (Boolean) value;
                }

                return Boolean.parseBoolean(
                                value.toString());
        }

        private Integer getInteger(
                        Map<String, Object> data,
                        String field) {

                Object value = data.get(field);

                if (value == null) {
                        throw new RuntimeException(
                                        "Champ '" + field
                                                        + "' manquant dans le seed : "
                                                        + data);
                }

                if (value instanceof Number) {
                        return ((Number) value).intValue();
                }

                return Integer.parseInt(
                                value.toString());
        }

        private BigDecimal toBigDecimal(
                        Object value) {

                if (value == null) {
                        return null;
                }

                if (value instanceof BigDecimal) {
                        return (BigDecimal) value;
                }

                if (value instanceof Number) {
                        return new BigDecimal(
                                        value.toString());
                }

                return new BigDecimal(
                                value.toString());
        }

        // =========================================================
        // COMPANY / PRODUCT / SUPPLIER RESOLUTION
        // =========================================================

        private Company getCompany(
                        Map<String, Company> companies,
                        String email) {

                Company company = companies.get(email);

                if (company == null) {
                        throw new RuntimeException(
                                        "Entreprise introuvable : "
                                                        + email);
                }

                return company;
        }

        private Product getProduct(
                        Map<String, Product> products,
                        String companyEmail,
                        String reference) {

                Product product = products.get(
                                productKey(
                                                companyEmail,
                                                reference));

                if (product == null) {
                        throw new RuntimeException(
                                        "Produit introuvable : "
                                                        + reference
                                                        + " pour l'entreprise "
                                                        + companyEmail);
                }

                return product;
        }

        private Supplier getSupplier(
                        Map<String, Supplier> suppliers,
                        String companyEmail,
                        String name) {

                Supplier supplier = suppliers.get(
                                supplierKey(
                                                companyEmail,
                                                name));

                if (supplier == null) {
                        throw new RuntimeException(
                                        "Fournisseur introuvable : "
                                                        + name
                                                        + " pour l'entreprise "
                                                        + companyEmail);
                }

                return supplier;
        }

        private Product findProductByReference(
                        Map<String, Product> products,
                        String reference) {

                Product found = null;

                for (Product product : products.values()) {

                        if (reference.equals(
                                        product.getReference())) {

                                if (found != null) {
                                        throw new RuntimeException(
                                                        "Référence produit ambiguë : "
                                                                        + reference
                                                                        + ". Utilise une référence unique par entreprise.");
                                }

                                found = product;
                        }
                }

                if (found == null) {
                        throw new RuntimeException(
                                        "Produit introuvable : "
                                                        + reference);
                }

                return found;
        }

        private Supplier findSupplierByName(
                        Map<String, Supplier> suppliers,
                        String name) {

                Supplier found = null;

                for (Supplier supplier : suppliers.values()) {

                        if (name.equals(
                                        supplier.getName())) {

                                if (found != null) {
                                        throw new RuntimeException(
                                                        "Nom fournisseur ambigu : "
                                                                        + name);
                                }

                                found = supplier;
                        }
                }

                if (found == null) {
                        throw new RuntimeException(
                                        "Fournisseur introuvable : "
                                                        + name);
                }

                return found;
        }

        private PurchaseRecommendation findRecommendation(
                        Map<String, PurchaseRecommendation> recommendations,
                        String companyEmail,
                        String productReference) {

                return recommendations.get(
                                recommendationKey(
                                                companyEmail,
                                                productReference));
        }

        // =========================================================
        // KEYS
        // =========================================================

        private String productKey(
                        String companyEmail,
                        String reference) {

                return companyEmail
                                + "|"
                                + reference;
        }

        private String supplierKey(
                        String companyEmail,
                        String name) {

                return companyEmail
                                + "|"
                                + name;
        }

        private String recommendationKey(
                        String companyEmail,
                        String productReference) {

                return companyEmail
                                + "|"
                                + productReference;
        }

        // =========================================================
        // DATABASE MAPS
        // =========================================================

        private Map<String, Company> getCompaniesFromDatabase() {

                Map<String, Company> companies = new HashMap<>();

                for (Company company : companyRepository.findAll()) {

                        companies.put(
                                        company.getEmail(),
                                        company);
                }

                return companies;
        }

        private Map<String, AppUser> getUsersFromDatabase() {

                Map<String, AppUser> users = new HashMap<>();

                for (AppUser user : appUserRepository.findAll()) {

                        users.put(
                                        user.getEmail(),
                                        user);
                }

                return users;
        }

        private Map<String, Supplier> getSuppliersFromDatabase() {

                Map<String, Supplier> suppliers = new HashMap<>();

                for (Supplier supplier : supplierRepository.findAll()) {

                        suppliers.put(
                                        supplierKey(
                                                        supplier.getCompany().getEmail(),
                                                        supplier.getName()),
                                        supplier);
                }

                return suppliers;
        }

        private Map<String, Product> getProductsFromDatabase() {

                Map<String, Product> products = new HashMap<>();

                for (Product product : productRepository.findAll()) {

                        products.put(
                                        productKey(
                                                        product.getCompany().getEmail(),
                                                        product.getReference()),
                                        product);
                }

                return products;
        }

        private Map<String, PurchaseOrder> getPurchaseOrdersFromDatabase() {

                Map<String, PurchaseOrder> orders = new HashMap<>();

                for (PurchaseOrder order : purchaseOrderRepository.findAll()) {

                        orders.put(
                                        order.getOrderNumber(),
                                        order);
                }

                return orders;
        }

        private Map<String, PurchaseRecommendation> getRecommendationsFromDatabase() {

                Map<String, PurchaseRecommendation> recommendations = new HashMap<>();

                for (PurchaseRecommendation recommendation : purchaseRecommendationRepository.findAll()) {

                        if (recommendation.getCompany() != null
                                        && recommendation.getProduct() != null) {

                                recommendations.put(
                                                recommendationKey(
                                                                recommendation
                                                                                .getCompany()
                                                                                .getEmail(),

                                                                recommendation
                                                                                .getProduct()
                                                                                .getReference()),
                                                recommendation);
                        }
                }

                return recommendations;
        }

        // =========================================================
        // SUMMARY
        // =========================================================

        private void printSummary() {

                System.out.println(
                                "----------------------------------------");

                System.out.println(
                                "Companies           : "
                                                + companyRepository.count());

                System.out.println(
                                "Users               : "
                                                + appUserRepository.count());

                System.out.println(
                                "Suppliers           : "
                                                + supplierRepository.count());

                System.out.println(
                                "Products            : "
                                                + productRepository.count());

                System.out.println(
                                "Supplier products   : "
                                                + supplierProductRepository.count());

                System.out.println(
                                "Stock movements     : "
                                                + stockMovementRepository.count());

                System.out.println(
                                "Consumptions        : "
                                                + consumptionRepository.count());

                System.out.println(
                                "Purchase orders     : "
                                                + purchaseOrderRepository.count());

                System.out.println(
                                "Purchase order item : "
                                                + purchaseOrderItemRepository.count());

                System.out.println(
                                "Recommendations     : "
                                                + purchaseRecommendationRepository.count());

                System.out.println(
                                "Notifications       : "
                                                + notificationRepository.count());

                System.out.println(
                                "----------------------------------------");
        }
}