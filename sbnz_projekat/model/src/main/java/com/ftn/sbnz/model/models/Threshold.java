package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.time.LocalDateTime;

public class Threshold {
    private UUID id;
    private String metric;
    private String range;
    private Phenophase phenophase;
    private String cropType;
    private double minValue;
    private double maxValue;
    private ThresholdType type;
    private UUID knowledgeBaseId;
    private LocalDateTime createdAt;
    private boolean active;

    public Threshold() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }

    public Threshold(String metric, double minValue, double maxValue, ThresholdType type) {
        this();
        this.metric = metric;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.type = type;
        this.range = minValue + "-" + maxValue;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getMetric() {
        return metric;
    }

    public void setMetric(String metric) {
        this.metric = metric;
    }

    public String getRange() {
        return range;
    }

    public void setRange(String range) {
        this.range = range;
    }

    public Phenophase getPhenophase() {
        return phenophase;
    }

    public void setPhenophase(Phenophase phenophase) {
        this.phenophase = phenophase;
    }

    public String getCropType() {
        return cropType;
    }

    public void setCropType(String cropType) {
        this.cropType = cropType;
    }

    public double getMinValue() {
        return minValue;
    }

    public void setMinValue(double minValue) {
        this.minValue = minValue;
    }

    public double getMaxValue() {
        return maxValue;
    }

    public void setMaxValue(double maxValue) {
        this.maxValue = maxValue;
    }

    public ThresholdType getType() {
        return type;
    }

    public void setType(ThresholdType type) {
        this.type = type;
    }

    public UUID getKnowledgeBaseId() {
        return knowledgeBaseId;
    }

    public void setKnowledgeBaseId(UUID knowledgeBaseId) {
        this.knowledgeBaseId = knowledgeBaseId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isInRange(double value) {
        return value >= minValue && value <= maxValue;
    }

    @Override
    public String toString() {
        return "Threshold{" +
                "id=" + id +
                ", metric='" + metric + '\'' +
                ", range='" + range + '\'' +
                ", cropType='" + cropType + '\'' +
                ", phenophase=" + phenophase +
                ", type=" + type +
                '}';
    }
}