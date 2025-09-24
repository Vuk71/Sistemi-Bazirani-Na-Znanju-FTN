package com.ftn.sbnz.model.events;

import java.time.LocalDateTime;
import java.util.UUID;
import org.kie.api.definition.type.Role;
import org.kie.api.definition.type.Timestamp;

@Role(Role.Type.EVENT)
@Timestamp("timestampMillis")
public class VentilationEvent {
    private UUID id;
    private UUID greenhouseId;
    private LocalDateTime timestamp;
    private boolean active;
    private int fanSpeed; // 0-100%
    private String zone;
    private String ventilationType; // roof, side, forced
    private double airFlowRate; // m³/min
    private String reason; // manual, automatic, emergency

    public VentilationEvent() {
        this.id = UUID.randomUUID();
        this.timestamp = LocalDateTime.now();
    }

    public VentilationEvent(boolean active) {
        this();
        this.active = active;
    }

    public VentilationEvent(boolean active, int fanSpeed, String zone) {
        this(active);
        this.fanSpeed = fanSpeed;
        this.zone = zone;
    }

    public VentilationEvent(boolean active, LocalDateTime timestamp) {
        this(active);
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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getFanSpeed() {
        return fanSpeed;
    }

    public void setFanSpeed(int fanSpeed) {
        this.fanSpeed = fanSpeed;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public String getVentilationType() {
        return ventilationType;
    }

    public void setVentilationType(String ventilationType) {
        this.ventilationType = ventilationType;
    }

    public double getAirFlowRate() {
        return airFlowRate;
    }

    public void setAirFlowRate(double airFlowRate) {
        this.airFlowRate = airFlowRate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    @Override
    public String toString() {
        return "VentilationEvent{" +
                "id=" + id +
                ", timestamp=" + timestamp +
                ", active=" + active +
                ", fanSpeed=" + fanSpeed +
                ", zone='" + zone + '\'' +
                ", reason='" + reason + '\'' +
                '}';
    }
}