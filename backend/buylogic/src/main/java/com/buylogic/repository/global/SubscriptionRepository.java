package com.buylogic.repository.global;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.buylogic.model.Subscription;
import com.buylogic.repository.GenericRepository;

public interface SubscriptionRepository extends GenericRepository<Subscription, Integer> {

    Optional<Subscription> findByCompany_IdCompany(Integer companyId);

    Optional<Subscription> findByStripeCustomerId(String stripeCustomerId);

    List<Subscription> findByStatusAndTrialEndBefore(String status, LocalDateTime date);
}