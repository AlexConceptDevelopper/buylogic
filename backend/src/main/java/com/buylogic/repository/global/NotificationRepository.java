package com.buylogic.repository.global;

import java.util.List;
import java.util.Optional;

import com.buylogic.model.Notification;
import com.buylogic.repository.GenericRepository;

public interface NotificationRepository
        extends GenericRepository<Notification, Integer> {

    List<Notification>
    findAllByUser_IdUserAndUser_Company_IdCompany(
            Integer userId,
            Integer companyId
    );

    Optional<Notification>
    findByIdNotificationAndUser_IdUserAndUser_Company_IdCompany(
            Integer idNotification,
            Integer userId,
            Integer companyId
    );
}