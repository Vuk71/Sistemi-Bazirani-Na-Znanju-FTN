package com.ftn.sbnz.model.models;

import java.util.UUID;

public class Symptom {
    private UUID id;
    private String name;
    private String description;
    private SymptomType type;
    private int severity; // 1-5 scale
    private boolean present;

    public Symptom() {
        this.id = UUID.randomUUID();
        this.present = false;
        this.severity = 1;
    }

    public Symptom(String name, SymptomType type) {
        this();
        this.name = name;
        this.type = type;
    }

    public Symptom(String name, SymptomType type, String description) {
        this(name, type);
        this.description = description;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public SymptomType getType() {
        return type;
    }

    public void setType(SymptomType type) {
        this.type = type;
    }

    public int getSeverity() {
        return severity;
    }

    public void setSeverity(int severity) {
        if (severity >= 1 && severity <= 5) {
            this.severity = severity;
        }
    }

    public boolean isPresent() {
        return present;
    }

    public void setPresent(boolean present) {
        this.present = present;
    }

    @Override
    public String toString() {
        return "Symptom{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type=" + type +
                ", severity=" + severity +
                ", present=" + present +
                '}';
    }
}