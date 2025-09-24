package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDateTime;

public class RiskAlert {
    private UUID id;
    private String alertType;
    private String description;
    private RiskLevel level;
    private LocalDateTime triggeredAt;
    private String zone;
    private Map<String, Object> conditions;
    private UUID relatedEntityId;
    private AlertStatus status;
    private LocalDateTime acknowledgedAt;
    private UUID acknowledgedBy;
    private String recommendedAction;
    private RiskLevel riskLevel;
    private String message;
    private String diseaseName;
    private LocalDateTime timestamp;
    private String recommendation;

    public RiskAlert() {
        this.id = UUID.randomUUID();
        this.conditions = new HashMap<>();
        this.triggeredAt = LocalDateTime.now();
        this.status = AlertStatus.ACTIVE;
    }

    public RiskAlert(String alertType, String description, RiskLevel level, String zone) {
        this();
        this.alertType = alertType;
        this.description = description;
        this.level = level;
        this.zone = zone;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getAlertType() {
        return alertType;
    }

    public void setAlertType(String alertType) {
        this.alertType = alertType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RiskLevel getLevel() {
        return level;
    }

    public void setLevel(RiskLevel level) {
        this.level = level;
    }

    public LocalDateTime getTriggeredAt() {
        return triggeredAt;
    }

    public void setTriggeredAt(LocalDateTime triggeredAt) {
        this.triggeredAt = triggeredAt;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public Map<String, Object> getConditions() {
        return conditions;
    }

    public void setConditions(Map<String, Object> conditions) {
        this.conditions = conditions;
    }

    public UUID getRelatedEntityId() {
        return relatedEntityId;
    }

    public void setRelatedEntityId(UUID relatedEntityId) {
        this.relatedEntityId = relatedEntityId;
    }

    public AlertStatus getStatus() {
        return status;
    }

    public void setStatus(AlertStatus status) {
        this.status = status;
    }

    public LocalDateTime getAcknowledgedAt() {
        return acknowledgedAt;
    }

    public void setAcknowledgedAt(LocalDateTime acknowledgedAt) {
        this.acknowledgedAt = acknowledgedAt;
    }

    public UUID getAcknowledgedBy() {
        return acknowledgedBy;
    }

    public void setAcknowledgedBy(UUID acknowledgedBy) {
        this.acknowledgedBy = acknowledgedBy;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }

    public void addCondition(String key, Object value) {
        this.conditions.put(key, value);
    }

    public Object getCondition(String key) {
        return this.conditions.get(key);
    }

    public void acknowledge(UUID userId) {
        this.acknowledgedAt = LocalDateTime.now();
        this.acknowledgedBy = userId;
        this.status = AlertStatus.ACKNOWLEDGED;
    }

    public void resolve() {
        this.status = AlertStatus.RESOLVED;
    }

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
        this.level = riskLevel; // Keep both for compatibility
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
        this.description = message; // Keep both for compatibility
    }

    public String getDiseaseName() {
        return diseaseName;
    }

    public void setDiseaseName(String diseaseName) {
        this.diseaseName = diseaseName;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
        this.triggeredAt = timestamp; // Keep both for compatibility
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
        this.recommendedAction = recommendation; // Keep both for compatibility
    }

    @Override
    public String toString() {
        return "RiskAlert{" +
                "id=" + id +
                ", alertType='" + alertType + '\'' +
                ", level=" + level +
                ", zone='" + zone + '\'' +
                ", status=" + status +
                ", triggeredAt=" + triggeredAt +
                '}';
    }
}