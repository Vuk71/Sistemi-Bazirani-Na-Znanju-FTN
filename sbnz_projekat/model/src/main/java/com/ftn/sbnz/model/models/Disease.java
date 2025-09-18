package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

public class Disease {
    private UUID id;
    private String name;
    private String pathogen;
    private List<Symptom> commonSymptoms;
    private List<Treatment> treatments;
    private double probability;

    public Disease() {
        this.id = UUID.randomUUID();
        this.commonSymptoms = new ArrayList<>();
        this.treatments = new ArrayList<>();
        this.probability = 0.0;
    }

    public Disease(String name, String pathogen) {
        this();
        this.name = name;
        this.pathogen = pathogen;
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

    public String getPathogen() {
        return pathogen;
    }

    public void setPathogen(String pathogen) {
        this.pathogen = pathogen;
    }

    public List<Symptom> getCommonSymptoms() {
        return commonSymptoms;
    }

    public void setCommonSymptoms(List<Symptom> commonSymptoms) {
        this.commonSymptoms = commonSymptoms;
    }

    public List<Treatment> getTreatments() {
        return treatments;
    }

    public void setTreatments(List<Treatment> treatments) {
        this.treatments = treatments;
    }

    public double getProbability() {
        return probability;
    }

    public void setProbability(double probability) {
        this.probability = probability;
    }

    public void increaseProbability(double increment) {
        this.probability += increment;
        if (this.probability > 100.0) {
            this.probability = 100.0;
        }
    }

    @Override
    public String toString() {
        return "Disease{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", pathogen='" + pathogen + '\'' +
                ", probability=" + probability +
                '}';
    }
}