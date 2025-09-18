package com.ftn.sbnz.model.models;

public enum SessionStatus {
    RUNNING("Izvršava se"),
    COMPLETED("Završena"),
    FAILED("Neuspešna"),
    CANCELLED("Otkazana");

    private final String description;

    SessionStatus(String description) {
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