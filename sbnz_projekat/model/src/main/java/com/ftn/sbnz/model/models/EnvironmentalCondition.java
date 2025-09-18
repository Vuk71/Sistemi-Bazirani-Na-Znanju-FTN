package com.ftn.sbnz.model.models;

import java.time.LocalDateTime;

public class EnvironmentalCondition {
    private double temperature;
    private double humidity;
    private double co2Level;
    private boolean ventilationActive;
    private LocalDateTime timestamp;
    private String zone;

    public EnvironmentalCondition() {
        this.timestamp = LocalDateTime.now();
    }

    public EnvironmentalCondition(double temperature, double humidity) {
        this();
        this.temperature = temperature;
        this.humidity = humidity;
    }

    public EnvironmentalCondition(double temperature, double humidity, double co2Level, boolean ventilationActive) {
        this(temperature, humidity);
        this.co2Level = co2Level;
        this.ventilationActive = ventilationActive;
    }

    // Getters and Setters
    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public double getHumidity() {
        return humidity;
    }

    public void setHumidity(double humidity) {
        this.humidity = humidity;
    }

    public double getCo2Level() {
        return co2Level;
    }

    public void setCo2Level(double co2Level) {
        this.co2Level = co2Level;
    }

    public boolean isVentilationActive() {
        return ventilationActive;
    }

    public void setVentilationActive(boolean ventilationActive) {
        this.ventilationActive = ventilationActive;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    @Override
    public String toString() {
        return "EnvironmentalCondition{" +
                "temperature=" + temperature +
                ", humidity=" + humidity +
                ", co2Level=" + co2Level +
                ", ventilationActive=" + ventilationActive +
                ", timestamp=" + timestamp +
                ", zone='" + zone + '\'' +
                '}';
    }
}