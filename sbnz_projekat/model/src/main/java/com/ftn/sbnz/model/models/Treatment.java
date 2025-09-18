package com.ftn.sbnz.model.models;

import java.util.UUID;

public class Treatment {
    private UUID id;
    private String name;
    private TreatmentType type;
    private String dosage;
    private int withdrawalDays;
    private String modeOfAction;
    private boolean recommended;

    public Treatment() {
        this.id = UUID.randomUUID();
        this.recommended = false;
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
                '}';
    }
}