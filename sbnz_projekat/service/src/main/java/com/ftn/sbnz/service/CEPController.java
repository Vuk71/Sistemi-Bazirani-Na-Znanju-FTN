package com.ftn.sbnz.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ftn.sbnz.model.models.RiskAlert;

import java.util.List;

@RestController
@RequestMapping("/api/cep")
public class CEPController {

    @Autowired
    private CEPService cepService;

    @GetMapping("/test-critical-conditions")
    public List<RiskAlert> testCriticalConditions() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: Kritični uslovi za plamenjaču (CEP-E1)");
        System.out.println("=".repeat(60));
        
        return cepService.simulateCriticalConditions();
    }

    @GetMapping("/test-condensation-risk")
    public List<RiskAlert> testCondensationRisk() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: Rizik kondenzacije (CEP-E2)");
        System.out.println("=".repeat(60));
        
        return cepService.simulateCondensationRisk();
    }

    @GetMapping("/test-botrytis-risk")
    public List<RiskAlert> testBotrytisRisk() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: Rizik Botrytis nakon navodnjavanja (CEP-E3)");
        System.out.println("=".repeat(60));
        
        return cepService.simulateBotrytisRisk();
    }

    @GetMapping("/test-ventilation-alarm")
    public List<RiskAlert> testVentilationAlarm() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: Alarm ventilacije - nedostajući događaj (CEP-E4)");
        System.out.println("=".repeat(60));
        
        return cepService.simulateVentilationAlarm();
    }

    @GetMapping("/test-powdery-mildew")
    public List<RiskAlert> testPowderyMildewConditions() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: Optimalni uslovi za pepelnicu (CEP-E5)");
        System.out.println("=".repeat(60));
        
        return cepService.simulatePowderyMildewConditions();
    }

    @GetMapping("/test-humidity-trend")
    public List<RiskAlert> testHumidityTrend() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("TEST: Rastući trend vlažnosti (CEP-E6)");
        System.out.println("=".repeat(60));
        
        return cepService.simulateHumidityTrend();
    }

    @GetMapping("/test-all-cep")
    public String testAllCEPScenarios() {
        StringBuilder result = new StringBuilder();
        result.append("=== TESTIRANJE SVIH CEP SCENARIJA ===\n\n");
        
        result.append("1. Test kritičnih uslova za plamenjaču:\n");
        List<RiskAlert> alerts1 = testCriticalConditions();
        result.append(formatAlerts(alerts1)).append("\n\n");
        
        result.append("2. Test rizika kondenzacije:\n");
        List<RiskAlert> alerts2 = testCondensationRisk();
        result.append(formatAlerts(alerts2)).append("\n\n");
        
        result.append("3. Test rizika Botrytis:\n");
        List<RiskAlert> alerts3 = testBotrytisRisk();
        result.append(formatAlerts(alerts3)).append("\n\n");
        
        result.append("4. Test alarma ventilacije:\n");
        List<RiskAlert> alerts4 = testVentilationAlarm();
        result.append(formatAlerts(alerts4)).append("\n\n");
        
        result.append("5. Test uslova za pepelnicu:\n");
        List<RiskAlert> alerts5 = testPowderyMildewConditions();
        result.append(formatAlerts(alerts5)).append("\n\n");
        
        result.append("6. Test trenda vlažnosti:\n");
        List<RiskAlert> alerts6 = testHumidityTrend();
        result.append(formatAlerts(alerts6)).append("\n\n");
        
        return result.toString();
    }

    private String formatAlerts(List<RiskAlert> alerts) {
        if (alerts.isEmpty()) {
            return "Nema generisanih alertova.";
        }
        
        StringBuilder sb = new StringBuilder();
        for (RiskAlert alert : alerts) {
            sb.append("  ALERT: ").append(alert.getMessage()).append("\n");
            sb.append("    Nivo: ").append(alert.getRiskLevel()).append("\n");
            if (alert.getDiseaseName() != null) {
                sb.append("    Bolest: ").append(alert.getDiseaseName()).append("\n");
            }
            if (alert.getRecommendation() != null) {
                sb.append("    Preporuka: ").append(alert.getRecommendation()).append("\n");
            }
            sb.append("\n");
        }
        return sb.toString();
    }

    @GetMapping("/demo")
    public String demonstrateCEP() {
        StringBuilder demo = new StringBuilder();
        demo.append("=== DEMONSTRACIJA COMPLEX EVENT PROCESSING (CEP) ===\n\n");
        
        demo.append("CEP sistem prati tokove događaja u realnom vremenu i detektuje kompleksne obrasce.\n");
        demo.append("Implementirani su sledeći CEP obrasci:\n\n");
        
        demo.append("E1 - Sliding Window (6h): Kritični uslovi za plamenjaču\n");
        demo.append("     RH > 85% + T ∈ [22,28]°C u poslednjih 6 sati\n\n");
        
        demo.append("E2 - Tumbling Window (24h): Rizik kondenzacije\n");
        demo.append("     RH > 90% ≥4h + ventilacija isključena ≥2h\n\n");
        
        demo.append("E3 - Sekvencijalni obrazac: Rizik Botrytis\n");
        demo.append("     Navodnjavanje → u 2h RH > 88% + CO₂ > 1200ppm\n\n");
        
        demo.append("E4 - Nedostajući događaj: Alarm ventilacije\n");
        demo.append("     RH > 90% bez aktivacije ventilacije u 30min\n\n");
        
        demo.append("E5 - Kombinovani uslovi: Optimalni uslovi za pepelnicu\n");
        demo.append("     T ∈ [20,25]°C + RH ∈ [60,80]% u 4h\n\n");
        
        demo.append("E6 - Trend analiza: Rastući trend vlažnosti\n");
        demo.append("     Kontinuirani rast vlažnosti u poslednjih 2h\n\n");
        
        demo.append("Testirajte pojedinačne scenarije:\n");
        demo.append("GET /api/cep/test-critical-conditions\n");
        demo.append("GET /api/cep/test-condensation-risk\n");
        demo.append("GET /api/cep/test-botrytis-risk\n");
        demo.append("GET /api/cep/test-ventilation-alarm\n");
        demo.append("GET /api/cep/test-powdery-mildew\n");
        demo.append("GET /api/cep/test-humidity-trend\n");
        demo.append("GET /api/cep/test-all-cep\n");
        
        return demo.toString();
    }
}