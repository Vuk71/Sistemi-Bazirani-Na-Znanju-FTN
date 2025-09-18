package com.ftn.sbnz.model.models;

public enum ReportStatus {
    GENERATING("Generiše se"),
    COMPLETED("Završen"),
    FAILED("Neuspešan"),
    CANCELLED("Otkazan");

    private final String description;

    ReportStatus(String description) {
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