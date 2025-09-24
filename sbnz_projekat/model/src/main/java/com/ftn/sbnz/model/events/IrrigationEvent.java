package com.ftn.sbnz.model.events;

import java.time.LocalDateTime;
import java.util.UUID;
import org.kie.api.definition.type.Role;
import org.kie.api.definition.type.Timestamp;

@Role(Role.Type.EVENT)
@Timestamp("timestampMillis")
public class IrrigationEvent {
    private UUID id;
    private UUID greenhouseId;
    private UUID plotId;
    private LocalDateTime timestamp;
    private double waterAmount; // liters
    private int duration; // minutes
    private String zone;
    private boolean active;
    private String irrigationType; // drip, sprinkler, manual

    public IrrigationEvent() {
        this.id = UUID.randomUUID();
        this.timestamp = LocalDateTime.now();
        this.active = true;
    }

    public IrrigationEvent(UUID plotId, double waterAmount, int duration) {
        this();
        this.plotId = plotId;
        this.waterAmount = waterAmount;
        this.duration = duration;
    }

    public IrrigationEvent(UUID plotId, double waterAmount, int duration, LocalDateTime timestamp) {
        this(plotId, waterAmount, duration);
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getGreenhouseId() {
        return greenhouseId;
    }

    public void setGreenhouseId(UUID greenhouseId) {
        this.greenhouseId = greenhouseId;
    }

    public UUID getPlotId() {
        return plotId;
    }

    public void setPlotId(UUID plotId) {
        this.plotId = plotId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public long getTimestampMillis() {
        return timestamp != null ? 
            timestamp.atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli() : 
            System.currentTimeMillis();
    }

    public double getWaterAmount() {
        return waterAmount;
    }

    public void setWaterAmount(double waterAmount) {
        this.waterAmount = waterAmount;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getIrrigationType() {
        return irrigationType;
    }

    public void setIrrigationType(String irrigationType) {
        this.irrigationType = irrigationType;
    }

    @Override
    public String toString() {
        return "IrrigationEvent{" +
                "id=" + id +
                ", plotId=" + plotId +
                ", timestamp=" + timestamp +
                ", waterAmount=" + waterAmount +
                ", duration=" + duration +
                ", zone='" + zone + '\'' +
                ", active=" + active +
                '}';
    }
}