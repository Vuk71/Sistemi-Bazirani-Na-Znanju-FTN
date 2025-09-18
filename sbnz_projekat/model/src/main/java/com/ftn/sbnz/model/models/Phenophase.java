package com.ftn.sbnz.model.models;

public enum Phenophase {
    SEEDLING("Klijanac"),
    VEGETATIVE("Vegetativni rast"),
    FLOWERING("Cvetanje"),
    FRUITING("Plodonošenje"),
    MATURATION("Sazrevanje"),
    HARVEST("Berba");

    private final String description;

    Phenophase(String description) {
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