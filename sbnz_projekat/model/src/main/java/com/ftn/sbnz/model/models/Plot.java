package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

public class Plot {
    private UUID id;
    private String designation;
    private UUID greenhouseId;
    private double areaM2;
    private List<Crop> crops;
    private LocalDateTime createdAt;
    private boolean active;

    public Plot() {
        this.id = UUID.randomUUID();
        this.crops = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }

    public Plot(String designation, UUID greenhouseId, double areaM2) {
        this();
        this.designation = designation;
        this.greenhouseId = greenhouseId;
        this.areaM2 = areaM2;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public UUID getGreenhouseId() {
        return greenhouseId;
    }

    public void setGreenhouseId(UUID greenhouseId) {
        this.greenhouseId = greenhouseId;
    }

    public double getAreaM2() {
        return areaM2;
    }

    public void setAreaM2(double areaM2) {
        this.areaM2 = areaM2;
    }

    public List<Crop> getCrops() {
        return crops;
    }

    public void setCrops(List<Crop> crops) {
        this.crops = crops;
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
        return "Plot{" +
                "id=" + id +
                ", designation='" + designation + '\'' +
                ", areaM2=" + areaM2 +
                ", cropsCount=" + crops.size() +
                '}';
    }
}