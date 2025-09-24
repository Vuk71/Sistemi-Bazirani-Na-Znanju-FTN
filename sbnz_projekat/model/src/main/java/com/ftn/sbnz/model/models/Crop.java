package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Crop {
    private UUID id;
    private String name;
    private String variety;
    private Phenophase phenophase;
    private UUID plotId;
    private LocalDate plantedDate;
    private LocalDate expectedHarvestDate;
    private List<SymptomReport> symptomReports;
    private List<TreatmentApplication> treatmentApplications;
    private LocalDateTime createdAt;
    private boolean active;

    public Crop() {
        this.id = UUID.randomUUID();
        this.symptomReports = new ArrayList<>();
        this.treatmentApplications = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }

    public Crop(String name, String variety, Phenophase phenophase) {
        this();
        this.name = name;
        this.variety = variety;
        this.phenophase = phenophase;
    }

    public Crop(String name, String variety, Phenophase phenophase, UUID plotId) {
        this();
        this.name = name;
        this.variety = variety;
        this.phenophase = phenophase;
        this.plotId = plotId;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVariety() {
        return variety;
    }

    public void setVariety(String variety) {
        this.variety = variety;
    }

    public Phenophase getPhenophase() {
        return phenophase;
    }

    public void setPhenophase(Phenophase phenophase) {
        this.phenophase = phenophase;
    }

    public UUID getPlotId() {
        return plotId;
    }

    public void setPlotId(UUID plotId) {
        this.plotId = plotId;
    }

    public LocalDate getPlantedDate() {
        return plantedDate;
    }

    public void setPlantedDate(LocalDate plantedDate) {
        this.plantedDate = plantedDate;
    }

    public LocalDate getExpectedHarvestDate() {
        return expectedHarvestDate;
    }

    public void setExpectedHarvestDate(LocalDate expectedHarvestDate) {
        this.expectedHarvestDate = expectedHarvestDate;
    }

    public LocalDate getPlannedHarvestDate() {
        return expectedHarvestDate;
    }

    public void setPlannedHarvestDate(LocalDate plannedHarvestDate) {
        this.expectedHarvestDate = plannedHarvestDate;
    }

    public List<SymptomReport> getSymptomReports() {
        return symptomReports;
    }

    public void setSymptomReports(List<SymptomReport> symptomReports) {
        this.symptomReports = symptomReports;
    }

    public List<TreatmentApplication> getTreatmentApplications() {
        return treatmentApplications;
    }

    public void setTreatmentApplications(List<TreatmentApplication> treatmentApplications) {
        this.treatmentApplications = treatmentApplications;
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

    @Override
    public String toString() {
        return "Crop{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", variety='" + variety + '\'' +
                ", phenophase=" + phenophase +
                ", plantedDate=" + plantedDate +
                '}';
    }
}