package com.ftn.sbnz.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ftn.sbnz.model.models.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/diagnosis")
public class DiagnosisController {

    @Autowired
    private DiagnosisService diagnosisService;

    @GetMapping("/test-plamenjaca")
    public DiagnosisResult testPlamenjaca() {
        // Kreiranje test scenarija za plamenjaču
        List<Symptom> symptoms = new ArrayList<>();
        
        Symptom wateryLesions = new Symptom("Vodenaste lezije", SymptomType.WATERY_LESIONS);
        wateryLesions.setPresent(true);
        symptoms.add(wateryLesions);
        
        EnvironmentalCondition environment = new EnvironmentalCondition(25.0, 87.0);
        Crop crop = new Crop("Paradajz", "San Marzano", Phenophase.VEGETATIVE);
        
        return diagnosisService.diagnoseDisease(symptoms, environment, crop);
    }

    @GetMapping("/test-pepelnica")
    public DiagnosisResult testPepelnica() {
        // Kreiranje test scenarija za pepelnicu
        List<Symptom> symptoms = new ArrayList<>();
        
        Symptom whiteDeposits = new Symptom("Bele naslage", SymptomType.WHITE_DEPOSITS);
        whiteDeposits.setPresent(true);
        symptoms.add(whiteDeposits);
        
        EnvironmentalCondition environment = new EnvironmentalCondition(24.0, 75.0);
        Crop crop = new Crop("Krastavac", "Marketmore", Phenophase.FRUITING);
        
        return diagnosisService.diagnoseDisease(symptoms, environment, crop);
    }

    @GetMapping("/test-siva-trulez")
    public DiagnosisResult testSivaTrulez() {
        // Kreiranje test scenarija za sivu trulež
        List<Symptom> symptoms = new ArrayList<>();
        
        Symptom grayCoating = new Symptom("Siva prevlaka", SymptomType.GRAY_COATING);
        grayCoating.setPresent(true);
        symptoms.add(grayCoating);
        
        EnvironmentalCondition environment = new EnvironmentalCondition(22.0, 95.0);
        Crop crop = new Crop("Paprika", "California Wonder", Phenophase.FLOWERING);
        
        return diagnosisService.diagnoseDisease(symptoms, environment, crop);
    }

    @GetMapping("/test-fuzarijum")
    public DiagnosisResult testFuzarijum() {
        // Kreiranje test scenarija za fuzarijum
        List<Symptom> symptoms = new ArrayList<>();
        
        Symptom wilting = new Symptom("Uvenuće", SymptomType.WILTING);
        wilting.setPresent(true);
        symptoms.add(wilting);
        
        Symptom browning = new Symptom("Posmeđenje žila", SymptomType.BROWNING);
        browning.setPresent(true);
        symptoms.add(browning);
        
        EnvironmentalCondition environment = new EnvironmentalCondition(28.0, 70.0);
        Crop crop = new Crop("Paradajz", "Cherokee Purple", Phenophase.VEGETATIVE);
        
        return diagnosisService.diagnoseDisease(symptoms, environment, crop);
    }

    @GetMapping("/test-virus")
    public DiagnosisResult testVirus() {
        // Kreiranje test scenarija za virus mozaika
        List<Symptom> symptoms = new ArrayList<>();
        
        Symptom mosaic = new Symptom("Mozaik šare", SymptomType.MOSAIC);
        mosaic.setPresent(true);
        symptoms.add(mosaic);
        
        EnvironmentalCondition environment = new EnvironmentalCondition(26.0, 65.0);
        Crop crop = new Crop("Duvanski list", "Burley", Phenophase.VEGETATIVE);
        
        return diagnosisService.diagnoseDisease(symptoms, environment, crop);
    }

    @GetMapping("/test-complex-chaining")
    public DiagnosisResult testComplexChaining() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: Kompleksno ulančavanje pravila");
        System.out.println("=".repeat(60));
        
        // Kreiranje kompleksnog scenarija
        List<Symptom> symptoms = new ArrayList<>();
        
        Symptom wateryLesions = new Symptom("Vodenaste lezije", SymptomType.WATERY_LESIONS);
        wateryLesions.setPresent(true);
        symptoms.add(wateryLesions);
        
        Symptom whiteDeposits = new Symptom("Bele naslage", SymptomType.WHITE_DEPOSITS);
        whiteDeposits.setPresent(true);
        symptoms.add(whiteDeposits);
        
        EnvironmentalCondition environment = new EnvironmentalCondition(25.0, 87.0, 1100.0, false);
        Crop crop = new Crop("Paradajz", "San Marzano", Phenophase.VEGETATIVE);
        
        // Simulacija istorije tretmana
        List<TreatmentApplication> treatmentHistory = new ArrayList<>();
        TreatmentApplication pastTreatment = new TreatmentApplication();
        pastTreatment.setTreatmentType(TreatmentType.CHEMICAL);
        Treatment treatment = new Treatment("Bakarni preparat", TreatmentType.CHEMICAL, "2g/L", 14, "M01");
        pastTreatment.setTreatment(treatment);
        pastTreatment.setApplicationTime(LocalDateTime.now().minusDays(10));
        treatmentHistory.add(pastTreatment);
        
        return diagnosisService.diagnoseWithComplexChaining(symptoms, environment, crop, treatmentHistory);
    }

    @GetMapping("/test-multiple-diseases")
    public DiagnosisResult testMultipleDiseases() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: Više verovatnih bolesti - Bayes analiza");
        System.out.println("=".repeat(60));
        
        // Scenarij sa simptomima koji mogu ukazivati na više bolesti
        List<Symptom> symptoms = new ArrayList<>();
        
        Symptom wateryLesions = new Symptom("Vodenaste lezije", SymptomType.WATERY_LESIONS);
        wateryLesions.setPresent(true);
        symptoms.add(wateryLesions);
        
        Symptom grayCoating = new Symptom("Siva prevlaka", SymptomType.GRAY_COATING);
        grayCoating.setPresent(true);
        symptoms.add(grayCoating);
        
        Symptom wilting = new Symptom("Uvenuće", SymptomType.WILTING);
        wilting.setPresent(true);
        symptoms.add(wilting);
        
        EnvironmentalCondition environment = new EnvironmentalCondition(24.0, 92.0);
        Crop crop = new Crop("Paradajz", "Cherokee Purple", Phenophase.FLOWERING);
        
        return diagnosisService.diagnoseWithComplexChaining(symptoms, environment, crop, new ArrayList<>());
    }

    @GetMapping("/test-treatment-restrictions")
    public DiagnosisResult testTreatmentRestrictions() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: Ograničenja tretmana - karenca i fenofaza");
        System.out.println("=".repeat(60));
        
        List<Symptom> symptoms = new ArrayList<>();
        
        Symptom wateryLesions = new Symptom("Vodenaste lezije", SymptomType.WATERY_LESIONS);
        wateryLesions.setPresent(true);
        symptoms.add(wateryLesions);
        
        EnvironmentalCondition environment = new EnvironmentalCondition(25.0, 87.0);
        
        // Kultura blizu berbe
        Crop crop = new Crop("Paradajz", "San Marzano", Phenophase.FRUITING);
        crop.setPlannedHarvestDate(LocalDate.now().plusDays(7)); // Berba za 7 dana
        
        return diagnosisService.diagnoseWithComplexChaining(symptoms, environment, crop, new ArrayList<>());
    }

    @GetMapping("/test-all")
    public String testAllScenarios() {
        StringBuilder result = new StringBuilder();
        result.append("=== TESTIRANJE SVIH FORWARD CHAINING SCENARIJA ===\n\n");
        
        result.append("1. Test Plamenjače:\n");
        DiagnosisResult plamenjaca = testPlamenjaca();
        result.append(formatResult(plamenjaca)).append("\n\n");
        
        result.append("2. Test Pepelnice:\n");
        DiagnosisResult pepelnica = testPepelnica();
        result.append(formatResult(pepelnica)).append("\n\n");
        
        result.append("3. Test Sive truleži:\n");
        DiagnosisResult sivaTrulez = testSivaTrulez();
        result.append(formatResult(sivaTrulez)).append("\n\n");
        
        result.append("4. Test Fuzarijuma:\n");
        DiagnosisResult fuzarijum = testFuzarijum();
        result.append(formatResult(fuzarijum)).append("\n\n");
        
        result.append("5. Test Virusa:\n");
        DiagnosisResult virus = testVirus();
        result.append(formatResult(virus)).append("\n\n");
        
        result.append("6. Test Kompleksnog ulančavanja:\n");
        DiagnosisResult complex = testComplexChaining();
        result.append(formatResult(complex)).append("\n\n");
        
        result.append("7. Test Više bolesti (Bayes):\n");
        DiagnosisResult multiple = testMultipleDiseases();
        result.append(formatResult(multiple)).append("\n\n");
        
        result.append("8. Test Ograničenja tretmana:\n");
        DiagnosisResult restrictions = testTreatmentRestrictions();
        result.append(formatResult(restrictions)).append("\n\n");
        
        return result.toString();
    }
    
    private String formatResult(DiagnosisResult result) {
        StringBuilder sb = new StringBuilder();
        
        if (result.getProbableDiseases().isEmpty()) {
            sb.append("Nema dijagnostikovanih bolesti sa dovoljnom verovatnoćom.\n");
        } else {
            sb.append("Dijagnostikovane bolesti:\n");
            for (Disease disease : result.getProbableDiseases()) {
                sb.append("  - ").append(disease.getName())
                  .append(" (").append(disease.getProbability()).append("%)\n");
            }
        }
        
        if (!result.getRecommendedTreatments().isEmpty()) {
            sb.append("Preporučeni tretmani:\n");
            for (Treatment treatment : result.getRecommendedTreatments()) {
                sb.append("  - ").append(treatment.getName())
                  .append(" (").append(treatment.getType()).append(")\n");
            }
        }
        
        return sb.toString();
    }
}