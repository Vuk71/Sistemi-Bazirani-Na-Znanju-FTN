package com.ftn.sbnz.service;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MainDemoController {

    @GetMapping("/demo")
    public String demonstrateSystem() {
        StringBuilder demo = new StringBuilder();
        demo.append("=== PAMETNI SISTEM ZA PREPORUKU TRETMANA BILJNIH BOLESTI ===\n\n");
        
        demo.append("Sistem implementira tri kompleksna mehanizma:\n\n");
        
        demo.append("1. FORWARD CHAINING - Operativne odluke i preporuke tretmana\n");
        demo.append("   • 3+ nivoa ulančavanja pravila\n");
        demo.append("   • Automatska dijagnoza na osnovu simptoma i uslova\n");
        demo.append("   • Preporuke tretmana sa prioritizacijom\n");
        demo.append("   • Provera ograničenja (karenca, fenofaza, rezistencija)\n");
        demo.append("   Testiraj: GET /api/diagnosis/test-all\n\n");
        
        demo.append("2. BACKWARD CHAINING - Dijagnostički upiti\n");
        demo.append("   • C1: Da li je bolest X verovatna?\n");
        demo.append("   • C2: Da li je tretman Y dozvoljen u fenofazi Z?\n");
        demo.append("   • C3: Koji uslovi su doveli do rizika bolesti X?\n");
        demo.append("   Testiraj: GET /api/backward-chaining/test-all-backward\n\n");
        
        demo.append("3. COMPLEX EVENT PROCESSING (CEP) - Rana detekcija rizika\n");
        demo.append("   • E1: Sliding window - Kritični uslovi za plamenjaču\n");
        demo.append("   • E2: Tumbling window - Rizik kondenzacije\n");
        demo.append("   • E3: Sekvencijalni obrazac - Rizik Botrytis\n");
        demo.append("   • E4: Nedostajući događaj - Alarm ventilacije\n");
        demo.append("   • E5: Kombinovani uslovi - Optimalni uslovi za pepelnicu\n");
        demo.append("   • E6: Trend analiza - Rastući trend vlažnosti\n");
        demo.append("   Testiraj: GET /api/cep/test-all-cep\n\n");
        
        demo.append("DEMONSTRACIJA AKTIVACIJE PRAVILA:\n");
        demo.append("GET /api/diagnosis/test-complex-chaining - Kompleksno ulančavanje\n");
        demo.append("GET /api/cep/test-critical-conditions - CEP alarm\n");
        demo.append("GET /api/backward-chaining/test-high-probability-disease - BC upit\n\n");
        
        demo.append("STRUKTURA PRAVILA:\n");
        demo.append("• Logika i proračuni su izdvojeni iz THEN dela\n");
        demo.append("• Koriste se pomoćne funkcije i objekti\n");
        demo.append("• Pravila su modularna i lako proširiva\n");
        demo.append("• Objašnjenja su automatski generisana\n");
        
        return demo.toString();
    }
}