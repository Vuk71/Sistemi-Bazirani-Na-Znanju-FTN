package com.ftn.sbnz.model.models;

import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

public class InferenceSession {
    private UUID sessionId;
    private InferenceMethod method;
    private String ruleTrace;
    private UUID knowledgeBaseId;
    private List<Object> inputFacts;
    private List<Object> outputFacts;
    private List<String> firedRules;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private SessionStatus status;
    private String errorMessage;
    private int rulesExecuted;

    public InferenceSession() {
        this.sessionId = UUID.randomUUID();
        this.inputFacts = new ArrayList<>();
        this.outputFacts = new ArrayList<>();
        this.firedRules = new ArrayList<>();
        this.startedAt = LocalDateTime.now();
        this.status = SessionStatus.RUNNING;
        this.rulesExecuted = 0;
    }

    public InferenceSession(InferenceMethod method, UUID knowledgeBaseId) {
        this();
        this.method = method;
        this.knowledgeBaseId = knowledgeBaseId;
    }

    // Getters and Setters
    public UUID getSessionId() {
        return sessionId;
    }

    public void setSessionId(UUID sessionId) {
        this.sessionId = sessionId;
    }

    public InferenceMethod getMethod() {
        return method;
    }

    public void setMethod(InferenceMethod method) {
        this.method = method;
    }

    public String getRuleTrace() {
        return ruleTrace;
    }

    public void setRuleTrace(String ruleTrace) {
        this.ruleTrace = ruleTrace;
    }

    public UUID getKnowledgeBaseId() {
        return knowledgeBaseId;
    }

    public void setKnowledgeBaseId(UUID knowledgeBaseId) {
        this.knowledgeBaseId = knowledgeBaseId;
    }

    public List<Object> getInputFacts() {
        return inputFacts;
    }

    public void setInputFacts(List<Object> inputFacts) {
        this.inputFacts = inputFacts;
    }

    public List<Object> getOutputFacts() {
        return outputFacts;
    }

    public void setOutputFacts(List<Object> outputFacts) {
        this.outputFacts = outputFacts;
    }

    public List<String> getFiredRules() {
        return firedRules;
    }

    public void setFiredRules(List<String> firedRules) {
        this.firedRules = firedRules;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public int getRulesExecuted() {
        return rulesExecuted;
    }

    public void setRulesExecuted(int rulesExecuted) {
        this.rulesExecuted = rulesExecuted;
    }

    public void addInputFact(Object fact) {
        this.inputFacts.add(fact);
    }

    public void addOutputFact(Object fact) {
        this.outputFacts.add(fact);
    }

    public void addFiredRule(String ruleName) {
        this.firedRules.add(ruleName);
        this.rulesExecuted++;
    }

    public void complete() {
        this.completedAt = LocalDateTime.now();
        this.status = SessionStatus.COMPLETED;
    }

    public void fail(String errorMessage) {
        this.completedAt = LocalDateTime.now();
        this.status = SessionStatus.FAILED;
        this.errorMessage = errorMessage;
    }

    @Override
    public String toString() {
        return "InferenceSession{" +
                "sessionId=" + sessionId +
                ", method=" + method +
                ", status=" + status +
                ", rulesExecuted=" + rulesExecuted +
                ", startedAt=" + startedAt +
                ", completedAt=" + completedAt +
                '}';
    }
}