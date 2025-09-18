package com.ftn.sbnz.model.models;

public enum AlertStatus {
    ACTIVE("Aktivan"),
    ACKNOWLEDGED("Potvrđen"),
    RESOLVED("Rešen"),
    DISMISSED("Odbačen");

    private final String description;

    AlertStatus(String description) {
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