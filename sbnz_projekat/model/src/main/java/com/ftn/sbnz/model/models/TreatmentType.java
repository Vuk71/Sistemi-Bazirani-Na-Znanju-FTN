package com.ftn.sbnz.model.models;

public enum TreatmentType {
    BIOLOGICAL("Biološki"),
    CHEMICAL("Hemijski"),
    SANITARY("Higijensko-sanitarne mere"),
    IRRIGATION("Navodnjavanje");

    private final String description;

    TreatmentType(String description) {
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