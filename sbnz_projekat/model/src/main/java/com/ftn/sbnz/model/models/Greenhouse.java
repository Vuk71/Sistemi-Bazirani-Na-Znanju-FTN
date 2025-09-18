package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

public class Greenhouse {
    private UUID id;
    private String name;
    private String location;
    private double surfaceAreaM2;
    private UUID ownerId;
    private List<Plot> plots;
    private List<Sensor> sensors;
    private LocalDateTime createdAt;
    private boolean active;

    public Greenhouse() {
        this.id = UUID.randomUUID();
        this.plots = new ArrayList<>();
        this.sensors = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }

    public Greenhouse(String name, String location, double surfaceAreaM2, UUID ownerId) {
        this();
        this.name = name;
        this.location = location;
        this.surfaceAreaM2 = surfaceAreaM2;
        this.ownerId = ownerId;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getSurfaceAreaM2() {
        return surfaceAreaM2;
    }

    public void setSurfaceAreaM2(double surfaceAreaM2) {
        this.surfaceAreaM2 = surfaceAreaM2;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }

    public List<Plot> getPlots() {
        return plots;
    }

    public void setPlots(List<Plot> plots) {
        this.plots = plots;
    }

    public List<Sensor> getSensors() {
        return sensors;
    }

    public void setSensors(List<Sensor> sensors) {
        this.sensors = sensors;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @Override
    public String toString() {
        return "Greenhouse{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", location='" + location + '\'' +
                ", surfaceAreaM2=" + surfaceAreaM2 +
                ", plotsCount=" + plots.size() +
                ", sensorsCount=" + sensors.size() +
                '}';
    }
}