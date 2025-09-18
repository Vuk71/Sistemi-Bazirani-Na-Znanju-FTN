package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.time.LocalDateTime;

public class SymptomReport {
    private UUID id;
    private UUID cropId;
    private UUID symptomId;
    private int intensity; // 1-5 scale
    private LocalDateTime reportedAt;
    private UUID reportedBy;
    private String notes;
    private String imageUrl;
    private boolean confirmed;

    public SymptomReport() {
        this.id = UUID.randomUUID();
        this.reportedAt = LocalDateTime.now();
        this.confirmed = false;
    }

    public SymptomReport(UUID cropId, UUID symptomId, int intensity, UUID reportedBy) {
        this();
        this.cropId = cropId;
        this.symptomId = symptomId;
        this.intensity = intensity;
        this.reportedBy = reportedBy;
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

    public UUID getSymptomId() {
        return symptomId;
    }

    public void setSymptomId(UUID symptomId) {
        this.symptomId = symptomId;
    }

    public int getIntensity() {
        return intensity;
    }

    public void setIntensity(int intensity) {
        if (intensity >= 1 && intensity <= 5) {
            this.intensity = intensity;
        }
    }

    public LocalDateTime getReportedAt() {
        return reportedAt;
    }

    public void setReportedAt(LocalDateTime reportedAt) {
        this.reportedAt = reportedAt;
    }

    public UUID getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(UUID reportedBy) {
        this.reportedBy = reportedBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isConfirmed() {
        return confirmed;
    }

    public void setConfirmed(boolean confirmed) {
        this.confirmed = confirmed;
    }

    @Override
    public String toString() {
        return "SymptomReport{" +
                "id=" + id +
                ", cropId=" + cropId +
                ", symptomId=" + symptomId +
                ", intensity=" + intensity +
                ", reportedAt=" + reportedAt +
                ", confirmed=" + confirmed +
                '}';
    }
}