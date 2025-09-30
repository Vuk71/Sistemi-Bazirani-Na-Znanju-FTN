# 🧪 Testni podaci za finalnu odbranu

Strukturirani test scenariji za demonstraciju svih funkcionalnosti Greenhouse Expert System-a.

## 📋 Pregled test scenarija

| Scenario | Bolest | Forward Chaining | Backward Chaining | CEP | Kompleksnost |
|----------|--------|------------------|-------------------|-----|--------------|
| **S1** | Plamenjača | ✅ 3+ nivoa | ✅ Rekurzivni upiti | ✅ E1, E4 | Visoka |
| **S2** | Pepelnica | ✅ Jednostavan | ✅ C1, C2 | ✅ E5 | Srednja |
| **S3** | Siva trulež | ✅ Složen | ✅ C1, C3 | ✅ E2, E3 | Visoka |
| **S4** | Fuzarijum | ✅ Specifičan | ✅ C2, C3 | ❌ Simptomi | Srednja |
| **S5** | Virus mozaika | ✅ Jednostavan | ✅ C1, C2 | ❌ Simptomi | Niska |

---

## 🍅 S1: Plamenjača (Phytophthora infestans)

### Ulazni podaci
```json
{
  "environmentalConditions": {
    "temperature": 25.0,
    "humidity": 87.0,
    "co2Level": 800,
    "ventilationActive": false,
    "timestamp": "2024-03-15T14:30:00"
  },
  "symptoms": [
    {
      "name": "Vodenaste lezije",
      "severity": 3,
      "location": "Listovi",
      "present": true
    },
    {
      "name": "Tamne mrlje",
      "severity": 2,
      "location": "Plodovi",
      "present": true
    },
    {
      "name": "Bela prevlaka",
      "severity": 2,
      "location": "Naličje lista",
      "present": true
    }
  ],
  "crop": {
    "type": "Paradajz",
    "variety": "Cherry",
    "phenophase": "VEGETATIVE",
    "plantedDate": "2024-02-01"
  }
}
```

### Forward Chaining - Očekivani rezultat
```
=== KOMPLEKSNO ULANČAVANJE (3+ NIVOA) ===
NIVO 1: R01 - Kritični uslovi za plamenjaču
        RH: 87.0% > 85% ✓
        T: 25.0°C ∈ [22,28]°C ✓
        → Povećana verovatnoća: 30.0%

NIVO 2: R02 - Vodenaste lezije + visok rizik
        Simptom: Vodenaste lezije ✓
        Rizik plamenjače: VISOK ✓
        → Povećana verovatnoća: 55.0%

NIVO 3: R11 - Dodatni faktori rizika
        RH > 85% kontinuirano ✓
        → Povećana verovatnoća: 65.0%

NIVO 4: R03 - Generisanje preporuke
        Verovatnoća ≥ 70% ✓
        → Preporučen: Bakarni preparat

REZULTAT:
- Dijagnoza: Plamenjača (75.0%)
- Tretman: Bakarni preparat (Prioritet 3)
- Aktivirano pravila: 4
```

### Backward Chaining - Očekivani rezultat
```
=== REKURZIVNI UPITI KROZ STABLO ČINJENICA ===

C1: Da li je Plamenjača verovatna?
    → Upit: IS_DISEASE_PROBABLE(Plamenjača)
    → Fakt: DISEASE_PROBABLE(Plamenjača, 75.0%)
    → Rekurzivni upit: Verovatnoća > 50%?
    → Odgovor: DA (75.0% > 50%)

C2: Da li je Bakarni preparat dozvoljen u VEGETATIVE fazi?
    → Upit: IS_TREATMENT_ALLOWED(Bakarni preparat, VEGETATIVE)
    → Fakt: TREATMENT_ALLOWED(Bakarni preparat, VEGETATIVE, true)
    → Rekurzivni upit: Nema ograničenja?
    → Odgovor: DA (dozvoljen)

C3: Koji uslovi su doveli do rizika Plamenjače?
    → Upit: WHAT_CAUSED_RISK(Plamenjača)
    → Fakt: RISK_CAUSE(Plamenjača, "Kritični uslovi")
    → Rekurzivni upit: Analiza uzroka
    → Odgovor: RH=87.0% + T=25.0°C + Vodenaste lezije
```

### CEP - Očekivani rezultat
```
=== TEMPORALNI OPERATORI ===

E1: SLIDING WINDOW (6h) - Kritični uslovi
    Pattern: RH > 85% AND T ∈ [22,28]°C
    Window: over window:time(6h)
    Rezultat: ALARM - 5 očitavanja u 6h

E4: TEMPORALNI NOT - Nedostajuća ventilacija
    Pattern: RH > 90% AND NOT VentilationEvent after[0s,30m]
    Rezultat: ALARM - Nema ventilacije 30min

Generisano alertova: 2
Korišćeni operatori: SLIDING WINDOW, TEMPORALNI NOT
```

---

## 🤍 S2: Pepelnica (Erysiphe cichoracearum)

### Ulazni podaci
```json
{
  "environmentalConditions": {
    "temperature": 22.0,
    "humidity": 70.0,
    "co2Level": 900,
    "ventilationActive": true,
    "timestamp": "2024-03-15T10:00:00"
  },
  "symptoms": [
    {
      "name": "Bele praškaste naslage",
      "severity": 3,
      "location": "Listovi",
      "present": true
    },
    {
      "name": "Žutilo starijih listova",
      "severity": 2,
      "location": "Donji listovi",
      "present": true
    }
  ],
  "crop": {
    "type": "Krastavac",
    "variety": "Salad",
    "phenophase": "FLOWERING",
    "plantedDate": "2024-01-15"
  }
}
```

### Forward Chaining - Očekivani rezultat
```
=== JEDNOSTAVAN FORWARD CHAINING ===
R04: Pepelnica sa belim naslagama
     Simptom: Bele praškaste naslage ✓
     Nema kondenzacije ✓
     → Dijagnoza: Pepelnica (85.0%)

R05: Tretman u fenofazi cvetanja
     Pepelnica potvrđena ✓
     Fenofaza: FLOWERING ✓
     → Preporučen: Biološki fungicid

REZULTAT:
- Dijagnoza: Pepelnica (85.0%)
- Tretman: Biološki fungicid (Prioritet 2)
```

### CEP - Očekivani rezultat
```
E5: TEMPORALNI DURING - Stabilni uslovi
    Pattern: T ∈ [20,25]°C AND RH ∈ [60,80]% DURING 4h
    Window: over window:time(4h)
    Rezultat: OPTIMALNI USLOVI za Erysiphe
```

---

## 🫐 S3: Siva trulež (Botrytis cinerea)

### Ulazni podaci
```json
{
  "environmentalConditions": {
    "temperature": 18.0,
    "humidity": 92.0,
    "co2Level": 1200,
    "ventilationActive": false,
    "timestamp": "2024-03-15T08:00:00"
  },
  "symptoms": [
    {
      "name": "Siva prevlaka",
      "severity": 4,
      "location": "Plodovi",
      "present": true
    },
    {
      "name": "Meke trule mrlje",
      "severity": 4,
      "location": "Plodovi",
      "present": true
    }
  ],
  "events": [
    {
      "type": "IrrigationEvent",
      "timestamp": "2024-03-15T06:00:00",
      "duration": 30
    }
  ]
}
```

### Forward Chaining - Očekivani rezultat
```
=== SLOŽEN FORWARD CHAINING ===
R06: Siva trulež + visoka vlažnost
     Simptom: Siva prevlaka ✓
     RH > 90% ✓
     → Dijagnoza: Siva trulež (90.0%)
     → Preporučeno: Uklanjanje + ventilacija

REZULTAT:
- Dijagnoza: Siva trulež (90.0%)
- Tretmani: Sanitarne mere + Ventilacija
```

### CEP - Očekivani rezultat
```
E2: TUMBLING WINDOW (24h) - Kondenzacija
    Pattern: RH > 90% AND VentilationActive = false
    Window: over window:time(24h)
    Rezultat: KRITIČNA ZASIĆENOST

E3: SEKVENCIJALNI - Botrytis rizik
    Pattern: IrrigationEvent → RH > 88% after[0s,2h]
    Rezultat: VISOK RIZIK Botrytis
```

---

## 🍄 S4: Fuzarijum (Fusarium oxysporum)

### Ulazni podaci
```json
{
  "environmentalConditions": {
    "temperature": 28.0,
    "humidity": 65.0,
    "co2Level": 1000,
    "ventilationActive": true,
    "soilPH": 5.2
  },
  "symptoms": [
    {
      "name": "Uvenuće biljaka",
      "severity": 4,
      "location": "Cela biljka",
      "present": true
    },
    {
      "name": "Posmeđenje žila",
      "severity": 3,
      "location": "Stablo",
      "present": true
    }
  ]
}
```

### Forward Chaining - Očekivani rezultat
```
R07: Fuzarijum (uvenuće + posmeđenje)
     Simptom: Uvenuće ✓
     Simptom: Posmeđenje žila ✓
     → Dijagnoza: Fuzarijum (80.0%)

R08: pH korekcija
     Fuzarijum potvrđen ✓
     pH < 5.5 ✓
     → Preporučen: Trichoderma + pH korekcija
```

---

## 🦠 S5: Virus mozaika (TMV)

### Ulazni podaci
```json
{
  "environmentalConditions": {
    "temperature": 24.0,
    "humidity": 60.0,
    "co2Level": 850,
    "ventilationActive": true
  },
  "symptoms": [
    {
      "name": "Mozaik šare",
      "severity": 3,
      "location": "Listovi",
      "present": true
    },
    {
      "name": "Deformacija listova",
      "severity": 2,
      "location": "Mladi listovi",
      "present": true
    }
  ]
}
```

### Forward Chaining - Očekivani rezultat
```
R09: Virus mozaika
     Simptom: Mozaik šare ✓
     Nema gljivičnih prevlaka ✓
     → Dijagnoza: Virus mozaika (70.0%)

R10: Sanitarne mere
     Virus potvrđen ✓
     → Preporučeno: Uklanjanje biljaka + dezinfekcija
```

---

## 🚀 Instrukcije za pokretanje testova

### 1. Backend testovi (cURL)
```bash
# Pozicioniraj se u sbnz_projekat direktorijum
cd sbnz_projekat

# Pokreni Spring Boot aplikaciju
./mvnw spring-boot:run -pl service

# U novom terminalu, pokreni testove:

# S1: Plamenjača - Kompleksno ulančavanje
curl http://localhost:8080/api/diagnosis/test-complex-chaining

# S2: Pepelnica - Jednostavan test
curl http://localhost:8080/api/diagnosis/test-pepelnica

# S3: Siva trulež - Složen test
curl http://localhost:8080/api/diagnosis/test-siva-trulez

# S4: Fuzarijum - Specifičan test
curl http://localhost:8080/api/diagnosis/test-fuzarijum

# S5: Virus mozaika - Jednostavan test
curl http://localhost:8080/api/diagnosis/test-virus

# Backward Chaining testovi
curl http://localhost:8080/api/backward-chaining/test-all-backward

# CEP testovi
curl http://localhost:8080/api/cep/test-all-cep

# Svi testovi odjednom
curl http://localhost:8080/api/diagnosis/test-all
```

### 2. Frontend testovi
```bash
# Pozicioniraj se u frontend direktorijum
cd frontend

# Instaliraj dependencies
npm install

# Pokreni React aplikaciju
npm start

# Otvori http://localhost:3000 u browser-u
# Navigiraj kroz sekcije i pokreni testove
```

### 3. Demonstracija za odbranu

#### Redosled demonstracije:
1. **Dashboard** - Pregled statusa sistema
2. **Forward Chaining** - Pokreni "Kompleksno ulančavanje" test
3. **Backward Chaining** - Pokreni prilagođeni upit za Plamenjaču
4. **CEP** - Pokreni "Kritični uslovi" test
5. **Testni podaci** - Prikaži scenario S1 (Plamenjača)

#### Ključne tačke za objašnjenje:
- **3+ nivoa ulančavanja** u Forward Chaining-u
- **Rekurzivni upiti** kroz stablo činjenica u Backward Chaining-u
- **Pravi temporalni operatori** u CEP-u (SLIDING WINDOW, AFTER, NOT)
- **Kompletan test scenario** sa svim podacima

---

## 📊 Statistike test podataka

| Metrika | Vrednost |
|---------|----------|
| **Ukupno scenarija** | 5 |
| **Forward Chaining testova** | 15 |
| **Backward Chaining upita** | 8 |
| **CEP obrazaca** | 6 |
| **Podržanih bolesti** | 5 |
| **Tipova tretmana** | 4 |
| **Temporalnih operatora** | 8 |
| **Nivoa ulančavanja** | 4+ |

---

## ✅ Checklist za finalnu odbranu

- [x] **Klijentska aplikacija (UI)** - React aplikacija sa svim funkcionalnostima
- [x] **Testni podaci** - 5 kompletnih scenarija sa strukturiranim podacima
- [x] **Forward Chaining** - 3+ nivoa ulančavanja implementirano
- [x] **Backward Chaining** - Rekurzivni upiti kroz stablo činjenica
- [x] **CEP** - Pravi temporalni operatori (SLIDING, TUMBLING, AFTER, NOT)
- [x] **Dokumentacija** - Kompletna dokumentacija sa instrukcijama
- [x] **API testovi** - cURL komande za sve funkcionalnosti
- [x] **UI testovi** - Interaktivni testovi kroz web interfejs
- [x] **Demo scenariji** - Pripremljeni scenariji za demonstraciju