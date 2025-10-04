package com.ftn.sbnz.service;

public class CEPAnalysisRequest {
    private String analysisWindow;
    private PlantData plantData;

    public CEPAnalysisRequest() {
    }

    public String getAnalysisWindow() {
        return analysisWindow;
    }

    public void setAnalysisWindow(String analysisWindow) {
        this.analysisWindow = analysisWindow;
    }

    public PlantData getPlantData() {
        return plantData;
    }

    public void setPlantData(PlantData plantData) {
        this.plantData = plantData;
    }

    public static class PlantData {
        private double temperature;
        private double humidity;
        private double co2Level;
        private boolean ventilationActive;

        public PlantData() {
        }

        public double getTemperature() {
            return temperature;
        }

        public void setTemperature(double temperature) {
            this.temperature = temperature;
        }

        public double getHumidity() {
            return humidity;
        }

        public void setHumidity(double humidity) {
            this.humidity = humidity;
        }

        public double getCo2Level() {
            return co2Level;
        }

        public void setCo2Level(double co2Level) {
            this.co2Level = co2Level;
        }

        public boolean isVentilationActive() {
            return ventilationActive;
        }

        public void setVentilationActive(boolean ventilationActive) {
            this.ventilationActive = ventilationActive;
        }
    }
}
