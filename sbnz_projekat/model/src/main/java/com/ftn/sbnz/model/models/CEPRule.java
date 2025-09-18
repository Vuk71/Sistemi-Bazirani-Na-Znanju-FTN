package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

public class CEPRule {
    private UUID id;
    private String name;
    private String windowType; // SLIDING, TUMBLING, SESSION
    private String windowSize; // e.g., "6h", "24h", "30min"
    private String pattern;
    private String condition;
    private String action;
    private CEPRuleType type;
    private int priority;
    private List<Event> triggeredEvents;
    private LocalDateTime createdAt;
    private boolean active;
    private int executionCount;

    public CEPRule() {
        this.id = UUID.randomUUID();
        this.triggeredEvents = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.active = true;
        this.executionCount = 0;
        this.priority = 0;
    }

    public CEPRule(String name, String windowType, String windowSize, String pattern) {
        this();
        this.name = name;
        this.windowType = windowType;
        this.windowSize = windowSize;
        this.pattern = pattern;
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

    public String getWindowType() {
        return windowType;
    }

    public void setWindowType(String windowType) {
        this.windowType = windowType;
    }

    public String getWindowSize() {
        return windowSize;
    }

    public void setWindowSize(String windowSize) {
        this.windowSize = windowSize;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public CEPRuleType getType() {
        return type;
    }

    public void setType(CEPRuleType type) {
        this.type = type;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public List<Event> getTriggeredEvents() {
        return triggeredEvents;
    }

    public void setTriggeredEvents(List<Event> triggeredEvents) {
        this.triggeredEvents = triggeredEvents;
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

    public int getExecutionCount() {
        return executionCount;
    }

    public void setExecutionCount(int executionCount) {
        this.executionCount = executionCount;
    }

    public void incrementExecutionCount() {
        this.executionCount++;
    }

    @Override
    public String toString() {
        return "CEPRule{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", windowType='" + windowType + '\'' +
                ", windowSize='" + windowSize + '\'' +
                ", type=" + type +
                ", active=" + active +
                ", executionCount=" + executionCount +
                '}';
    }
}