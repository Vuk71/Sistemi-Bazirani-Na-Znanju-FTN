package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

public class Treatment {
    private UUID id;
    private String name;
    private TreatmentType type;
    private String dosage;
    private int withdrawalDays;
    private String modeOfAction;
    private boolean recommended;
    private String activeIngredient;
    private String manufacturer;
    private double costPerUnit;
    private String applicationMethod;
    private List<Contraindication> contraindications;
    private List<Phenophase> allowedPhenophases;
    private LocalDateTime createdAt;
    private boolean active;
    private String recommendationReason;
    private boolean blocked;
    private String blockReason;
    private int priority;

    public Treatment() {
        this.id = UUID.randomUUID();
        this.recommended = false;
        this.contraindications = new ArrayList<>();
        this.allowedPhenophases = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }

    public Treatment(String name, TreatmentType type) {
        this();
        this.name = name;
        this.type = type;
    }

    public Treatment(String name, TreatmentType type, String dosage, int withdrawalDays, String modeOfAction) {
        this(name, type);
        this.dosage = dosage;
        this.withdrawalDays = withdrawalDays;
        this.modeOfAction = modeOfAction;
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

    public TreatmentType getType() {
        return type;
    }

    public void setType(TreatmentType type) {
        this.type = type;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public int getWithdrawalDays() {
        return withdrawalDays;
    }

    public void setWithdrawalDays(int withdrawalDays) {
        this.withdrawalDays = withdrawalDays;
    }

    public int getWithdrawalPeriod() {
        return withdrawalDays;
    }

    public void setWithdrawalPeriod(int withdrawalPeriod) {
        this.withdrawalDays = withdrawalPeriod;
    }

    public String getModeOfAction() {
        return modeOfAction;
    }

    public void setModeOfAction(String modeOfAction) {
        this.modeOfAction = modeOfAction;
    }

    public boolean isRecommended() {
        return recommended;
    }

    public void setRecommended(boolean recommended) {
        this.recommended = recommended;
    }

    public String getActiveIngredient() {
        return activeIngredient;
    }

    public void setActiveIngredient(String activeIngredient) {
        this.activeIngredient = activeIngredient;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public double getCostPerUnit() {
        return costPerUnit;
    }

    public void setCostPerUnit(double costPerUnit) {
        this.costPerUnit = costPerUnit;
    }

    public String getApplicationMethod() {
        return applicationMethod;
    }

    public void setApplicationMethod(String applicationMethod) {
        this.applicationMethod = applicationMethod;
    }

    public List<Contraindication> getContraindications() {
        return contraindications;
    }

    public void setContraindications(List<Contraindication> contraindications) {
        this.contraindications = contraindications;
    }

    public List<Phenophase> getAllowedPhenophases() {
        return allowedPhenophases;
    }

    public void setAllowedPhenophases(List<Phenophase> allowedPhenophases) {
        this.allowedPhenophases = allowedPhenophases;
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

    public String getRecommendationReason() {
        return recommendationReason;
    }

    public void setRecommendationReason(String recommendationReason) {
        this.recommendationReason = recommendationReason;
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }

    public String getBlockReason() {
        return blockReason;
    }

    public void setBlockReason(String blockReason) {
        this.blockReason = blockReason;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public boolean isAllowedInPhenophase(Phenophase phenophase) {
        return allowedPhenophases.isEmpty() || allowedPhenophases.contains(phenophase);
    }

    @Override
    public String toString() {
        return "Treatment{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type=" + type +
                ", dosage='" + dosage + '\'' +
                ", withdrawalDays=" + withdrawalDays +
                ", modeOfAction='" + modeOfAction + '\'' +
                ", recommended=" + recommended +
                ", active=" + active +
                '}';
    }
}