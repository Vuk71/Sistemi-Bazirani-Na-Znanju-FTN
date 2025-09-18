package com.ftn.sbnz.model.models;

import java.util.List;
import java.util.ArrayList;

public class DiagnosisResult {
    private List<Disease> probableDiseases;
    private List<Treatment> recommendedTreatments;
    private List<String> explanations;

    public DiagnosisResult() {
        this.probableDiseases = new ArrayList<>();
        this.recommendedTreatments = new ArrayList<>();
        this.explanations = new ArrayList<>();
    }

    // Getters and Setters
    public List<Disease> getProbableDiseases() {
        return probableDiseases;
    }

    public void setProbableDiseases(List<Disease> probableDiseases) {
        this.probableDiseases = probableDiseases;
    }

    public List<Treatment> getRecommendedTreatments() {
        return recommendedTreatments;
    }

    public void setRecommendedTreatments(List<Treatment> recommendedTreatments) {
        this.recommendedTreatments = recommendedTreatments;
    }

    public List<String> getExplanations() {
        return explanations;
    }

    public void setExplanations(List<String> explanations) {
        this.explanations = explanations;
    }

    public void addExplanation(String explanation) {
        this.explanations.add(explanation);
    }

    @Override
    public String toString() {
        return "DiagnosisResult{" +
                "probableDiseases=" + probableDiseases +
                ", recommendedTreatments=" + recommendedTreatments +
                ", explanations=" + explanations +
                '}';
    }
}