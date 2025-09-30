package com.ftn.sbnz.service;

import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ftn.sbnz.model.models.*;

import java.util.ArrayList;
import java.util.List;

@Service
public class BackwardChainingService {

    @Autowired
    private KieContainer kieContainer;

    public DiagnosticQuery queryDiseaseProbability(String diseaseName, List<Disease> diseases) {
        KieSession bwSession = kieContainer.newKieSession("bwKsession");
        
        try {
            DiagnosticQuery query = new DiagnosticQuery("IS_DISEASE_PROBABLE", diseaseName);
            
            System.out.println("=== BACKWARD CHAINING UPIT ===");
            System.out.println("Tip upita: Da li je bolest verovatna?");
            System.out.println("Bolest: " + diseaseName);
            
            // Dodavanje upita i bolesti u sesiju
            bwSession.insert(query);
            for (Disease disease : diseases) {
                bwSession.insert(disease);
            }
            
            // Pokretanje backward chaining pravila
            int firedRules = bwSession.fireAllRules();
            
            System.out.println("\n=== REZULTAT BC UPITA ===");
            System.out.println("Aktivirano pravila: " + firedRules);
            System.out.println("Odgovor: " + query.getResult());
            
            return query;
            
        } finally {
            bwSession.dispose();
        }
    }

    public DiagnosticQuery queryTreatmentAllowed(String treatmentName, Phenophase phenophase, 
                                               List<Treatment> treatments, List<Contraindication> contraindications) {
        KieSession bwSession = kieContainer.newKieSession("bwKsession");
        
        try {
            DiagnosticQuery query = new DiagnosticQuery("IS_TREATMENT_ALLOWED", treatmentName, phenophase);
            
            System.out.println("=== BACKWARD CHAINING UPIT ===");
            System.out.println("Tip upita: Da li je tretman dozvoljen?");
            System.out.println("Tretman: " + treatmentName);
            System.out.println("Fenofaza: " + phenophase);
            
            // Kreiranje crop objekta sa fenofazom
            Crop crop = new Crop("Test kultura", "Test sorta", phenophase);
            
            // Dodavanje objekata u sesiju
            bwSession.insert(query);
            bwSession.insert(crop);
            
            for (Treatment treatment : treatments) {
                bwSession.insert(treatment);
            }
            
            for (Contraindication contraindication : contraindications) {
                bwSession.insert(contraindication);
            }
            
            // Pokretanje backward chaining pravila
            int firedRules = bwSession.fireAllRules();
            
            System.out.println("\n=== REZULTAT BC UPITA ===");
            System.out.println("Aktivirano pravila: " + firedRules);
            System.out.println("Odgovor: " + query.getResult());
            
            return query;
            
        } finally {
            bwSession.dispose();
        }
    }

    public DiagnosticQuery queryWhatCausedRisk(String diseaseName, List<Disease> diseases, 
                                             EnvironmentalCondition environment) {
        KieSession bwSession = kieContainer.newKieSession("bwKsession");
        
        try {
            DiagnosticQuery query = new DiagnosticQuery("WHAT_CAUSED_RISK", diseaseName);
            
            System.out.println("=== BACKWARD CHAINING UPIT ===");
            System.out.println("Tip upita: Koji uslovi su doveli do rizika?");
            System.out.println("Bolest: " + diseaseName);
            System.out.println("Uslovi: T=" + environment.getTemperature() + "°C, RH=" + environment.getHumidity() + "%");
            
            // Dodavanje objekata u sesiju
            bwSession.insert(query);
            bwSession.insert(environment);
            
            for (Disease disease : diseases) {
                bwSession.insert(disease);
            }
            
            // Pokretanje backward chaining pravila
            int firedRules = bwSession.fireAllRules();
            
            System.out.println("\n=== REZULTAT BC UPITA ===");
            System.out.println("Aktivirano pravila: " + firedRules);
            System.out.println("Odgovor: " + query.getResult());
            
            return query;
            
        } finally {
            bwSession.dispose();
        }
    }

    // Pomoćne metode za kreiranje test podataka
    public List<Disease> createTestDiseases() {
        List<Disease> diseases = new ArrayList<>();
        
        Disease plamenjaca = new Disease("Plamenjača", "Phytophthora infestans");
        plamenjaca.setProbability(75.0); // Visoka verovatnoća
        diseases.add(plamenjaca);
        
        Disease pepelnica = new Disease("Pepelnica", "Erysiphe cichoracearum");
        pepelnica.setProbability(55.0); // Povećana verovatnoća da se kreira fakt
        diseases.add(pepelnica);
        
        Disease sivaTrulez = new Disease("Siva trulež", "Botrytis cinerea");
        sivaTrulez.setProbability(60.0); // Umerena verovatnoća
        diseases.add(sivaTrulez);
        
        Disease fuzarijum = new Disease("Fuzarijum", "Fusarium oxysporum");
        fuzarijum.setProbability(20.0); // Vrlo niska verovatnoća
        diseases.add(fuzarijum);
        
        return diseases;
    }

    public List<Treatment> createTestTreatments() {
        List<Treatment> treatments = new ArrayList<>();
        
        Treatment bakarni = new Treatment("Bakarni preparat", TreatmentType.CHEMICAL, "2-3g/L", 14, "M01");
        treatments.add(bakarni);
        
        Treatment bioFungicid = new Treatment("Biološki fungicid", TreatmentType.BIOLOGICAL, "1-2g/L", 0, "BIO");
        treatments.add(bioFungicid);
        
        Treatment trichoderma = new Treatment("Trichoderma", TreatmentType.BIOLOGICAL, "5g/L", 0, "BIO");
        treatments.add(trichoderma);
        
        Treatment sanitarne = new Treatment("Uklanjanje zaraženih biljaka", TreatmentType.SANITARY, "Ručno", 0, "SAN");
        treatments.add(sanitarne);
        
        return treatments;
    }

    public List<Contraindication> createTestContraindications() {
        List<Contraindication> contraindications = new ArrayList<>();
        
        // Kontraindikacija za hemijske tretmane u plodonošenju
        Contraindication chemicalInFruiting = new Contraindication();
        chemicalInFruiting.setTreatmentName("Bakarni preparat");
        chemicalInFruiting.setPhenophase(Phenophase.FRUITING);
        chemicalInFruiting.setDescription("Hemijski tretmani nisu preporučeni u fazi plodonošenja");
        chemicalInFruiting.setType(ContraindicationType.PHENOPHASE_RESTRICTION);
        contraindications.add(chemicalInFruiting);
        
        return contraindications;
    }

    // Test scenariji
    public DiagnosticQuery testHighProbabilityDisease() {
        List<Disease> diseases = createTestDiseases();
        return queryDiseaseProbability("Plamenjača", diseases);
    }

    public DiagnosticQuery testLowProbabilityDisease() {
        List<Disease> diseases = createTestDiseases();
        return queryDiseaseProbability("Pepelnica", diseases);
    }

    public DiagnosticQuery testTreatmentAllowedInVegetative() {
        List<Treatment> treatments = createTestTreatments();
        List<Contraindication> contraindications = createTestContraindications();
        return queryTreatmentAllowed("Bakarni preparat", Phenophase.VEGETATIVE, treatments, contraindications);
    }

    public DiagnosticQuery testTreatmentBlockedInFruiting() {
        List<Treatment> treatments = createTestTreatments();
        List<Contraindication> contraindications = createTestContraindications();
        return queryTreatmentAllowed("Bakarni preparat", Phenophase.FRUITING, treatments, contraindications);
    }

    public DiagnosticQuery testWhatCausedPlamenjacaRisk() {
        List<Disease> diseases = createTestDiseases();
        EnvironmentalCondition env = new EnvironmentalCondition(25.0, 87.0);
        return queryWhatCausedRisk("Plamenjača", diseases, env);
    }

    public DiagnosticQuery testWhatCausedPepelnicaRisk() {
        List<Disease> diseases = createTestDiseases();
        EnvironmentalCondition env = new EnvironmentalCondition(23.0, 70.0);
        return queryWhatCausedRisk("Pepelnica", diseases, env);
    }
}