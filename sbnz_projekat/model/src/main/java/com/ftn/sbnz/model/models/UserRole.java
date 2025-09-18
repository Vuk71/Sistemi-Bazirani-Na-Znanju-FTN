package com.ftn.sbnz.model.models;

public enum UserRole {
    FARMER("Poljoprivrednik"),
    AGRONOMIST("Agronom"),
    ADMIN("Administrator");

    private final String description;

    UserRole(String description) {
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