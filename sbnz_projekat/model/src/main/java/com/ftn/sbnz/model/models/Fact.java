package com.ftn.sbnz.model.models;

import java.util.List;
import java.util.ArrayList;
import java.util.UUID;
import java.time.LocalDateTime;

/**
 * Predstavlja činjenicu u stablo činjenica za backward chaining
 */
public class Fact {
    private UUID id;
    private String type;
    private String subject;
    private String description;
    private List<String> evidence;
    private LocalDateTime createdAt;
    private boolean derived; // Da li je izvedena iz drugih činjenica

    public Fact() {
        this.id = UUID.randomUUID();
        this.evidence = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.derived = false;
    }

    public Fact(String type, String subject, String description) {
        this();
        this.type = type;
        this.subject = subject;
        this.description = description;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getEvidence() {
        return evidence;
    }

    public void setEvidence(List<String> evidence) {
        this.evidence = evidence;
    }

    public void addEvidence(String evidence) {
        this.evidence.add(evidence);
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isDerived() {
        return derived;
    }

    public void setDerived(boolean derived) {
        this.derived = derived;
    }

    @Override
    public String toString() {
        return "Fact{" +
                "type='" + type + '\'' +
                ", subject='" + subject + '\'' +
                ", description='" + description + '\'' +
                ", evidence=" + evidence.size() + " items" +
                ", derived=" + derived +
                '}';
    }
}