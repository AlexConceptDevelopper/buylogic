package com.buylogic.repository.global;

import java.util.List;

import com.buylogic.model.AuditLog;
import com.buylogic.repository.GenericRepository;

public interface AuditLogRepository extends GenericRepository<AuditLog, Long> {

    List<AuditLog> findAllByOrderByCreatedAtDesc();

}