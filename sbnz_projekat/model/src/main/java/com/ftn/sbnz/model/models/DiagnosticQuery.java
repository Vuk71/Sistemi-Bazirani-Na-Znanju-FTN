package com.ftn.sbnz.model.models;

import java.util.List;
import java.util.ArrayList;
import java.util.UUID;
import java.time.LocalDateTime;

public class DiagnosticQuery {
    private UUID id;
    private String queryType;
    private String diseaseName;
    private String treatmentName;
    private Phenophase phenophase;
    private String result;
    private List<String> explanation;
    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;
    private boolean answered;

    public DiagnosticQuery() {
        this.id = UUID.randomUUID();
        this.explanation = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.answered = false;
    }

    public DiagnosticQuery(String queryType) {
        this();
        this.queryType = queryType;
    }

    public DiagnosticQuery(String queryType, String diseaseName) {
        this(queryType);
        this.diseaseName = diseaseName;
    }

    public DiagnosticQuery(String queryType, String treatmentName, Phenophase phenophase) {
        this(queryType);
        this.treatmentName = treatmentName;
        this.phenophase = phenophase;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getQueryType() {
        return queryType;
    }

    public void setQueryType(String queryType) {
        this.queryType = queryType;
    }

    public String getDiseaseName() {
        return diseaseName;
    }

    public void setDiseaseName(String diseaseName) {
        this.diseaseName = diseaseName;
    }

    public String getTreatmentName() {
        return treatmentName;
    }

    public void setTreatmentName(String treatmentName) {
        this.treatmentName = treatmentName;
    }

    public Phenophase getPhenophase() {
        return phenophase;
    }

    public void setPhenophase(Phenophase phenophase) {
        this.phenophase = phenophase;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
        this.answered = true;
        this.answeredAt = LocalDateTime.now();
    }

    public List<String> getExplanation() {
        return explanation;
    }

    public void setExplanation(List<String> explanation) {
        this.explanation = explanation;
    }

    public void addExplanation(String explanation) {
        this.explanation.add(explanation);
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getAnsweredAt() {
        return answeredAt;
    }

    public void setAnsweredAt(LocalDateTime answeredAt) {
        this.answeredAt = answeredAt;
    }

    public boolean isAnswered() {
        return answered;
    }

    public void setAnswered(boolean answered) {
        this.answered = answered;
    }

    @Override
    public String toString() {
        return "DiagnosticQuery{" +
                "id=" + id +
                ", queryType='" + queryType + '\'' +
                ", diseaseName='" + diseaseName + '\'' +
                ", treatmentName='" + treatmentName + '\'' +
                ", phenophase=" + phenophase +
                ", result='" + result + '\'' +
                ", answered=" + answered +
                '}';
    }
}