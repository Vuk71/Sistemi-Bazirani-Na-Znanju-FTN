package com.ftn.sbnz.model.models;

import java.util.UUID;

public class Contraindication {
    private UUID id;
    private String description;
    private ContraindicationType type;
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL
    private String conditions;
    private String treatmentName;
    private Phenophase phenophase;

    public Contraindication() {
        this.id = UUID.randomUUID();
    }

    public Contraindication(String description, ContraindicationType type, String severity) {
        this();
        this.description = description;
        this.type = type;
        this.severity = severity;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ContraindicationType getType() {
        return type;
    }

    public void setType(ContraindicationType type) {
        this.type = type;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getConditions() {
        return conditions;
    }

    public void setConditions(String conditions) {
        this.conditions = conditions;
    }

    public String getTreatmentName() {
        return treatmentName;
    }

    public void setTreatmentName(String treatmentName) {
        this.treatmentName = treatmentName;
    }

    public Phenophase getPhenophase() {
        return phenophase;
    }

    public void setPhenophase(Phenophase phenophase) {
        this.phenophase = phenophase;
    }

    @Override
    public String toString() {
        return "Contraindication{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", type=" + type +
                ", severity='" + severity + '\'' +
                '}';
    }
}