package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

public class Disease {
    private UUID id;
    private String name;
    private String pathogen;
    private PathogenType pathogenType;
    private List<Symptom> commonSymptoms;
    private List<Treatment> treatments;
    private double probability;
    private String description;
    private List<String> affectedCrops;
    private DiseaseCategory category;
    private double economicImpact; // 0-100%
    private LocalDateTime createdAt;
    private boolean active;

    public Disease() {
        this.id = UUID.randomUUID();
        this.commonSymptoms = new ArrayList<>();
        this.treatments = new ArrayList<>();
        this.affectedCrops = new ArrayList<>();
        this.probability = 0.0;
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }

    public Disease(String name, String pathogen) {
        this();
        this.name = name;
        this.pathogen = pathogen;
    }

    public Disease(String name, String pathogen, PathogenType pathogenType) {
        this(name, pathogen);
        this.pathogenType = pathogenType;
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

    public String getPathogen() {
        return pathogen;
    }

    public void setPathogen(String pathogen) {
        this.pathogen = pathogen;
    }

    public PathogenType getPathogenType() {
        return pathogenType;
    }

    public void setPathogenType(PathogenType pathogenType) {
        this.pathogenType = pathogenType;
    }

    public List<Symptom> getCommonSymptoms() {
        return commonSymptoms;
    }

    public void setCommonSymptoms(List<Symptom> commonSymptoms) {
        this.commonSymptoms = commonSymptoms;
    }

    public List<Treatment> getTreatments() {
        return treatments;
    }

    public void setTreatments(List<Treatment> treatments) {
        this.treatments = treatments;
    }

    public double getProbability() {
        return probability;
    }

    public void setProbability(double probability) {
        this.probability = probability;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getAffectedCrops() {
        return affectedCrops;
    }

    public void setAffectedCrops(List<String> affectedCrops) {
        this.affectedCrops = affectedCrops;
    }

    public DiseaseCategory getCategory() {
        return category;
    }

    public void setCategory(DiseaseCategory category) {
        this.category = category;
    }

    public double getEconomicImpact() {
        return economicImpact;
    }

    public void setEconomicImpact(double economicImpact) {
        this.economicImpact = economicImpact;
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

    public void increaseProbability(double increment) {
        this.probability += increment;
        if (this.probability > 100.0) {
            this.probability = 100.0;
        }
    }

    public void resetProbability() {
        this.probability = 0.0;
    }

    public boolean affectsCrop(String cropName) {
        return affectedCrops.isEmpty() || affectedCrops.contains(cropName);
    }

    @Override
    public String toString() {
        return "Disease{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", pathogen='" + pathogen + '\'' +
                ", pathogenType=" + pathogenType +
                ", probability=" + probability +
                ", category=" + category +
                ", active=" + active +
                '}';
    }
}