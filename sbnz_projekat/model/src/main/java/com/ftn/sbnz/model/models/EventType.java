package com.ftn.sbnz.model.models;

public enum EventType {
    SENSOR_READING("Očitavanje senzora"),
    IRRIGATION("Navodnjavanje"),
    VENTILATION("Provetravanje"),
    TREATMENT_APPLICATION("Primena tretmana"),
    SYMPTOM_REPORT("Prijava simptoma"),
    DISEASE_DETECTION("Detekcija bolesti"),
    RISK_ALERT("Upozorenje o riziku"),
    SYSTEM_ALERT("Sistemsko upozorenje"),
    USER_ACTION("Korisničke akcije"),
    MAINTENANCE("Održavanje");

    private final String description;

    EventType(String description) {
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