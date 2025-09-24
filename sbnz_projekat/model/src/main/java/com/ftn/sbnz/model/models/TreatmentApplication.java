package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.time.LocalDateTime;
import java.time.LocalDate;

public class TreatmentApplication {
    private UUID id;
    private UUID cropId;
    private UUID treatmentId;
    private String dosage;
    private LocalDateTime appliedAt;
    private UUID appliedBy;
    private LocalDate withdrawalUntil;
    private ApplicationStatus status;
    private String notes;
    private double effectiveness; // 0-100%
    private LocalDateTime effectivenessEvaluatedAt;
    private TreatmentType treatmentType;
    private LocalDateTime applicationTime;
    private Treatment treatment;

    public TreatmentApplication() {
        this.id = UUID.randomUUID();
        this.appliedAt = LocalDateTime.now();
        this.status = ApplicationStatus.PLANNED;
        this.effectiveness = -1; // Not evaluated yet
    }

    public TreatmentApplication(UUID cropId, UUID treatmentId, String dosage, UUID appliedBy) {
        this();
        this.cropId = cropId;
        this.treatmentId = treatmentId;
        this.dosage = dosage;
        this.appliedBy = appliedBy;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getCropId() {
        return cropId;
    }

    public void setCropId(UUID cropId) {
        this.cropId = cropId;
    }

    public UUID getTreatmentId() {
        return treatmentId;
    }

    public void setTreatmentId(UUID treatmentId) {
        this.treatmentId = treatmentId;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public UUID getAppliedBy() {
        return appliedBy;
    }

    public void setAppliedBy(UUID appliedBy) {
        this.appliedBy = appliedBy;
    }

    public LocalDate getWithdrawalUntil() {
        return withdrawalUntil;
    }

    public void setWithdrawalUntil(LocalDate withdrawalUntil) {
        this.withdrawalUntil = withdrawalUntil;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public double getEffectiveness() {
        return effectiveness;
    }

    public void setEffectiveness(double effectiveness) {
        this.effectiveness = effectiveness;
    }

    public LocalDateTime getEffectivenessEvaluatedAt() {
        return effectivenessEvaluatedAt;
    }

    public void setEffectivenessEvaluatedAt(LocalDateTime effectivenessEvaluatedAt) {
        this.effectivenessEvaluatedAt = effectivenessEvaluatedAt;
    }

    public TreatmentType getTreatmentType() {
        return treatmentType;
    }

    public void setTreatmentType(TreatmentType treatmentType) {
        this.treatmentType = treatmentType;
    }

    public LocalDateTime getApplicationTime() {
        return applicationTime != null ? applicationTime : appliedAt;
    }

    public void setApplicationTime(LocalDateTime applicationTime) {
        this.applicationTime = applicationTime;
    }

    public Treatment getTreatment() {
        return treatment;
    }

    public void setTreatment(Treatment treatment) {
        this.treatment = treatment;
        if (treatment != null) {
            this.treatmentType = treatment.getType();
        }
    }

    @Override
    public String toString() {
        return "TreatmentApplication{" +
                "id=" + id +
                ", cropId=" + cropId +
                ", treatmentId=" + treatmentId +
                ", dosage='" + dosage + '\'' +
                ", appliedAt=" + appliedAt +
                ", status=" + status +
                ", effectiveness=" + effectiveness +
                '}';
    }
}