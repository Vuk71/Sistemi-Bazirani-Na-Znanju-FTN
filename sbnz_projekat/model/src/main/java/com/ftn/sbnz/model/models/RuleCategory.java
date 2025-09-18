package com.ftn.sbnz.model.models;

public enum RuleCategory {
    DISEASE_DETECTION("Detekcija bolesti"),
    TREATMENT_RECOMMENDATION("Preporuka tretmana"),
    ENVIRONMENTAL_MONITORING("Praćenje uslova sredine"),
    RESISTANCE_MANAGEMENT("Upravljanje rezistencijom"),
    WITHDRAWAL_PERIOD("Karenca"),
    PREVENTIVE_MEASURES("Preventivne mere"),
    CEP_RULES("CEP pravila"),
    VALIDATION("Validacija");

    private final String description;

    RuleCategory(String description) {
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