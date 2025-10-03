package com.ftn.sbnz.service;

public class DiagnosisRequest {
    private String cropType;
    private String variety;
    private String phenophase;
    private double temperature;
    private double humidity;
    private double co2Level;
    private boolean ventilationActive;
    
    // Simptomi
    private boolean vodenasteLezioni;
    private boolean tamneMarlje;
    private boolean belePrevlake;
    private boolean sivaPrevlaka;
    private boolean zutilo;
    private boolean uvenuće;
    private boolean posmeđenjeZila;
    private boolean mozaikSare;
    
    // Getters and Setters
    public String getCropType() { return cropType; }
    public void setCropType(String cropType) { this.cropType = cropType; }
    
    public String getVariety() { return variety; }
    public void setVariety(String variety) { this.variety = variety; }
    
    public String getPhenophase() { return phenophase; }
    public void setPhenophase(String phenophase) { this.phenophase = phenophase; }
    
    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }
    
    public double getHumidity() { return humidity; }
    public void setHumidity(double humidity) { this.humidity = humidity; }
    
    public double getCo2Level() { return co2Level; }
    public void setCo2Level(double co2Level) { this.co2Level = co2Level; }
    
    public boolean isVentilationActive() { return ventilationActive; }
    public void setVentilationActive(boolean ventilationActive) { this.ventilationActive = ventilationActive; }
    
    public boolean isVodenasteLezioni() { return vodenasteLezioni; }
    public void setVodenasteLezioni(boolean vodenasteLezioni) { this.vodenasteLezioni = vodenasteLezioni; }
    
    public boolean isTamneMarlje() { return tamneMarlje; }
    public void setTamneMarlje(boolean tamneMarlje) { this.tamneMarlje = tamneMarlje; }
    
    public boolean isBelePrevlake() { return belePrevlake; }
    public void setBelePrevlake(boolean belePrevlake) { this.belePrevlake = belePrevlake; }
    
    public boolean isSivaPrevlaka() { return sivaPrevlaka; }
    public void setSivaPrevlaka(boolean sivaPrevlaka) { this.sivaPrevlaka = sivaPrevlaka; }
    
    public boolean isZutilo() { return zutilo; }
    public void setZutilo(boolean zutilo) { this.zutilo = zutilo; }
    
    public boolean isUvenuće() { return uvenuće; }
    public void setUvenuće(boolean uvenuće) { this.uvenuće = uvenuće; }
    
    public boolean isPosmeđenjeZila() { return posmeđenjeZila; }
    public void setPosmeđenjeZila(boolean posmeđenjeZila) { this.posmeđenjeZila = posmeđenjeZila; }
    
    public boolean isMozaikSare() { return mozaikSare; }
    public void setMozaikSare(boolean mozaikSare) { this.mozaikSare = mozaikSare; }
}
