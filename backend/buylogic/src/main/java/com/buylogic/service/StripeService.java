package com.buylogic.service;

import com.buylogic.exception.ResourceNotFoundException;
import com.buylogic.model.AuditLog;
import com.buylogic.model.Company;
import com.buylogic.model.Subscription;
import com.buylogic.repository.global.AuditLogRepository;
import com.buylogic.repository.global.CompanyRepository;
import com.buylogic.repository.global.SubscriptionRepository;
import com.stripe.Stripe;
import com.stripe.model.Event;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${stripe.price.id}")
    private String stripePriceId;

    private final CompanyRepository companyRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final AuditLogRepository auditLogRepository;

    public StripeService(
            CompanyRepository companyRepository,
            SubscriptionRepository subscriptionRepository,
            AuditLogRepository auditLogRepository) {
        this.companyRepository = companyRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @Transactional
    public String createCheckoutSession(Integer companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                    .setSuccessUrl(frontendUrl + "/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true")
                    .setCancelUrl(frontendUrl + "/dashboard?canceled=true")
                    .setCustomerEmail(company.getEmail())
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPrice(stripePriceId)
                                    .build())
                    .putMetadata("companyId", company.getIdCompany().toString())
                    .build();

            Session session = Session.create(params);

            Subscription subscription = company.getSubscription();
            if (subscription != null && session.getCustomer() != null) {
                subscription.setStripeCustomerId(session.getCustomer());
                subscriptionRepository.save(subscription);
            }

            return session.getUrl();

        } catch (StripeException e) {
            e.printStackTrace();
            throw new RuntimeException("Échec de la création de la session Stripe: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void handleCheckoutSessionCompleted(Event event) {
        com.stripe.model.checkout.Session session = (com.stripe.model.checkout.Session) event
                .getDataObjectDeserializer().getObject().orElse(null);

        if (session == null)
            return;

        String companyIdStr = session.getMetadata() != null ? session.getMetadata().get("companyId") : null;
        Subscription subscription = null;
        Company company = null;

        if (companyIdStr != null) {
            Integer companyId = Integer.parseInt(companyIdStr);
            company = companyRepository.findById(companyId).orElse(null);
            if (company != null) {
                subscription = company.getSubscription();
            }
        } else if (session.getCustomerEmail() != null) {
            company = companyRepository.findByEmail(session.getCustomerEmail()).orElse(null);
            if (company != null) {
                subscription = company.getSubscription();
            }
        }

        if (subscription == null || company == null) {
            return;
        }

        subscription.setStripeCustomerId(session.getCustomer());
        subscription.setStripeSubscriptionId(session.getSubscription());
        subscription.setStripeStatus("active");
        subscription.setStatus("PAID");

        // Si l'entreprise avait été désactivée par le soft delete de l'essai, on la réactive automatiquement au paiement !
        if (!company.getActive()) {
            company.setActive(true);
            companyRepository.save(company);
        }

        subscriptionRepository.save(subscription);

        // 📝 Log d'audit pour tracer le succès du paiement et l'activation de l'abonnement
        AuditLog auditLog = new AuditLog();
        auditLog.setAction("STRIPE_PAYMENT_SUCCESS");
        auditLog.setActor("StripeWebhook");
        auditLog.setIpAddress("Stripe");
        auditLog.setStatus(AuditLog.AuditStatus.SUCCESS);
        auditLog.setDetails(String.format("Paiement validé pour l'entreprise ID %d (%s). Abonnement passé à PAID.", 
                company.getIdCompany(), company.getName()));
        auditLogRepository.save(auditLog);
    }
}