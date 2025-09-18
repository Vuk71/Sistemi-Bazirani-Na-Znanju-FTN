package com.ftn.sbnz.model.models;

public enum CEPRuleType {
    SLIDING_WINDOW("Klizni prozor"),
    TUMBLING_WINDOW("Preklapajući prozor"),
    SESSION_WINDOW("Sesijski prozor"),
    SEQUENCE_DETECTION("Detekcija sekvence"),
    MISSING_EVENT("Nedostajući događaj"),
    CORRELATION("Korelacija događaja");

    private final String description;

    CEPRuleType(String description) {
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