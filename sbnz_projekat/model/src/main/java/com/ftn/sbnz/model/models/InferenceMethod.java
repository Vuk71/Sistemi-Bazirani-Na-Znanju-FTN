package com.ftn.sbnz.model.models;

public enum InferenceMethod {
    FORWARD_CHAINING("Forward chaining"),
    BACKWARD_CHAINING("Backward chaining"),
    CEP("Complex Event Processing"),
    HYBRID("Hibridni pristup");

    private final String description;

    InferenceMethod(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public String toString() {
        return description;
    }
}