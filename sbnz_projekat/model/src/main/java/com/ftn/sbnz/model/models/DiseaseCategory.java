package com.ftn.sbnz.model.models;

public enum DiseaseCategory {
    LEAF_DISEASE("Bolest lista"),
    ROOT_DISEASE("Bolest korena"),
    STEM_DISEASE("Bolest stabla"),
    FRUIT_DISEASE("Bolest ploda"),
    VASCULAR_DISEASE("Vaskularna bolest"),
    SYSTEMIC_DISEASE("Sistemska bolest"),
    VIRAL_DISEASE("Virusna bolest"),
    BACTERIAL_DISEASE("Bakterijska bolest"),
    FUNGAL_DISEASE("Gljivična bolest");

    private final String description;

    DiseaseCategory(String description) {
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