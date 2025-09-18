package com.ftn.sbnz.model.models;

public enum ReportType {
    DISEASE_FREQUENCY("Učestalost bolesti"),
    TREATMENT_EFFECTIVENESS("Uspešnost tretmana"),
    ENVIRONMENTAL_CORRELATION("Korelacija uslova sredine"),
    SENSOR_DATA_ANALYSIS("Analiza senzorskih podataka"),
    CROP_PERFORMANCE("Performanse kultura"),
    RESISTANCE_TRACKING("Praćenje rezistencije"),
    COST_ANALYSIS("Analiza troškova"),
    SEASONAL_SUMMARY("Sezonski pregled");

    private final String description;

    ReportType(String description) {
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