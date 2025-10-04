package com.ftn.sbnz.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ftn.sbnz.model.models.DiagnosticQuery;
import com.ftn.sbnz.model.models.Phenophase;

@RestController
@RequestMapping("/api/backward-chaining")
public class BackwardChainingController {

    @Autowired
    private BackwardChainingService backwardChainingService;

    @GetMapping("/test-high-probability-disease")
    public DiagnosticQuery testHighProbabilityDisease() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: BC-C1 - Da li je bolest sa visokom verovatnoćom dijagnostikovana?");
        System.out.println("=".repeat(60));
        
        return backwardChainingService.testHighProbabilityDisease();
    }

    @GetMapping("/test-low-probability-disease")
    public DiagnosticQuery testLowProbabilityDisease() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: BC-C1 - Da li je bolest sa niskom verovatnoćom dijagnostikovana?");
        System.out.println("=".repeat(60));
        
        return backwardChainingService.testLowProbabilityDisease();
    }

    @GetMapping("/test-treatment-allowed-vegetative")
    public DiagnosticQuery testTreatmentAllowedInVegetative() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: BC-C2 - Da li je tretman dozvoljen u vegetativnoj fazi?");
        System.out.println("=".repeat(60));
        
        return backwardChainingService.testTreatmentAllowedInVegetative();
    }

    @GetMapping("/test-treatment-blocked-fruiting")
    public DiagnosticQuery testTreatmentBlockedInFruiting() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: BC-C2 - Da li je tretman blokiran u fazi plodonošenja?");
        System.out.println("=".repeat(60));
        
        return backwardChainingService.testTreatmentBlockedInFruiting();
    }

    @GetMapping("/test-what-caused-plamenjaca")
    public DiagnosticQuery testWhatCausedPlamenjacaRisk() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: BC-C3 - Koji uslovi su doveli do rizika plamenjače?");
        System.out.println("=".repeat(60));
        
        return backwardChainingService.testWhatCausedPlamenjacaRisk();
    }

    @GetMapping("/test-what-caused-pepelnica")
    public DiagnosticQuery testWhatCausedPepelnicaRisk() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: BC-C3 - Koji uslovi su doveli do rizika pepelnice?");
        System.out.println("=".repeat(60));
        
        return backwardChainingService.testWhatCausedPepelnicaRisk();
    }

    @GetMapping("/test-what-caused-siva-trulez")
    public DiagnosticQuery testWhatCausedSivaTrulezRisk() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: BC-C3 - Koji uslovi su doveli do rizika sive truleži?");
        System.out.println("=".repeat(60));
        
        return backwardChainingService.testWhatCausedSivaTrulezRisk();
    }

    @GetMapping("/test-what-caused-fuzarijum")
    public DiagnosticQuery testWhatCausedFuzarijumRisk() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: BC-C3 - Koji uslovi su doveli do rizika fuzarijuma?");
        System.out.println("=".repeat(60));
        
        return backwardChainingService.testWhatCausedFuzarijumRisk();
    }

    @GetMapping("/test-what-caused-virus-mozaika")
    public DiagnosticQuery testWhatCausedVirusMozaikaRisk() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: BC-C3 - Koji uslovi su doveli do rizika virusa mozaika?");
        System.out.println("=".repeat(60));
        
        return backwardChainingService.testWhatCausedVirusMozaikaRisk();
    }

    @GetMapping("/test-all-backward")
    public String testAllBackwardChainingScenarios() {
        StringBuilder result = new StringBuilder();
        result.append("=== TESTIRANJE SVIH BACKWARD CHAINING SCENARIJA ===\n\n");
        
        result.append("1. Test visoke verovatnoće bolesti:\n");
        DiagnosticQuery query1 = testHighProbabilityDisease();
        result.append(formatQuery(query1)).append("\n\n");
        
        result.append("2. Test niske verovatnoće bolesti:\n");
        DiagnosticQuery query2 = testLowProbabilityDisease();
        result.append(formatQuery(query2)).append("\n\n");
        
        result.append("3. Test dozvoljenog tretmana u vegetativnoj fazi:\n");
        DiagnosticQuery query3 = testTreatmentAllowedInVegetative();
        result.append(formatQuery(query3)).append("\n\n");
        
        result.append("4. Test blokiranog tretmana u plodonošenju:\n");
        DiagnosticQuery query4 = testTreatmentBlockedInFruiting();
        result.append(formatQuery(query4)).append("\n\n");
        
        result.append("5. Test uzroka rizika plamenjače:\n");
        DiagnosticQuery query5 = testWhatCausedPlamenjacaRisk();
        result.append(formatQuery(query5)).append("\n\n");
        
        result.append("6. Test uzroka rizika pepelnice:\n");
        DiagnosticQuery query6 = testWhatCausedPepelnicaRisk();
        result.append(formatQuery(query6)).append("\n\n");
        
        result.append("7. Test uzroka rizika sive truleži:\n");
        DiagnosticQuery query7 = testWhatCausedSivaTrulezRisk();
        result.append(formatQuery(query7)).append("\n\n");
        
        result.append("8. Test uzroka rizika fuzarijuma:\n");
        DiagnosticQuery query8 = testWhatCausedFuzarijumRisk();
        result.append(formatQuery(query8)).append("\n\n");
        
        result.append("9. Test uzroka rizika virusa mozaika:\n");
        DiagnosticQuery query9 = testWhatCausedVirusMozaikaRisk();
        result.append(formatQuery(query9)).append("\n\n");
        
        return result.toString();
    }

    private String formatQuery(DiagnosticQuery query) {
        StringBuilder sb = new StringBuilder();
        sb.append("  Upit: ").append(query.getQueryType()).append("\n");
        if (query.getDiseaseName() != null) {
            sb.append("  Bolest: ").append(query.getDiseaseName()).append("\n");
        }
        if (query.getTreatmentName() != null) {
            sb.append("  Tretman: ").append(query.getTreatmentName()).append("\n");
        }
        if (query.getPhenophase() != null) {
            sb.append("  Fenofaza: ").append(query.getPhenophase()).append("\n");
        }
        sb.append("  Rezultat: ").append(query.getResult()).append("\n");
        
        if (!query.getExplanation().isEmpty()) {
            sb.append("  Objašnjenje:\n");
            for (String explanation : query.getExplanation()) {
                sb.append("    - ").append(explanation).append("\n");
            }
        }
        
        return sb.toString();
    }

    @GetMapping("/demo")
    public String demonstrateBackwardChaining() {
        StringBuilder demo = new StringBuilder();
        demo.append("=== DEMONSTRACIJA BACKWARD CHAINING (BC) ===\n\n");
        
        demo.append("Backward Chaining omogućava dijagnostičke upite i objašnjavanje zaključaka.\n");
        demo.append("Implementirani su sledeći tipovi upita:\n\n");
        
        demo.append("C1 - Da li je bolest X verovatna?\n");
        demo.append("     Proverava da li je verovatnoća bolesti ≥ 50%\n");
        demo.append("     Objašnjava razloge za pozitivnu/negativnu dijagnozu\n\n");
        
        demo.append("C2 - Da li je tretman Y dozvoljen u fenofazi Z?\n");
        demo.append("     Proverava kontraindikacije i ograničenja\n");
        demo.append("     Upozorava na karencu i bezbednost\n\n");
        
        demo.append("C3 - Koji uslovi su doveli do rizika bolesti X?\n");
        demo.append("     Analizira uzročno-posledične veze\n");
        demo.append("     Identifikuje kritične faktore rizika\n\n");
        
        demo.append("Testirajte pojedinačne upite:\n");
        demo.append("GET /api/backward-chaining/test-high-probability-disease\n");
        demo.append("GET /api/backward-chaining/test-low-probability-disease\n");
        demo.append("GET /api/backward-chaining/test-treatment-allowed-vegetative\n");
        demo.append("GET /api/backward-chaining/test-treatment-blocked-fruiting\n");
        demo.append("GET /api/backward-chaining/test-what-caused-plamenjaca\n");
        demo.append("GET /api/backward-chaining/test-what-caused-pepelnica\n");
        demo.append("GET /api/backward-chaining/test-what-caused-siva-trulez\n");
        demo.append("GET /api/backward-chaining/test-what-caused-fuzarijum\n");
        demo.append("GET /api/backward-chaining/test-what-caused-virus-mozaika\n");
        demo.append("GET /api/backward-chaining/test-all-backward\n");
        
        return demo.toString();
    }

    @PostMapping("/query-disease-with-plant")
    public DiagnosticQuery queryDiseaseWithPlant(@RequestBody PlantQueryRequest request) {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("QUERY: Da li je " + request.getDiseaseName() + " verovatna?");
        System.out.println("Biljka: " + request.getPlant().getCropType() + " - " + request.getPlant().getVariety());
        System.out.println("Fenofaza: " + request.getPlant().getPhenophase());
        System.out.println("Temperatura: " + request.getPlant().getTemperature() + "°C");
        System.out.println("Vlažnost: " + request.getPlant().getHumidity() + "%");
        System.out.println("=".repeat(60));
        
        return backwardChainingService.queryDiseaseProbabilityWithPlant(
            request.getDiseaseName(), 
            request.getPlant()
        );
    }

    @PostMapping("/query-what-caused-with-plant")
    public DiagnosticQuery queryWhatCausedWithPlant(@RequestBody PlantQueryRequest request) {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("QUERY C3: Koji uslovi su doveli do rizika " + request.getDiseaseName() + "?");
        System.out.println("Biljka: " + request.getPlant().getCropType() + " - " + request.getPlant().getVariety());
        System.out.println("Temperatura: " + request.getPlant().getTemperature() + "°C");
        System.out.println("Vlažnost: " + request.getPlant().getHumidity() + "%");
        System.out.println("=".repeat(60));
        
        return backwardChainingService.queryWhatCausedWithPlant(
            request.getDiseaseName(), 
            request.getPlant()
        );
    }

    @GetMapping("/query-disease/{diseaseName}")
    public DiagnosticQuery querySpecificDisease(@PathVariable String diseaseName) {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("CUSTOM QUERY: Da li je " + diseaseName + " verovatna?");
        System.out.println("=".repeat(60));
        
        return backwardChainingService.queryDiseaseProbability(diseaseName, 
            backwardChainingService.createTestDiseases());
    }

    @GetMapping("/query-treatment/{treatmentName}/{phenophase}")
    public DiagnosticQuery querySpecificTreatment(@PathVariable String treatmentName, 
                                                @PathVariable String phenophase) {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("CUSTOM QUERY: Da li je " + treatmentName + " dozvoljen u " + phenophase + "?");
        System.out.println("=".repeat(60));
        
        Phenophase phase;
        try {
            phase = Phenophase.valueOf(phenophase.toUpperCase());
        } catch (IllegalArgumentException e) {
            phase = Phenophase.VEGETATIVE; // default
        }
        
        return backwardChainingService.queryTreatmentAllowed(treatmentName, phase,
            backwardChainingService.createTestTreatments(),
            backwardChainingService.createTestContraindications());
    }
}