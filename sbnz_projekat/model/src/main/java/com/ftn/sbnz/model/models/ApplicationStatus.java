package com.ftn.sbnz.model.models;

public enum ApplicationStatus {
    PLANNED("Planirano"),
    APPLIED("Primenjeno"),
    CANCELLED("Otkazano"),
    COMPLETED("Završeno");

    private final String description;

    ApplicationStatus(String description) {
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