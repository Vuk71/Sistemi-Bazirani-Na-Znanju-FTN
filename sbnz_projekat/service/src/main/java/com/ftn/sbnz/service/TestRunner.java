package com.ftn.sbnz.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.ftn.sbnz.model.models.*;

import java.util.ArrayList;
import java.util.List;

@Component
public class TestRunner implements CommandLineRunner {

    @Autowired
    private DiagnosisService diagnosisService;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("POKRETANJE TESTOVA EKSPERTSKOG SISTEMA");
        System.out.println("=".repeat(60));
        
        // Test 1: Plamenjača
        testPlamenjaca();
        
        // Test 2: Pepelnica
        testPepelnica();
        
        // Test 3: Siva trulež
        testSivaTrulez();
        
        // Test 4: Fuzarijum
        testFuzarijum();
        
        // Test 5: Virus mozaika
        testVirus();
        
        System.out.println("\n" + "=".repeat(60));
        System.out.println("SVI TESTOVI ZAVRŠENI");
        System.out.println("=".repeat(60));
    }
    
    private void testPlamenjaca() {
        System.out.println("\n--- TEST 1: PLAMENJAČA ---");
        
        List<Symptom> symptoms = new ArrayList<>();
        Symptom wateryLesions = new Symptom("Vodenaste lezije", SymptomType.WATERY_LESIONS);
        wateryLesions.setPresent(true);
        symptoms.add(wateryLesions);
        
        EnvironmentalCondition environment = new EnvironmentalCondition(25.0, 87.0);
        Crop crop = new Crop("Paradajz", "San Marzano", Phenophase.VEGETATIVE);
        
        DiagnosisResult result = diagnosisService.diagnoseDisease(symptoms, environment, crop);
        printResult(result);
    }
    
    private void testPepelnica() {
        System.out.println("\n--- TEST 2: PEPELNICA ---");
        
        List<Symptom> symptoms = new ArrayList<>();
        Symptom whiteDeposits = new Symptom("Bele naslage", SymptomType.WHITE_DEPOSITS);
        whiteDeposits.setPresent(true);
        symptoms.add(whiteDeposits);
        
        EnvironmentalCondition environment = new EnvironmentalCondition(24.0, 75.0);
        Crop crop = new Crop("Krastavac", "Marketmore", Phenophase.FRUITING);
        
        DiagnosisResult result = diagnosisService.diagnoseDisease(symptoms, environment, crop);
        printResult(result);
    }
    
    private void testSivaTrulez() {
        System.out.println("\n--- TEST 3: SIVA TRULEŽ ---");
        
        List<Symptom> symptoms = new ArrayList<>();
        Symptom grayCoating = new Symptom("Siva prevlaka", SymptomType.GRAY_COATING);
        grayCoating.setPresent(true);
        symptoms.add(grayCoating);
        
        EnvironmentalCondition environment = new EnvironmentalCondition(22.0, 95.0);
        Crop crop = new Crop("Paprika", "California Wonder", Phenophase.FLOWERING);
        
        DiagnosisResult result = diagnosisService.diagnoseDisease(symptoms, environment, crop);
        printResult(result);
    }
    
    private void testFuzarijum() {
        System.out.println("\n--- TEST 4: FUZARIJUM ---");
        
        List<Symptom> symptoms = new ArrayList<>();
        
        Symptom wilting = new Symptom("Uvenuće", SymptomType.WILTING);
        wilting.setPresent(true);
        symptoms.add(wilting);
        
        Symptom browning = new Symptom("Posmeđenje žila", SymptomType.BROWNING);
        browning.setPresent(true);
        symptoms.add(browning);
        
        EnvironmentalCondition environment = new EnvironmentalCondition(28.0, 70.0);
        Crop crop = new Crop("Paradajz", "Cherokee Purple", Phenophase.VEGETATIVE);
        
        DiagnosisResult result = diagnosisService.diagnoseDisease(symptoms, environment, crop);
        printResult(result);
    }
    
    private void testVirus() {
        System.out.println("\n--- TEST 5: VIRUS MOZAIKA ---");
        
        List<Symptom> symptoms = new ArrayList<>();
        Symptom mosaic = new Symptom("Mozaik šare", SymptomType.MOSAIC);
        mosaic.setPresent(true);
        symptoms.add(mosaic);
        
        EnvironmentalCondition environment = new EnvironmentalCondition(26.0, 65.0);
        Crop crop = new Crop("Duvanski list", "Burley", Phenophase.VEGETATIVE);
        
        DiagnosisResult result = diagnosisService.diagnoseDisease(symptoms, environment, crop);
        printResult(result);
    }
    
    private void printResult(DiagnosisResult result) {
        System.out.println("\nRezultat dijagnoze:");
        
        if (result.getProbableDiseases().isEmpty()) {
            System.out.println("  Nema dijagnostikovanih bolesti sa dovoljnom verovatnoćom (≥70%)");
        } else {
            System.out.println("  Dijagnostikovane bolesti:");
            for (Disease disease : result.getProbableDiseases()) {
                System.out.println("    - " + disease.getName() + " (" + disease.getProbability() + "%)");
            }
        }
        
        if (!result.getRecommendedTreatments().isEmpty()) {
            System.out.println("  Preporučeni tretmani:");
            for (Treatment treatment : result.getRecommendedTreatments()) {
                System.out.println("    - " + treatment.getName() + " (" + treatment.getType() + ")");
            }
        }
    }
}