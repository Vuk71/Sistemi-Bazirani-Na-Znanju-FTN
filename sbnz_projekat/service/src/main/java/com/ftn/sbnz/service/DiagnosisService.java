package com.ftn.sbnz.service;

import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ftn.sbnz.model.models.*;

import java.util.ArrayList;
import java.util.List;

@Service
public class DiagnosisService {

    @Autowired
    private KieContainer kieContainer;

    public DiagnosisResult diagnoseDisease(List<Symptom> symptoms, EnvironmentalCondition environment, Crop crop) {
        KieSession kieSession = kieContainer.newKieSession("forwardKsession");
        
        try {
            // Kreiranje rezultata dijagnoze
            DiagnosisResult result = new DiagnosisResult();
            
            // Kreiranje bolesti koje sistem može da dijagnostikuje
            List<Disease> diseases = createKnownDiseases();
            
            // Kreiranje dostupnih tretmana
            List<Treatment> treatments = createAvailableTreatments();
            
            // Dodavanje faktova u sesiju
            kieSession.insert(result);
            kieSession.insert(environment);
            kieSession.insert(crop);
            
            // Dodavanje simptoma
            for (Symptom symptom : symptoms) {
                kieSession.insert(symptom);
            }
            
            // Dodavanje bolesti
            for (Disease disease : diseases) {
                kieSession.insert(disease);
            }
            
            // Dodavanje tretmana
            for (Treatment treatment : treatments) {
                kieSession.insert(treatment);
            }
            
            System.out.println("=== POKRETANJE DIJAGNOSTIKE ===");
            System.out.println("Uslovi: T=" + environment.getTemperature() + "°C, RH=" + environment.getHumidity() + "%");
            System.out.println("Kultura: " + crop.getName() + " (" + crop.getPhenophase() + ")");
            System.out.println("Simptomi:");
            for (Symptom symptom : symptoms) {
                if (symptom.isPresent()) {
                    System.out.println("  - " + symptom.getType().getDescription());
                }
            }
            System.out.println();
            
            // Pokretanje pravila
            int firedRules = kieSession.fireAllRules();
            System.out.println("\n=== REZULTAT DIJAGNOSTIKE ===");
            System.out.println("Aktivirano pravila: " + firedRules);
            
            return result;
            
        } finally {
            kieSession.dispose();
        }
    }
    
    private List<Disease> createKnownDiseases() {
        List<Disease> diseases = new ArrayList<>();
        diseases.add(new Disease("Plamenjača", "Phytophthora infestans"));
        diseases.add(new Disease("Pepelnica", "Erysiphe cichoracearum"));
        diseases.add(new Disease("Siva trulež", "Botrytis cinerea"));
        diseases.add(new Disease("Fuzarijum", "Fusarium oxysporum"));
        diseases.add(new Disease("Virus mozaika", "Tobacco mosaic virus"));
        return diseases;
    }
    
    private List<Treatment> createAvailableTreatments() {
        List<Treatment> treatments = new ArrayList<>();
        
        Treatment bakarni = new Treatment("Bakarni preparat", TreatmentType.CHEMICAL, "2-3g/L", 14, "M01");
        bakarni.setActiveIngredient("Bakar sulfat");
        treatments.add(bakarni);
        
        Treatment bioFungicid = new Treatment("Biološki fungicid", TreatmentType.BIOLOGICAL, "1-2g/L", 0, "BIO");
        bioFungicid.setActiveIngredient("Bacillus subtilis");
        treatments.add(bioFungicid);
        
        Treatment trichoderma = new Treatment("Trichoderma", TreatmentType.BIOLOGICAL, "5g/L", 0, "BIO");
        trichoderma.setActiveIngredient("Trichoderma harzianum");
        treatments.add(trichoderma);
        
        Treatment uklanjanje = new Treatment("Uklanjanje zaraženih biljaka", TreatmentType.SANITARY, "Ručno", 0, "SAN");
        treatments.add(uklanjanje);
        
        Treatment dezinfekcija = new Treatment("Dezinfekcija alata", TreatmentType.SANITARY, "70% alkohol", 0, "SAN");
        treatments.add(dezinfekcija);
        
        return treatments;
    }

    public DiagnosisResult diagnoseWithComplexChaining(List<Symptom> symptoms, EnvironmentalCondition environment, 
                                                     Crop crop, List<TreatmentApplication> treatmentHistory) {
        KieSession kieSession = kieContainer.newKieSession("forwardKsession");
        
        try {
            DiagnosisResult result = new DiagnosisResult();
            List<Disease> diseases = createKnownDiseases();
            List<Treatment> treatments = createAvailableTreatments();
            
            // Kreiranje dodatnih objekata za kompleksnije pravila
            List<Threshold> thresholds = createThresholds();
            List<RiskAlert> alerts = new ArrayList<>();
            
            // Dodavanje svih objekata u sesiju
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
            
            for (Threshold threshold : thresholds) {
                kieSession.insert(threshold);
            }
            
            for (TreatmentApplication application : treatmentHistory) {
                kieSession.insert(application);
            }
            
            // Dodavanje praznih alert objekata
            for (int i = 0; i < 5; i++) {
                RiskAlert alert = new RiskAlert();
                alerts.add(alert);
                kieSession.insert(alert);
            }
            
            System.out.println("=== KOMPLEKSNA DIJAGNOSTIKA SA ULANČAVANJEM ===");
            System.out.println("Uslovi: T=" + environment.getTemperature() + "°C, RH=" + environment.getHumidity() + "%");
            System.out.println("Kultura: " + crop.getName() + " (" + crop.getPhenophase() + ")");
            System.out.println("Istorija tretmana: " + treatmentHistory.size() + " aplikacija");
            System.out.println("Simptomi:");
            for (Symptom symptom : symptoms) {
                if (symptom.isPresent()) {
                    System.out.println("  - " + symptom.getType().getDescription());
                }
            }
            System.out.println();
            
            // Pokretanje svih pravila sa ulančavanjem
            int firedRules = kieSession.fireAllRules();
            
            System.out.println("\n=== REZULTAT KOMPLEKSNE DIJAGNOSTIKE ===");
            System.out.println("Aktivirano pravila: " + firedRules);
            
            // Sortiranje bolesti po verovatnoći
            result.getProbableDiseases().sort((d1, d2) -> 
                Double.compare(d2.getProbability(), d1.getProbability()));
            
            // Sortiranje tretmana po prioritetu
            result.getRecommendedTreatments().sort((t1, t2) -> 
                Integer.compare(t1.getPriority(), t2.getPriority()));
            
            return result;
            
        } finally {
            kieSession.dispose();
        }
    }
    
    private List<Threshold> createThresholds() {
        List<Threshold> thresholds = new ArrayList<>();
        
        Threshold phThreshold = new Threshold("pH", 5.5, 5.5, ThresholdType.CRITICAL);
        thresholds.add(phThreshold);
        
        return thresholds;
    }
}