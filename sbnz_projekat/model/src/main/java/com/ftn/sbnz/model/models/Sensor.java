package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

public class Sensor {
    private UUID id;
    private SensorType type;
    private String zone;
    private UUID greenhouseId;
    private String serialNumber;
    private double calibrationOffset;
    private List<SensorReading> readings;
    private LocalDateTime installedAt;
    private LocalDateTime lastMaintenanceAt;
    private boolean active;

    public Sensor() {
        this.id = UUID.randomUUID();
        this.readings = new ArrayList<>();
        this.installedAt = LocalDateTime.now();
        this.active = true;
        this.calibrationOffset = 0.0;
    }

    public Sensor(SensorType type, String zone, UUID greenhouseId) {
        this();
        this.type = type;
        this.zone = zone;
        this.greenhouseId = greenhouseId;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public SensorType getType() {
        return type;
    }

    public void setType(SensorType type) {
        this.type = type;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public UUID getGreenhouseId() {
        return greenhouseId;
    }

    public void setGreenhouseId(UUID greenhouseId) {
        this.greenhouseId = greenhouseId;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public double getCalibrationOffset() {
        return calibrationOffset;
    }

    public void setCalibrationOffset(double calibrationOffset) {
        this.calibrationOffset = calibrationOffset;
    }

    public List<SensorReading> getReadings() {
        return readings;
    }

    public void setReadings(List<SensorReading> readings) {
        this.readings = readings;
    }

    public LocalDateTime getInstalledAt() {
        return installedAt;
    }

    public void setInstalledAt(LocalDateTime installedAt) {
        this.installedAt = installedAt;
    }

    public LocalDateTime getLastMaintenanceAt() {
        return lastMaintenanceAt;
    }

    public void setLastMaintenanceAt(LocalDateTime lastMaintenanceAt) {
        this.lastMaintenanceAt = lastMaintenanceAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @Override
    public String toString() {
        return "Sensor{" +
                "id=" + id +
                ", type=" + type +
                ", zone='" + zone + '\'' +
                ", serialNumber='" + serialNumber + '\'' +
                ", active=" + active +
                '}';
    }
}