package com.ftn.sbnz.model.models;

public enum PathogenType {
    FUNGUS("Gljiva"),
    BACTERIA("Bakterija"),
    VIRUS("Virus"),
    NEMATODE("Nematoda"),
    INSECT("Insekt"),
    PHYSIOLOGICAL("Fiziološki poremećaj");

    private final String description;

    PathogenType(String description) {
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