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

        // Si l'entreprise avait été désactivée par le soft delete de l'essai, on la
        // réactive automatiquement au paiement !
        if (!company.getActive()) {
            company.setActive(true);
            companyRepository.save(company);
        }

        subscriptionRepository.save(subscription);

        // 📝 Log d'audit pour tracer le succès du paiement et l'activation de
        // l'abonnement
        AuditLog auditLog = new AuditLog();
        auditLog.setAction("STRIPE_PAYMENT_SUCCESS");
        auditLog.setActor("StripeWebhook");
        auditLog.setIpAddress("Stripe");
        auditLog.setStatus(AuditLog.AuditStatus.SUCCESS);
        auditLog.setDetails(String.format("Paiement validé pour l'entreprise ID %d (%s). Abonnement passé à PAID.",
                company.getIdCompany(), company.getName()));
        auditLogRepository.save(auditLog);
    }

    // annuler l'abonnement Stripe en cas d'échec de paiement ou de suppression de
    // l'abonnement (supprime en fin de periode)
    public void cancelSubscription(String stripeSubscriptionId) {
        try {
            com.stripe.model.Subscription subscription = com.stripe.model.Subscription.retrieve(stripeSubscriptionId);

            com.stripe.param.SubscriptionUpdateParams params = com.stripe.param.SubscriptionUpdateParams.builder()
                    .setCancelAtPeriodEnd(true)
                    .build();

            subscription.update(params);

        } catch (com.stripe.exception.StripeException e) {
            throw new RuntimeException(
                    "Échec de la programmation de la résiliation de l'abonnement Stripe : " + e.getMessage(), e);
        }
    }

    @Transactional
    public void cancelSubscriptionForCompany(Integer companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        Subscription localSub = company.getSubscription();
        if (localSub == null || localSub.getStripeSubscriptionId() == null) {
            throw new RuntimeException("Aucun abonnement Stripe actif trouvé pour cette entreprise.");
        }

        // Appelle la méthode que tu as déjà écrite pour stopper chez Stripe
        cancelSubscription(localSub.getStripeSubscriptionId());

        // Optionnel : Tu peux aussi déclencher un log d'audit ici si tu le souhaites
    }

    @Transactional
    public void handleSubscriptionUpdated(Event event) {
        com.stripe.model.Subscription stripeSub = (com.stripe.model.Subscription) event
                .getDataObjectDeserializer().getObject().orElse(null);

        if (stripeSub == null)
            return;

        String stripeSubscriptionId = stripeSub.getId(); 

        // On cherche l'abonnement grâce à l'ID Stripe de la ligne 3
        Subscription subscription = subscriptionRepository.findByStripeSubscriptionId(stripeSubscriptionId)
                .orElse(null);

        if (subscription != null) {
            // On met à jour le statut Stripe brut et on gère la fin de période
            subscription.setStripeStatus(stripeSub.getStatus());

            if (stripeSub.getCancelAtPeriodEnd() != null && stripeSub.getCancelAtPeriodEnd()) {
                subscription.setStatus("CANCELED_PENDING");
            }

            subscriptionRepository.save(subscription);
            System.out.println("✅ Abonnement mis à jour en CANCELED_PENDING pour : " + stripeSubscriptionId);
        } else {
            System.out.println(
                    "⚠️ Aucun abonnement trouvé en base avec le stripeSubscriptionId : " + stripeSubscriptionId);
        }
    }

    @Transactional
    public void handleInvoicePaymentFailed(Event event) {
        com.stripe.model.Invoice invoice = (com.stripe.model.Invoice) event
                .getDataObjectDeserializer().getObject().orElse(null);

        if (invoice == null)
            return;

        // Récupération de l'abonnement via les lignes de facture (compatible toutes
        // versions)
        String subscriptionId = null;
        if (invoice.getLines() != null && !invoice.getLines().getData().isEmpty()) {
            try {
                subscriptionId = invoice.getLines().getData().get(0).getParent().getSubscriptionItemDetails()
                        .getSubscription();
            } catch (Exception e) {
                // Ignore si la structure diffère
            }
        }

        if (subscriptionId == null)
            return;

        Subscription subscription = subscriptionRepository.findByStripeSubscriptionId(subscriptionId).orElse(null);

        if (subscription != null) {
            subscription.setStripeStatus("past_due");
            subscription.setStatus("PAST_DUE");
            subscriptionRepository.save(subscription);

            // Désactivation automatique de l'entreprise en cas d'échec de paiement
            Company company = subscription.getCompany();
            if (company != null && company.getActive()) {
                company.setActive(false);
                companyRepository.save(company);
            }

            // 📝 Log d'audit
            AuditLog auditLog = new AuditLog();
            auditLog.setAction("STRIPE_PAYMENT_FAILED");
            auditLog.setActor("StripeWebhook");
            auditLog.setIpAddress("Stripe");
            auditLog.setStatus(AuditLog.AuditStatus.CRITICAL);
            auditLog.setDetails(
                    String.format("Échec de paiement pour l'abonnement Stripe %s. Entreprise ID %d désactivée.",
                            subscriptionId, company != null ? company.getIdCompany() : 0));
            auditLogRepository.save(auditLog);
        }
    }

    @Transactional
    public void handleSubscriptionDeleted(Event event) {
        com.stripe.model.Subscription stripeSub = (com.stripe.model.Subscription) event
                .getDataObjectDeserializer().getObject().orElse(null);

        if (stripeSub == null)
            return;

        String subscriptionId = stripeSub.getId();

        Subscription subscription = subscriptionRepository.findByStripeSubscriptionId(subscriptionId).orElse(null);

        if (subscription != null) {
            subscription.setStripeStatus("canceled");
            subscription.setStatus("CANCELED");
            subscriptionRepository.save(subscription);

            Company company = subscription.getCompany();
            if (company != null && company.getActive()) {
                company.setActive(false);
                companyRepository.save(company);
            }

            // 📝 Log d'audit
            AuditLog auditLog = new AuditLog();
            auditLog.setAction("STRIPE_SUBSCRIPTION_DELETED");
            auditLog.setActor("StripeWebhook");
            auditLog.setIpAddress("Stripe");
            auditLog.setStatus(AuditLog.AuditStatus.WARNING);
            auditLog.setDetails(String.format("Abonnement résilié sur Stripe pour l'entreprise ID %d.",
                    company != null ? company.getIdCompany() : 0));
            auditLogRepository.save(auditLog);
        }
    }
}