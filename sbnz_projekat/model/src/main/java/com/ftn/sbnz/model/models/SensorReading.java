package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.time.LocalDateTime;

public class SensorReading {
    private UUID id;
    private UUID sensorId;
    private double value;
    private LocalDateTime timestamp;
    private boolean validated;
    private String notes;

    public SensorReading() {
        this.id = UUID.randomUUID();
        this.timestamp = LocalDateTime.now();
        this.validated = true;
    }

    public SensorReading(UUID sensorId, double value) {
        this();
        this.sensorId = sensorId;
        this.value = value;
    }

    public SensorReading(UUID sensorId, double value, LocalDateTime timestamp) {
        this(sensorId, value);
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getSensorId() {
        return sensorId;
    }

    public void setSensorId(UUID sensorId) {
        this.sensorId = sensorId;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isValidated() {
        return validated;
    }

    public void setValidated(boolean validated) {
        this.validated = validated;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public String toString() {
        return "SensorReading{" +
                "id=" + id +
                ", sensorId=" + sensorId +
                ", value=" + value +
                ", timestamp=" + timestamp +
                ", validated=" + validated +
                '}';
    }
}