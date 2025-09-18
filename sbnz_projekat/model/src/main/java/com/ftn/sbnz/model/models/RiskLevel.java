package com.ftn.sbnz.model.models;

public enum RiskLevel {
    LOW("Nizak", 1),
    MEDIUM("Srednji", 2),
    HIGH("Visok", 3),
    CRITICAL("Kritičan", 4);

    private final String description;
    private final int priority;

    RiskLevel(String description, int priority) {
        this.description = description;
        this.priority = priority;
    }

    public String getDescription() {
        return description;
    }

    public int getPriority() {
        return priority;
    }

    @Override
    public String toString() {
        return description;
    }
}