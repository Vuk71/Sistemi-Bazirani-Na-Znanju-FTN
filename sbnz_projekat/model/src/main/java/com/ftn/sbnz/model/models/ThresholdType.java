package com.ftn.sbnz.model.models;

public enum ThresholdType {
    OPTIMAL("Optimalni opseg"),
    WARNING("Upozorenje"),
    CRITICAL("Kritični opseg"),
    DISEASE_RISK("Rizik od bolesti"),
    TREATMENT_WINDOW("Prozor za tretman"),
    PH("pH vrednost");

    private final String description;

    ThresholdType(String description) {
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