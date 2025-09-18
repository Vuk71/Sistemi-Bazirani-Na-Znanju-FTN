package com.ftn.sbnz.model.models;

public enum ContraindicationType {
    WITHDRAWAL_PERIOD("Karenca"),
    RESISTANCE("Rezistencija"),
    PHENOPHASE_RESTRICTION("Ograničenje fenofaze"),
    WEATHER_CONDITION("Vremenski uslovi"),
    CROP_COMPATIBILITY("Kompatibilnost sa kulturom"),
    CHEMICAL_INTERACTION("Hemijska interakcija");

    private final String description;

    ContraindicationType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        return description;
    }
}