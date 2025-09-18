package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDateTime;

public class Event {
    private UUID id;
    private LocalDateTime timestamp;
    private EventType type;
    private String source;
    private Map<String, Object> attributes;
    private UUID relatedEntityId;
    private String zone;
    private boolean processed;

    public Event() {
        this.id = UUID.randomUUID();
        this.timestamp = LocalDateTime.now();
        this.attributes = new HashMap<>();
        this.processed = false;
    }

    public Event(EventType type, String source) {
        this();
        this.type = type;
        this.source = source;
    }

    public Event(EventType type, String source, Map<String, Object> attributes) {
        this(type, source);
        this.attributes = attributes;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public EventType getType() {
        return type;
    }

    public void setType(EventType type) {
        this.type = type;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Map<String, Object> getAttributes() {
        return attributes;
    }

    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public UUID getRelatedEntityId() {
        return relatedEntityId;
    }

    public void setRelatedEntityId(UUID relatedEntityId) {
        this.relatedEntityId = relatedEntityId;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public boolean isProcessed() {
        return processed;
    }

    public void setProcessed(boolean processed) {
        this.processed = processed;
    }

    public void addAttribute(String key, Object value) {
        this.attributes.put(key, value);
    }

    public Object getAttribute(String key) {
        return this.attributes.get(key);
    }

    @Override
    public String toString() {
        return "Event{" +
                "id=" + id +
                ", timestamp=" + timestamp +
                ", type=" + type +
                ", source='" + source + '\'' +
                ", zone='" + zone + '\'' +
                ", processed=" + processed +
                ", attributesCount=" + attributes.size() +
                '}';
    }
}