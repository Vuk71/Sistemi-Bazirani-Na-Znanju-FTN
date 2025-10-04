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
    
    @Autowired
    private DiagnosisService diagnosisService;

    public DiagnosticQuery queryDiseaseProbabilityWithPlant(String diseaseName, PlantQueryRequest.PlantData plantData) {
        KieSession bwSession = kieContainer.newKieSession("bwKsession");
        
        try {
            DiagnosticQuery query = new DiagnosticQuery("IS_DISEASE_PROBABLE", diseaseName);
            
            System.out.println("=== BACKWARD CHAINING UPIT SA AKTIVNOM BILJKOM ===");
            System.out.println("Tip upita: Da li je bolest verovatna?");
            System.out.println("Bolest: " + diseaseName);
            System.out.println("Biljka: " + plantData.getCropType() + " - " + plantData.getVariety());
            System.out.println("Uslovi: T=" + plantData.getTemperature() + "°C, RH=" + plantData.getHumidity() + "%");
            
            // Kreiranje Disease objekta na osnovu podataka aktivne biljke
            List<Disease> diseases = createDiseasesFromPlant(diseaseName, plantData);
            
            // Dodavanje upita i bolesti u sesiju
            bwSession.insert(query);
            for (Disease disease : diseases) {
                bwSession.insert(disease);
                System.out.println("Dodata bolest: " + disease.getName() + " (verovatnoća: " + disease.getProbability() + "%)");
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
    
    private List<Disease> createDiseasesFromPlant(String diseaseName, PlantQueryRequest.PlantData plantData) {
        // NOVA STRATEGIJA: Koristi Forward Chaining pravila direktno!
        // Umesto ručnog računanja, pozivamo FC engine da izračuna verovatnoće
        
        System.out.println("=== POZIVANJE FORWARD CHAINING PRAVILA ZA BC ===");
        
        // Kreiranje simptoma iz plant data
        List<Symptom> symptoms = new ArrayList<>();
        if (plantData.getSymptoms() != null) {
            PlantQueryRequest.PlantSymptoms s = plantData.getSymptoms();
            
            if (s.isVodenasteLezioni()) {
                Symptom symptom = new Symptom("Vodenaste lezije", SymptomType.WATERY_LESIONS);
                symptom.setPresent(true);
                symptoms.add(symptom);
            }
            if (s.isBelePrevlake()) {
                Symptom symptom = new Symptom("Bele prevlake", SymptomType.WHITE_DEPOSITS);
                symptom.setPresent(true);
                symptoms.add(symptom);
            }
            if (s.isSivaPrevlaka()) {
                Symptom symptom = new Symptom("Siva prevlaka", SymptomType.GRAY_COATING);
                symptom.setPresent(true);
                symptoms.add(symptom);
            }
            if (s.isZutilo()) {
                Symptom symptom = new Symptom("Žutilo", SymptomType.YELLOWING);
                symptom.setPresent(true);
                symptoms.add(symptom);
            }
            if (s.isUvenuće()) {
                Symptom symptom = new Symptom("Uvenuće", SymptomType.WILTING);
                symptom.setPresent(true);
                symptoms.add(symptom);
            }
            if (s.isPosmeđenjeZila()) {
                Symptom symptom = new Symptom("Posmeđenje žila", SymptomType.BROWNING);
                symptom.setPresent(true);
                symptoms.add(symptom);
            }
            if (s.isMozaikSare()) {
                Symptom symptom = new Symptom("Mozaik šare", SymptomType.MOSAIC);
                symptom.setPresent(true);
                symptoms.add(symptom);
            }
        }
        
        // Kreiranje EnvironmentalCondition
        EnvironmentalCondition environment = new EnvironmentalCondition();
        environment.setTemperature(plantData.getTemperature());
        environment.setHumidity(plantData.getHumidity());
        
        // Kreiranje Crop
        Crop crop = new Crop(plantData.getCropType(), plantData.getVariety(), 
                            Phenophase.valueOf(plantData.getPhenophase()));
        
        // POZIVANJE FORWARD CHAINING ENGINE-A
        DiagnosisResult fcResult = diagnosisService.diagnoseDisease(symptoms, environment, crop);
        
        System.out.println("FC engine vratio " + fcResult.getProbableDiseases().size() + " bolesti");
        
        // Vraćanje bolesti sa verovatnoćama izračunatim od FC pravila
        List<Disease> diseases = new ArrayList<>();
        
        // Pronađi traženu bolest u FC rezultatima
        Disease targetDisease = null;
        for (Disease d : fcResult.getProbableDiseases()) {
            if (d.getName().equals(diseaseName)) {
                targetDisease = d;
                System.out.println("Pronađena bolest " + diseaseName + " sa verovatnoćom " + d.getProbability() + "%");
                break;
            }
        }
        
        // Ako bolest nije pronađena u FC rezultatima, kreiraj je sa 0% verovatnoćom
        if (targetDisease == null) {
            targetDisease = new Disease(diseaseName, getPathogenForDisease(diseaseName));
            targetDisease.setProbability(0.0);
            System.out.println("Bolest " + diseaseName + " nije pronađena u FC rezultatima - verovatnoća 0%");
        }
        
        diseases.add(targetDisease);
        
        // Dodaj i ostale bolesti iz FC rezultata (za R15 normalizaciju)
        for (Disease d : fcResult.getProbableDiseases()) {
            if (!d.getName().equals(diseaseName)) {
                diseases.add(d);
            }
        }
        
        return diseases;
    }
    
    private String getPathogenForDisease(String diseaseName) {
        switch (diseaseName) {
            case "Plamenjača": return "Phytophthora infestans";
            case "Pepelnica": return "Erysiphe cichoracearum";
            case "Siva trulež": return "Botrytis cinerea";
            case "Fuzarijum": return "Fusarium oxysporum";
            case "Virus mozaika": return "Tobacco mosaic virus";
            default: return "Unknown pathogen";
        }
    }
    


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

    public DiagnosticQuery queryWhatCausedWithPlant(String diseaseName, PlantQueryRequest.PlantData plantData) {
        KieSession bwSession = kieContainer.newKieSession("bwKsession");
        
        try {
            DiagnosticQuery query = new DiagnosticQuery("WHAT_CAUSED_RISK", diseaseName);
            
            System.out.println("=== BACKWARD CHAINING C3 UPIT SA AKTIVNOM BILJKOM ===");
            System.out.println("Tip upita: Koji uslovi su doveli do rizika?");
            System.out.println("Bolest: " + diseaseName);
            System.out.println("Biljka: " + plantData.getCropType());
            System.out.println("Uslovi: T=" + plantData.getTemperature() + "°C, RH=" + plantData.getHumidity() + "%");
            
            // Kreiranje Disease i EnvironmentalCondition iz aktivne biljke
            List<Disease> diseases = createDiseasesFromPlant(diseaseName, plantData);
            EnvironmentalCondition environment = new EnvironmentalCondition();
            environment.setTemperature(plantData.getTemperature());
            environment.setHumidity(plantData.getHumidity());
            environment.setCo2Level(plantData.getCo2Level());
            environment.setVentilationActive(plantData.isVentilationActive());
            
            // Dodavanje objekata u sesiju
            bwSession.insert(query);
            bwSession.insert(environment);
            
            for (Disease disease : diseases) {
                bwSession.insert(disease);
            }
            
            // Pokretanje backward chaining pravila
            int firedRules = bwSession.fireAllRules();
            
            // Dodavanje objašnjenja na osnovu uslova aktivne biljke
            query.addExplanation("=== ANALIZA USLOVA AKTIVNE BILJKE ===");
            query.addExplanation("Temperatura: " + plantData.getTemperature() + "°C");
            query.addExplanation("Vlažnost: " + plantData.getHumidity() + "%");
            query.addExplanation("CO₂: " + plantData.getCo2Level() + " ppm");
            query.addExplanation("Ventilacija: " + (plantData.isVentilationActive() ? "Aktivna" : "Neaktivna"));
            
            // Analiza rizika specifična za svaku bolest
            query.addExplanation("");
            query.addExplanation("=== ANALIZA UZROKA ZA: " + diseaseName.toUpperCase() + " ===");
            
            if (diseaseName.equals("Plamenjača")) {
                analyzePlamenjacaCauses(query, plantData);
            } else if (diseaseName.equals("Pepelnica")) {
                analyzePepelnicaCauses(query, plantData);
            } else if (diseaseName.equals("Siva trulež")) {
                analyzeSivaTrulezCauses(query, plantData);
            } else if (diseaseName.equals("Fuzarijum")) {
                analyzeFuzarijumCauses(query, plantData);
            } else if (diseaseName.equals("Virus mozaika")) {
                analyzeVirusMozaikaCauses(query, plantData);
            } else {
                // Generička analiza
                if (plantData.getHumidity() > 85) {
                    query.addExplanation("⚠️ VISOKA VLAŽNOST: " + plantData.getHumidity() + "% (prag: 85%)");
                }
                if (plantData.getTemperature() >= 20 && plantData.getTemperature() <= 28) {
                    query.addExplanation("⚠️ OPTIMALNA TEMPERATURA za patogene: " + plantData.getTemperature() + "°C");
                }
            }
            
            System.out.println("\n=== REZULTAT BC C3 UPITA ===");
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

    // Analiza uzroka za svaku bolest
    private void analyzePlamenjacaCauses(DiagnosticQuery query, PlantQueryRequest.PlantData plantData) {
        if (plantData.getHumidity() > 85) {
            query.addExplanation(" KRITIČNI FAKTOR: Visoka vlažnost vazduha (" + plantData.getHumidity() + "%)");
            query.addExplanation("   → Phytophthora infestans zahteva RH > 85% za sporulaciju");
        }
        if (plantData.getTemperature() >= 20 && plantData.getTemperature() <= 28) {
            query.addExplanation(" KRITIČNI FAKTOR: Optimalna temperatura (" + plantData.getTemperature() + "°C)");
            query.addExplanation("   → Optimalni opseg za razvoj plamenjače: 20-28°C");
        }
        if (!plantData.isVentilationActive()) {
            query.addExplanation(" KRITIČNI FAKTOR: Nedostatak ventilacije");
            query.addExplanation("   → Stagnacija vazduha povećava rizik od infekcije");
        }
        query.addExplanation(" ZAKLJUČAK: Kombinacija visokih vlažnosti i optimalne temperature");
    }
    
    private void analyzePepelnicaCauses(DiagnosticQuery query, PlantQueryRequest.PlantData plantData) {
        if (plantData.getHumidity() >= 60 && plantData.getHumidity() <= 80) {
            query.addExplanation(" KRITIČNI FAKTOR: Umerena vlažnost (" + plantData.getHumidity() + "%)");
            query.addExplanation("   → Erysiphe cichoracearum preferira RH 60-80%");
        }
        if (plantData.getTemperature() >= 20 && plantData.getTemperature() <= 25) {
            query.addExplanation(" KRITIČNI FAKTOR: Optimalna temperatura (" + plantData.getTemperature() + "°C)");
            query.addExplanation("   → Pepelnica se razvija najbolje na 20-25°C");
        }
        query.addExplanation(" ZAKLJUČAK: Stabilni umereni uslovi pogodni za Erysiphe");
    }
    
    private void analyzeSivaTrulezCauses(DiagnosticQuery query, PlantQueryRequest.PlantData plantData) {
        if (plantData.getHumidity() > 90) {
            query.addExplanation(" KRITIČNI FAKTOR: Ekstremno visoka vlažnost (" + plantData.getHumidity() + "%)");
            query.addExplanation("   → Botrytis cinerea zahteva RH > 90% za razvoj");
        }
        if (!plantData.isVentilationActive()) {
            query.addExplanation(" KRITIČNI FAKTOR: Nedostatak ventilacije");
            query.addExplanation("   → Povećava rizik kondenzacije i razvoja sive truleži");
        }
        if (plantData.getCo2Level() > 1200) {
            query.addExplanation(" KRITIČNI FAKTOR: Visok nivo CO₂ (" + plantData.getCo2Level() + " ppm)");
            query.addExplanation("   → Loša cirkulacija vazduha");
        }
        query.addExplanation(" ZAKLJUČAK: Ekstremna vlažnost + loša ventilacija = visok rizik");
    }
    
    private void analyzeFuzarijumCauses(DiagnosticQuery query, PlantQueryRequest.PlantData plantData) {
        query.addExplanation(" NAPOMENA: Fuzarijum je bolest zemljišta, ne atmosferska");
        if (plantData.getTemperature() > 25) {
            query.addExplanation(" FAKTOR: Visoka temperatura zemljišta (" + plantData.getTemperature() + "°C)");
            query.addExplanation("   → Fusarium oxysporum aktivan na visokim temperaturama");
        }
        query.addExplanation(" DODATNI FAKTORI (van CEP sistema):");
        query.addExplanation("   → Nizak pH zemljišta (< 6.0)");
        query.addExplanation("   → Loša drenaža");
        query.addExplanation("   → Zaraženo zemljište");
        query.addExplanation(" ZAKLJUČAK: Bolest zemljišta - zahteva analizu pH i drenaže");
    }
    
    private void analyzeVirusMozaikaCauses(DiagnosticQuery query, PlantQueryRequest.PlantData plantData) {
        query.addExplanation(" NAPOMENA: Virus mozaika se ne prenosi kroz atmosferske uslove");
        query.addExplanation(" GLAVNI UZROCI:");
        query.addExplanation("   → Mehanička transmisija (alati, ruke, odeća)");
        query.addExplanation("   → Vektori (insekti - lisne vaši, tripsi)");
        query.addExplanation("   → Zaraženi sadni materijal");
        query.addExplanation("   → Kontakt između biljaka");
        query.addExplanation(" ATMOSFERSKI USLOVI (manje važni):");
        query.addExplanation("   → Temperatura: " + plantData.getTemperature() + "°C");
        query.addExplanation("   → Vlažnost: " + plantData.getHumidity() + "%");
        query.addExplanation(" ZAKLJUČAK: Prevencija kroz higijenu i kontrolu vektora");
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
        
        // Kontraindikacija za Bakarni preparat u plodonošenju
        Contraindication bakarniInFruiting = new Contraindication();
        bakarniInFruiting.setTreatmentName("Bakarni preparat");
        bakarniInFruiting.setPhenophase(Phenophase.FRUITING);
        bakarniInFruiting.setDescription("Hemijski tretmani nisu preporučeni u fazi plodonošenja");
        bakarniInFruiting.setType(ContraindicationType.PHENOPHASE_RESTRICTION);
        contraindications.add(bakarniInFruiting);
        
        // Kontraindikacija za Biološki fungicid u plodonošenju (neki biološki tretmani takođe)
        Contraindication bioFungicidInFruiting = new Contraindication();
        bioFungicidInFruiting.setTreatmentName("Biološki fungicid");
        bioFungicidInFruiting.setPhenophase(Phenophase.FRUITING);
        bioFungicidInFruiting.setDescription("Ovaj biološki fungicid nije preporučen u fazi plodonošenja");
        bioFungicidInFruiting.setType(ContraindicationType.PHENOPHASE_RESTRICTION);
        contraindications.add(bioFungicidInFruiting);
        
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

    public DiagnosticQuery testWhatCausedSivaTrulezRisk() {
        List<Disease> diseases = createTestDiseases();
        EnvironmentalCondition env = new EnvironmentalCondition(20.0, 92.0);
        return queryWhatCausedRisk("Siva trulež", diseases, env);
    }

    public DiagnosticQuery testWhatCausedFuzarijumRisk() {
        List<Disease> diseases = createTestDiseases();
        EnvironmentalCondition env = new EnvironmentalCondition(28.0, 65.0);
        return queryWhatCausedRisk("Fuzarijum", diseases, env);
    }

    public DiagnosticQuery testWhatCausedVirusMozaikaRisk() {
        List<Disease> diseases = createTestDiseases();
        EnvironmentalCondition env = new EnvironmentalCondition(22.0, 60.0);
        return queryWhatCausedRisk("Virus mozaika", diseases, env);
    }
}