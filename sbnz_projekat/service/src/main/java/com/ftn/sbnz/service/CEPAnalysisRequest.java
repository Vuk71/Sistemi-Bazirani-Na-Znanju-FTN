package com.ftn.sbnz.service;

public class CEPAnalysisRequest {
    private String analysisWindow;
    private AlertThresholds alertThresholds;
    
    public CEPAnalysisRequest() {}
    
    public String getAnalysisWindow() {
        return analysisWindow;
    }
    
    public void setAnalysisWindow(String analysisWindow) {
        this.analysisWindow = analysisWindow;
    }
    
    public AlertThresholds getAlertThresholds() {
        return alertThresholds;
    }
    
    public void setAlertThresholds(AlertThresholds alertThresholds) {
        this.alertThresholds = alertThresholds;
    }
    
    public static class AlertThresholds {
        private double humidity;
        private TemperatureRange temperature;
        private int ventilationTimeout;
        
        public AlertThresholds() {}
        
        public double getHumidity() {
            return humidity;
        }
        
        public void setHumidity(double humidity) {
            this.humidity = humidity;
        }
        
        public TemperatureRange getTemperature() {
            return temperature;
        }
        
        public void setTemperature(TemperatureRange temperature) {
            this.temperature = temperature;
        }
        
        public int getVentilationTimeout() {
            return ventilationTimeout;
        }
        
        public void setVentilationTimeout(int ventilationTimeout) {
            this.ventilationTimeout = ventilationTimeout;
        }
    }
    
    public static class TemperatureRange {
        private double min;
        private double max;
        
        public TemperatureRange() {}
        
        public double getMin() {
            return min;
        }
        
        public void setMin(double min) {
            this.min = min;
        }
        
        public double getMax() {
            return max;
        }
        
        public void setMax(double max) {
            this.max = max;
        }
    }
}
