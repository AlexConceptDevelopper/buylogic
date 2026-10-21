package com.buylogic.dto;

import com.buylogic.model.AuditLog;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
public class AuditLogResponseDto {

    private final Long id;
    private final String timestamp;
    private final String action;
    private final String actor;
    private final String ipAddress;
    private final String status;
    private final String details;

    public AuditLogResponseDto(AuditLog log) {
        this.id = log.getId();
        this.timestamp = log.getCreatedAt() != null 
            ? log.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) 
            : "";
        this.action = log.getAction();
        this.actor = log.getActor();
        this.ipAddress = log.getIpAddress() != null ? log.getIpAddress() : "N/A";
        this.status = log.getStatus() != null ? log.getStatus().name() : "SUCCESS";
        this.details = log.getDetails();
    }
}