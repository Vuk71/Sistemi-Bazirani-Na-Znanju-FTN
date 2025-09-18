package com.ftn.sbnz.model.models;

import java.util.UUID;

public class Crop {
    private UUID id;
    private String name;
    private String variety;
    private Phenophase phenophase;

    public Crop() {
        this.id = UUID.randomUUID();
    }

    public Crop(String name, String variety, Phenophase phenophase) {
        this();
        this.name = name;
        this.variety = variety;
        this.phenophase = phenophase;
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

    public String getVariety() {
        return variety;
    }

    public void setVariety(String variety) {
        this.variety = variety;
    }

    public Phenophase getPhenophase() {
        return phenophase;
    }

    public void setPhenophase(Phenophase phenophase) {
        this.phenophase = phenophase;
    }

    @Override
    public String toString() {
        return "Crop{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", variety='" + variety + '\'' +
                ", phenophase=" + phenophase +
                '}';
    }
}