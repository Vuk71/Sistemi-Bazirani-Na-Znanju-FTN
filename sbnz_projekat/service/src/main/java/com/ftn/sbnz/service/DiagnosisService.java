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
        treatments.add(new Treatment("Bakarni preparat", TreatmentType.CHEMICAL, "2-3g/L", 14, "M01"));
        treatments.add(new Treatment("Biološki fungicid", TreatmentType.BIOLOGICAL, "1-2g/L", 0, "BIO"));
        treatments.add(new Treatment("Trichoderma", TreatmentType.BIOLOGICAL, "5g/L", 0, "BIO"));
        treatments.add(new Treatment("Uklanjanje zaraženih biljaka", TreatmentType.SANITARY, "Ručno", 0, "SAN"));
        treatments.add(new Treatment("Dezinfekcija alata", TreatmentType.SANITARY, "70% alkohol", 0, "SAN"));
        return treatments;
    }
}