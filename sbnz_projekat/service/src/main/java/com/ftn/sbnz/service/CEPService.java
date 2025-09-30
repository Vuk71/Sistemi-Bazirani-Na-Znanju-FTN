package com.ftn.sbnz.service;

import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ftn.sbnz.model.models.*;
import com.ftn.sbnz.model.events.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CEPService {

    @Autowired
    private KieContainer kieContainer;

    public List<RiskAlert> processEvents(List<SensorReading> sensorReadings, 
                                       List<IrrigationEvent> irrigationEvents,
                                       List<VentilationEvent> ventilationEvents) {
        KieSession cepSession = kieContainer.newKieSession("cepKsession");
        
        try {
            List<RiskAlert> alerts = new ArrayList<>();
            
            System.out.println("=== POKRETANJE CEP ANALIZE ===");
            System.out.println("Senzorska očitavanja: " + sensorReadings.size());
            System.out.println("Događaji navodnjavanja: " + irrigationEvents.size());
            System.out.println("Događaji ventilacije: " + ventilationEvents.size());
            
            // Dodavanje senzorskih očitavanja
            for (SensorReading reading : sensorReadings) {
                cepSession.insert(reading);
            }
            
            // Dodavanje događaja navodnjavanja
            for (IrrigationEvent event : irrigationEvents) {
                cepSession.insert(event);
            }
            
            // Dodavanje događaja ventilacije
            for (VentilationEvent event : ventilationEvents) {
                cepSession.insert(event);
            }
            
            // Ne kreiramo unapred alert objekte - pravila će ih kreirati po potrebi
            
            // Pokretanje CEP pravila
            int firedRules = cepSession.fireAllRules();
            
            System.out.println("\n=== REZULTAT CEP ANALIZE ===");
            System.out.println("Aktivirano pravila: " + firedRules);
            
            // Prikupljanje svih RiskAlert objekata iz sesije
            List<RiskAlert> activeAlerts = new ArrayList<>();
            for (Object obj : cepSession.getObjects()) {
                if (obj instanceof RiskAlert) {
                    RiskAlert alert = (RiskAlert) obj;
                    if (alert.getMessage() != null && !alert.getMessage().isEmpty()) {
                        activeAlerts.add(alert);
                    }
                }
            }
            
            System.out.println("Generisano alertova: " + activeAlerts.size());
            
            return activeAlerts;
            
        } finally {
            cepSession.dispose();
        }
    }

    public List<RiskAlert> simulateCriticalConditions() {
        // Simulacija kritičnih uslova za plamenjaču
        List<SensorReading> readings = new ArrayList<>();
        
        // Simulacija visokih temperatura i vlažnosti u poslednjih 6 sati
        LocalDateTime now = LocalDateTime.now();
        for (int i = 0; i < 6; i++) {
            LocalDateTime timestamp = now.minusHours(i);
            
            // Temperatura između 22-28°C
            SensorReading tempReading = new SensorReading(SensorType.TEMPERATURE, 25.0 + (Math.random() * 3), timestamp);
            readings.add(tempReading);
            
            // Vlažnost > 85%
            SensorReading humidityReading = new SensorReading(SensorType.HUMIDITY, 87.0 + (Math.random() * 8), timestamp);
            readings.add(humidityReading);
        }
        
        return processEvents(readings, new ArrayList<>(), new ArrayList<>());
    }

    public List<RiskAlert> simulateCondensationRisk() {
        // Simulacija rizika kondenzacije
        List<SensorReading> readings = new ArrayList<>();
        List<VentilationEvent> ventilationEvents = new ArrayList<>();
        
        LocalDateTime now = LocalDateTime.now();
        
        // Simulacija visoke vlažnosti (>90%) u poslednjih 24h
        for (int i = 0; i < 8; i++) {
            LocalDateTime timestamp = now.minusHours(i * 3);
            SensorReading humidityReading = new SensorReading(SensorType.HUMIDITY, 92.0 + (Math.random() * 5), timestamp);
            readings.add(humidityReading);
        }
        
        // Simulacija isključene ventilacije
        for (int i = 0; i < 3; i++) {
            LocalDateTime timestamp = now.minusHours(i * 8);
            VentilationEvent ventEvent = new VentilationEvent(false, timestamp);
            ventilationEvents.add(ventEvent);
        }
        
        return processEvents(readings, new ArrayList<>(), ventilationEvents);
    }

    public List<RiskAlert> simulateBotrytisRisk() {
        // Simulacija rizika Botrytis nakon navodnjavanja
        List<SensorReading> readings = new ArrayList<>();
        List<IrrigationEvent> irrigationEvents = new ArrayList<>();
        
        LocalDateTime now = LocalDateTime.now();
        
        // Navodnjavanje pre 1 sat
        IrrigationEvent irrigation = new IrrigationEvent(UUID.randomUUID(), 50.0, 30, now.minusHours(1));
        irrigationEvents.add(irrigation);
        
        // Visoka vlažnost nakon navodnjavanja
        SensorReading humidityReading = new SensorReading(SensorType.HUMIDITY, 90.0, now.minusMinutes(30));
        readings.add(humidityReading);
        
        // Visok CO2
        SensorReading co2Reading = new SensorReading(SensorType.CO2, 1300.0, now.minusMinutes(20));
        readings.add(co2Reading);
        
        return processEvents(readings, irrigationEvents, new ArrayList<>());
    }

    public List<RiskAlert> simulateVentilationAlarm() {
        // Simulacija alarma za ventilaciju
        List<SensorReading> readings = new ArrayList<>();
        
        LocalDateTime now = LocalDateTime.now();
        
        // Visoka vlažnost SADA (ne pre 35 minuta)
        SensorReading humidityReading = new SensorReading(SensorType.HUMIDITY, 95.0, now);
        readings.add(humidityReading);
        
        // Nema događaja ventilacije - to će trigerovati "missing event" pravilo
        return processEvents(readings, new ArrayList<>(), new ArrayList<>());
    }

    public List<RiskAlert> simulatePowderyMildewConditions() {
        // Simulacija optimalnih uslova za pepelnicu
        List<SensorReading> readings = new ArrayList<>();
        
        LocalDateTime now = LocalDateTime.now();
        
        // Optimalna temperatura za pepelnicu (20-25°C)
        for (int i = 0; i < 4; i++) {
            LocalDateTime timestamp = now.minusHours(i);
            SensorReading tempReading = new SensorReading(SensorType.TEMPERATURE, 22.0 + (Math.random() * 3), timestamp);
            readings.add(tempReading);
        }
        
        // Umerena vlažnost (60-80%)
        for (int i = 0; i < 4; i++) {
            LocalDateTime timestamp = now.minusHours(i);
            SensorReading humidityReading = new SensorReading(SensorType.HUMIDITY, 65.0 + (Math.random() * 15), timestamp);
            readings.add(humidityReading);
        }
        
        return processEvents(readings, new ArrayList<>(), new ArrayList<>());
    }

    public List<RiskAlert> simulateHumidityTrend() {
        // Simulacija rastućeg trenda vlažnosti
        List<SensorReading> readings = new ArrayList<>();
        
        LocalDateTime now = LocalDateTime.now();
        
        // Početno očitavanje
        SensorReading startReading = new SensorReading(SensorType.HUMIDITY, 50.0, now.minusHours(3));
        readings.add(startReading);
        
        // 4+ očitavanja sa rastom od 10%+ (50 + 10 = 60+)
        for (int i = 0; i < 5; i++) {
            LocalDateTime timestamp = now.minusHours(2).plusMinutes(i * 15);
            double humidity = 62.0 + i * 2; // 62, 64, 66, 68, 70
            SensorReading reading = new SensorReading(SensorType.HUMIDITY, humidity, timestamp);
            readings.add(reading);
        }
        
        // Finalno očitavanje sa rastom od 20%+ (50 + 20 = 70+)
        SensorReading finalReading = new SensorReading(SensorType.HUMIDITY, 75.0, now.minusHours(1));
        readings.add(finalReading);
        
        return processEvents(readings, new ArrayList<>(), new ArrayList<>());
    }
}