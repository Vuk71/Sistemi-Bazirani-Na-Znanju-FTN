package com.ftn.sbnz.service;

import org.kie.api.KieServices;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;

import com.ftn.sbnz.model.models.*;
import com.ftn.sbnz.model.events.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class StandaloneDemo {
    
    public static void main(String[] args) {
        System.out.println("=".repeat(80));
        System.out.println("DEMONSTRACIJA KOMPLEKSNIH MEHANIZAMA - SBNZ PROJEKAT");
        System.out.println("=".repeat(80));
        
        KieServices ks = KieServices.Factory.get();
        KieContainer kContainer = ks.getKieClasspathContainer();
        
        // Test Forward Chaining
        testForwardChaining(kContainer);
        
        // Test Backward Chaining
        testBackwardChaining(kContainer);
        
        // Test CEP
        testCEP(kContainer);
        
        System.out.println("\n" + "=".repeat(80));
        System.out.println("DEMONSTRACIJA ZAVRŠENA - SVI MEHANIZMI USPEŠNO TESTIRANI");
        System.out.println("=".repeat(80));
    }
    
    private static void testForwardChaining(KieContainer kContainer) {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("1. FORWARD CHAINING - Kompleksno ulančavanje pravila");
        System.out.println("=".repeat(60));
        
        KieSession kieSession = kContainer.newKieSession("forwardKsession");
        
        try {
            // Kreiranje test podataka
            DiagnosisResult result = new DiagnosisResult();
            
            // Kritični uslovi za plamenjaču
            EnvironmentalCondition environment = new EnvironmentalCondition(25.0, 87.0);
            
            // Simptomi
            List<Symptom> symptoms = new ArrayList<>();
            Symptom wateryLesions = new Symptom("Vodenaste lezije", SymptomType.WATERY_LESIONS);
            wateryLesions.setPresent(true);
            symptoms.add(wateryLesions);
            
            // Kultura
            Crop crop = new Crop("Paradajz", "San Marzano", Phenophase.VEGETATIVE);
            
            // Bolesti
            List<Disease> diseases = new ArrayList<>();
            diseases.add(new Disease("Plamenjača", "Phytophthora infestans"));
            diseases.add(new Disease("Pepelnica", "Erysiphe cichoracearum"));
            diseases.add(new Disease("Siva trulež", "Botrytis cinerea"));
            
            // Tretmani
            List<Treatment> treatments = new ArrayList<>();
            Treatment bakarni = new Treatment("Bakarni preparat", TreatmentType.CHEMICAL, "2-3g/L", 14, "M01");
            treatments.add(bakarni);
            Treatment bioFungicid = new Treatment("Biološki fungicid", TreatmentType.BIOLOGICAL, "1-2g/L", 0, "BIO");
            treatments.add(bioFungicid);
            
            // Dodavanje u sesiju
            kieSession.insert(result);
            kieSession.insert(environment);
            kieSession.insert(crop);
            
            for (Symptom symptom : symptoms) {
                kieSession.insert(symptom);
            }
            
            for (Disease disease : diseases) {
                kieSession.insert(disease);
            }
            
            for (Treatment treatment : treatments) {
                kieSession.insert(treatment);
            }
            
            System.out.println("Uslovi: T=" + environment.getTemperature() + "°C, RH=" + environment.getHumidity() + "%");
            System.out.println("Simptomi: Vodenaste lezije");
            System.out.println("Kultura: " + crop.getName() + " (" + crop.getPhenophase() + ")");
            System.out.println();
            
            // Pokretanje pravila
            int firedRules = kieSession.fireAllRules();
            
            System.out.println("REZULTAT:");
            System.out.println("- Aktivirano pravila: " + firedRules);
            System.out.println("- Dijagnostikovane bolesti: " + result.getProbableDiseases().size());
            System.out.println("- Preporučeni tretmani: " + result.getRecommendedTreatments().size());
            
            for (Disease disease : result.getProbableDiseases()) {
                System.out.println("  * " + disease.getName() + ": " + String.format("%.1f", disease.getProbability()) + "%");
            }
            
            for (Treatment treatment : result.getRecommendedTreatments()) {
                System.out.println("  * Tretman: " + treatment.getName() + " (" + treatment.getType() + ")");
            }
            
        } finally {
            kieSession.dispose();
        }
    }
    
    private static void testBackwardChaining(KieContainer kContainer) {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("2. BACKWARD CHAINING - Dijagnostički upiti");
        System.out.println("=".repeat(60));
        
        KieSession bwSession = kContainer.newKieSession("bwKsession");
        
        try {
            // Test upit: Da li je plamenjača verovatna?
            DiagnosticQuery query = new DiagnosticQuery("IS_DISEASE_PROBABLE", "Plamenjača");
            
            // Kreiranje bolesti sa visokom verovatnoćom
            Disease plamenjaca = new Disease("Plamenjača", "Phytophthora infestans");
            plamenjaca.setProbability(75.0);
            
            System.out.println("UPIT: Da li je plamenjača verovatna?");
            System.out.println("Verovatnoća plamenjače: " + plamenjaca.getProbability() + "%");
            
            bwSession.insert(query);
            bwSession.insert(plamenjaca);
            
            int firedRules = bwSession.fireAllRules();
            
            System.out.println("\nRESULTAT:");
            System.out.println("- Aktivirano pravila: " + firedRules);
            System.out.println("- Odgovor: " + (query.getResult() != null ? query.getResult() : "Nema odgovora"));
            
            if (!query.getExplanation().isEmpty()) {
                System.out.println("- Objašnjenje:");
                for (String explanation : query.getExplanation()) {
                    System.out.println("  * " + explanation);
                }
            }
            
        } finally {
            bwSession.dispose();
        }
    }
    
    private static void testCEP(KieContainer kContainer) {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("3. COMPLEX EVENT PROCESSING - Rana detekcija rizika");
        System.out.println("=".repeat(60));
        
        KieSession cepSession = kContainer.newKieSession("cepKsession");
        
        try {
            List<RiskAlert> alerts = new ArrayList<>();
            
            // Simulacija kritičnih uslova za plamenjaču
            LocalDateTime now = LocalDateTime.now();
            
            System.out.println("Simulacija: Kritični uslovi za plamenjaču u poslednjih 6 sati");
            
            // Dodavanje senzorskih očitavanja
            for (int i = 0; i < 6; i++) {
                LocalDateTime timestamp = now.minusHours(i);
                
                // Temperatura 22-28°C
                SensorReading tempReading = new SensorReading(SensorType.TEMPERATURE, 25.0 + (Math.random() * 3), timestamp);
                cepSession.insert(tempReading);
                
                // Vlažnost > 85%
                SensorReading humidityReading = new SensorReading(SensorType.HUMIDITY, 87.0 + (Math.random() * 8), timestamp);
                cepSession.insert(humidityReading);
                
                System.out.println("  " + timestamp.getHour() + ":00 - T: " + String.format("%.1f", tempReading.getValue()) + 
                                 "°C, RH: " + String.format("%.1f", humidityReading.getValue()) + "%");
            }
            
            // Kreiranje alert objekata
            for (int i = 0; i < 5; i++) {
                RiskAlert alert = new RiskAlert();
                alerts.add(alert);
                cepSession.insert(alert);
            }
            
            int firedRules = cepSession.fireAllRules();
            
            System.out.println("\nRESULTAT:");
            System.out.println("- Aktivirano pravila: " + firedRules);
            
            int activeAlerts = 0;
            for (RiskAlert alert : alerts) {
                if (alert.getMessage() != null && !alert.getMessage().isEmpty()) {
                    activeAlerts++;
                    System.out.println("- ALERT: " + alert.getMessage());
                    if (alert.getRecommendation() != null) {
                        System.out.println("  Preporuka: " + alert.getRecommendation());
                    }
                }
            }
            
            System.out.println("- Ukupno alertova: " + activeAlerts);
            
        } finally {
            cepSession.dispose();
        }
    }
}