package com.ftn.sbnz.model.models;

public enum SymptomType {
    YELLOWING("Žutilo"),
    POWDERY_DEPOSITS("Praškaste naslage"),
    LESIONS("Lezije"),
    ROT("Trulež"),
    MOSAIC("Mozaik"),
    WILTING("Uvenuće"),
    BROWNING("Posmeđenje"),
    GRAY_COATING("Siva prevlaka"),
    WHITE_DEPOSITS("Bele naslage"),
    WATERY_LESIONS("Vodenaste lezije");

    private final String description;

    SymptomType(String description) {
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