package com.ftn.sbnz.model.models;

public enum SensorType {
    TEMPERATURE("Temperatura", "°C"),
    HUMIDITY("Vlažnost vazduha", "%"),
    CO2("Ugljen-dioksid", "ppm"),
    LIGHT("Svetlost", "lux"),
    DEW_POINT("Tačka rose", "°C"),
    AIR_VELOCITY("Brzina vazduha", "m/s"),
    SOIL_MOISTURE("Vlažnost zemljišta", "%"),
    SOIL_PH("pH zemljišta", "pH"),
    SOIL_TEMPERATURE("Temperatura zemljišta", "°C");

    private final String description;
    private final String unit;

    SensorType(String description, String unit) {
        this.description = description;
        this.unit = unit;
    }

    public String getDescription() {
        return description;
    }

    public String getUnit() {
        return unit;
    }

    @Override
    public String toString() {
        return description + " (" + unit + ")";
    }
}