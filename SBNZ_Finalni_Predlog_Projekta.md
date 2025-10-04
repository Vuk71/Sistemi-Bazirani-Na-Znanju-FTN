# Pametni sistem za preporuku tretmana biljnih bolesti u plastenicima

**Finalni predlog projekta za odbranu**

---

## Član tima

* **Vuk Dimitrov** - SW-03/2021

---

## 📋 Pregled implementacije

### ✅ Implementirani kompleksni mehanizmi

| Mehanizam | Status | Kompleksnost | Opis |
|-----------|--------|--------------|------|
| **Forward Chaining** | ✅ Implementiran | **3+ nivoa ulančavanja** | Operativne odluke i preporuke tretmana |
| **Backward Chaining** | ✅ Implementiran | **Rekurzivni upiti** | Dijagnostički upiti kroz stablo činjenica |
| **Complex Event Processing** | ✅ Implementiran | **Pravi temporalni operatori** | Rana detekcija rizika u realnom vremenu |

### 🎯 Finalni deliverables

- [x] **Klijentska aplikacija (UI)** - React aplikacija sa kompletnim interfejsom
- [x] **Testni podaci** - 5 strukturiranih test scenarija
- [x] **Ažuriran predlog projekta** - Ovaj dokument
- [x] **Kompletna dokumentacija** - README fajlovi sa instrukcijama

---

## 🚀 Motivacija

Bolesti u plastenicima mogu prouzrokovati značajan pad prinosa i kvaliteta.
Pravovremena odluka o tretmanu je kritična, a većina proizvođača nema stalnu podršku agronoma.

Ekspertski sistem baziran na pravilima, uz obradu događaja (CEP), omogućava:

* **Ranu detekciju rizika** kroz temporalne obrasce
* **Ciljane tretmane** na osnovu kompleksnog zaključivanja
* **Smanjenje upotrebe hemikalija** kroz precizne preporuke
* **Objašnjivo zaključivanje** kroz Backward Chaining upite

---

## 🎯 Pregled problema

Postojeća rešenja **ne integrišu**:

* senzorske podatke u realnom vremenu,
* istoriju tretmana i rezistenciju,
* kontekst fenofaze biljke,
* temporalne obrasce rizika.

Nedostaje sistem koji kombinuje **simptome, mikroklimu, istoriju infekcija i karencu preparata** sa **objašnjivim zaključivanjem** i **ranom detekcijom rizika**.

---

## 💡 Predloženi sistem

### 🔄 Forward Chaining - Operativne odluke
* **3+ nivoa ulančavanja pravila** za kompleksno zaključivanje
* **15 implementiranih pravila** (R01-R15) za dijagnostiku i tretmane
* **Bayes analiza** za slučajeve sa više verovatnih bolesti
* **Ograničenja tretmana** na osnovu karenci i fenofaza

### 🔍 Backward Chaining - Dijagnostički upiti
* **Stablo činjenica** sa hijerarhijskim tipovima znanja
* **Rekurzivni upiti** koji koriste postojeće činjenice za nova zaključivanja
* **3 tipa upita**: IS_DISEASE_PROBABLE, IS_TREATMENT_ALLOWED, WHAT_CAUSED_RISK
* **Objašnjivo zaključivanje** sa detaljnim trace-om

### ⚡ Complex Event Processing - Rana detekcija
* **Pravi temporalni operatori**: SLIDING WINDOW, TUMBLING WINDOW, AFTER, NOT
* **6 CEP obrazaca** (E1-E6) za različite tipove rizika
* **Stream processing** sa pseudo-clock konfiguracijom
* **Kombinovani uslovi** sa temporalnim ograničenjima

---

## 👥 Tipovi korisnika

* **Poljoprivrednik**: unos simptoma, primena i potvrda tretmana, administracija plastenika i senzora
* **Agronom**: unos i izmena pravila, verifikacija dijagnoza i tretmana
* **Sistem**: obrada događaja, zaključivanje, generisanje izveštaja i notifikacija

---

## 📊 Ulazi u sistem

* **Senzorska očitavanja**: temperatura, vlažnost, CO₂, svetlo, tačka rose, brzina vazduha
* **Ručno uneseni simptomi**: žutilo, praškaste naslage, lezije, trulež, mozaik
* **Kontekst**: kultura, sorta, fenofaza, istorija bolesti i tretmana
* **Operativni događaji**: navodnjavanje, provetravanje, tretmani

---

## 📈 Izlazi iz sistema

* **Rang-lista verovatnih bolesti** sa objašnjenjem i verovatnoćama
* **Preporučeni tretmani** (doza, termin, ograničenja, prioritet)
* **Preventivne preporuke** i korekcije mikroklime
* **Alarmni događaji** iz CEP analize sa temporalnim kontekstom
* **Backward Chaining odgovori** na dijagnostičke upite
* **Izveštaji**: učestalost bolesti, uspešnost tretmana, korelacija uslova

---

## 🧠 Baza znanja

### Ontologija domena
`{Bolest, Simptom, Uslov, Tretman, Preparat, Kontraindikacija, Kultura, Fenofaza, Prag, Događaj, Fakt, Upit, Alert}`

### Implementirane bolesti
* **Plamenjača** (Phytophthora infestans) - kompleksno ulančavanje
* **Pepelnica** (Erysiphe cichoracearum) - stabilni uslovi
* **Siva trulež** (Botrytis cinerea) - visoka vlažnost + CEP
* **Fuzarijum** (Fusarium oxysporum) - pH faktori
* **Virus mozaika** (TMV) - sanitarne mere

### Tipovi tretmana
* **Hemijski**: Bakarni preparati sa karencama
* **Biološki**: Biološki fungicidi, Trichoderma
* **Sanitarni**: Uklanjanje biljaka, dezinfekcija alata
* **Preventivni**: Ventilacija, pH korekcija

---

## 📐 Implementirana pravila

### Forward Chaining pravila (R01-R15)

| Pravilo | Opis | Nivo | Tip |
|---------|------|------|-----|
| **R01** | Kritični uslovi za plamenjaču (RH>85%, T∈[22,28]°C) | 1 | Detekcija |
| **R02** | Plamenjača + vodenaste lezije → +25% | 2 | Kombinovanje |
| **R11** | Visoka vlažnost → dodatni rizik | 3 | Pojačavanje |
| **R03** | Preporuka tretmana (≥70%) | 4 | Akcija |
| **R04** | Pepelnica sa belim naslagama | 1 | Jednostavan |
| **R05** | Pepelnica u fenofazi plodonošenja → biološki | 2 | Ograničenje |
| **R06** | Siva trulež + visoka vlažnost | 1 | Složen |
| **R07** | Fuzarijum (uvenuće + posmeđenje) | 1 | Složen |
| **R08** | Fuzarijum + pH<5.5 → Trichoderma | 2 | Specifičan |
| **R09** | Virus mozaika (mozaik bez gljivica) | 1 | Isključivanje |
| **R10** | Virus → sanitarne mere | 2 | Akcija |
| **R13** | Isti MOA >3x → upozorenje rezistencija | - | Kontrola |
| **R14** | Karenca > plan berbe → blokiranje | - | Ograničenje |
| **R15** | Više bolesti → Bayes analiza | - | Napredna |

### Backward Chaining upiti

| Upit | Opis | Rekurzivnost |
|------|------|--------------|
| **C1** | IS_DISEASE_PROBABLE | Verovatnoća → Prag → Faktori |
| **C2** | IS_TREATMENT_ALLOWED | Dozvola → Fenofaza → Ograničenja |
| **C3** | WHAT_CAUSED_RISK | Uzrok → Uslovi → Analiza |

### CEP obrasci sa temporalnim operatorima

| Obrazac | Opis | Temporalni operator | Kompleksnost |
|---------|------|-------------------|--------------|
| **E1** | Kritični uslovi plamenjače | `over window:time(6h)` - SLIDING | Visoka |
| **E2** | Rizik kondenzacije | `over window:time(24h)` - TUMBLING | Visoka |
| **E3** | Botrytis sekvencijalno | `after[0s,2h]` - SEKVENCIJALNI | Visoka |
| **E4** | Nedostajuća ventilacija | `not ... after[0s,30m]` - NOT | Visoka |
| **E5** | Stabilni uslovi pepelnice | `over window:time(4h)` - DURING | Srednja |
| **E6** | Rastući trend vlažnosti | `after[30m,2h]` - BEFORE | Srednja |

---

## 🏗️ Arhitektura sistema

### Backend (Spring Boot + Drools)
```
sbnz_projekat/
├── model/          # Domenski model (Disease, Symptom, Treatment, Fact, etc.)
├── kjar/           # Drools pravila organizovana po kategorijama
│   ├── forward/    # Forward chaining pravila
│   ├── backward/   # Backward chaining pravila
│   └── cep/        # CEP pravila sa temporalnim operatorima
└── service/        # Spring Boot aplikacija sa REST API
```

### Frontend (React)
```
frontend/
├── components/     # React komponente za svaki mehanizam
│   ├── Dashboard.js           # Pregled sistema
│   ├── DiagnosisPage.js       # Forward Chaining
│   ├── BackwardChainingPage.js # Backward Chaining
│   ├── CEPPage.js             # CEP analiza
│   └── TestDataPage.js        # Testni podaci
└── services/       # API integracija
```

### Drools konfiguracija
```xml
<kbase name="forwardBase" packages="forward">
    <ksession name="forwardKsession"/>
</kbase>
<kbase name="bwBase" packages="backward" equalsBehavior="equality">
    <ksession name="bwKsession" type="stateful"/>
</kbase>
<kbase name="cepKbase" eventProcessingMode="stream" packages="cep">
    <ksession name="cepKsession" clockType="pseudo"/>
</kbase>
```

---

## 🧪 Testni podaci i scenariji

### 5 kompletnih test scenarija

| Scenario | Bolest | FC nivoi | BC upiti | CEP operatori | Kompleksnost |
|----------|--------|----------|----------|---------------|--------------|
| **S1** | Plamenjača | 4 nivoa | C1,C2,C3 | E1,E4 | **Visoka** |
| **S2** | Pepelnica | 2 nivoa | C1,C2 | E5 | Srednja |
| **S3** | Siva trulež | 2 nivoa | C1,C3 | E2,E3 | **Visoka** |
| **S4** | Fuzarijum | 2 nivoa | C2,C3 | - | Srednja |
| **S5** | Virus mozaika | 2 nivoa | C1,C2 | - | Niska |

### Primer kompleksnog scenarija (S1: Plamenjača)

**Ulazni podaci:**
- Temperatura: 25.0°C, Vlažnost: 87.0%
- Simptomi: Vodenaste lezije, Tamne mrlje, Bela prevlaka
- Fenofaza: VEGETATIVE

**Forward Chaining (4 nivoa):**
1. R01: Kritični uslovi → 30%
2. R02: + Vodenaste lezije → 55%
3. R11: + Visoka vlažnost → 65%
4. R03: Preporuka tretmana → Bakarni preparat

**Backward Chaining:**
- C1: Plamenjača verovatna? → DA (75%)
- C2: Bakarni preparat dozvoljen? → DA
- C3: Uzroci rizika? → RH+T+Simptomi

**CEP:**
- E1: SLIDING WINDOW alarm (6h)
- E4: TEMPORALNI NOT alarm (ventilacija)

---

## 🔧 Tehnologije

### Backend
- **Java 11** - Programski jezik
- **Spring Boot 2.7.9** - Application framework
- **Drools 7.49.0.Final** - Rule engine sa CEP podrškom
- **Maven** - Build tool i dependency management

### Frontend
- **React 18.2.0** - UI framework
- **React Router 6.3.0** - Client-side routing
- **Axios 0.27.2** - HTTP klijent za API komunikaciju
- **Responsive CSS** - Prilagodljiv dizajn

### Integracija
- **REST API** - Komunikacija između frontend-a i backend-a
- **JSON** - Format za razmenu podataka
- **Proxy konfiguracija** - Development setup

---

## 🚀 Pokretanje sistema

### Backend
```bash
cd sbnz_projekat
./mvnw clean install
./mvnw spring-boot:run -pl service
# Dostupno na http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm start
# Dostupno na http://localhost:3000
```

### API testiranje
```bash
# Forward Chaining
curl http://localhost:8080/api/diagnosis/test-complex-chaining

# Backward Chaining
curl http://localhost:8080/api/backward-chaining/test-all-backward

# CEP
curl http://localhost:8080/api/cep/test-all-cep
```

---

## 📊 Rezultati implementacije

### Kvantitativni pokazatelji

| Metrika | Vrednost |
|---------|----------|
| **Forward Chaining pravila** | 15 |
| **Maksimalni nivoi ulančavanja** | 4+ |
| **Backward Chaining upita** | 8 |
| **CEP obrazaca** | 6 |
| **Temporalnih operatora** | 8 |
| **Test scenarija** | 5 |
| **Podržanih bolesti** | 5 |
| **API endpoints** | 20+ |

### Kvalitativni pokazatelji

- ✅ **Kompleksnost Forward Chaining**: 3+ nivoa ulančavanja implementirano
- ✅ **Rekurzivnost Backward Chaining**: Stablo činjenica sa rekurzivnim upitima
- ✅ **Pravi temporalni operatori**: SLIDING, TUMBLING, AFTER, NOT implementirani
- ✅ **Objašnjivo zaključivanje**: Detaljni trace svih mehanizama
- ✅ **Kompletna UI**: Interaktivni interfejs za sve funkcionalnosti
- ✅ **Strukturirani testovi**: 5 kompletnih scenarija za demonstraciju

---

## 🎯 Demonstracija za odbranu

### Redosled demonstracije

1. **Pregled sistema** (Dashboard)
   - Status svih komponenti
   - Implementirani mehanizmi
   - Podržane bolesti

2. **Forward Chaining** (Kompleksno ulančavanje)
   - Scenario S1: Plamenjača
   - 4 nivoa ulančavanja
   - Detaljni trace pravila

3. **Backward Chaining** (Rekurzivni upiti)
   - Prilagođeni upit za Plamenjaču
   - Stablo činjenica
   - Rekurzivno zaključivanje

4. **CEP** (Temporalni operatori)
   - E1: SLIDING WINDOW test
   - E4: TEMPORALNI NOT test
   - Prikaz temporalnih operatora

5. **Testni podaci** (Strukturirani scenariji)
   - Kompletni scenario S1
   - Svi ulazni podaci
   - Očekivani rezultati

### Ključne tačke za objašnjenje

- **Kompleksnost implementacije**: 3 napredna mehanizma
- **Pravi temporalni operatori**: Ne simulacija već pravi CEP
- **Rekurzivni upiti**: Stablo činjenica sa hijerarhijskim zaključivanjem
- **Praktična primena**: Realni scenariji iz poljoprivrede
- **Kompletna arhitektura**: Backend + Frontend + Testni podaci

---

## 📈 Buduća proširenja

### Kratkoročna proširenja
- **Mobilna aplikacija** - React Native verzija
- **Real-time notifikacije** - WebSocket integracija
- **Grafički prikazi** - Vizualizacija podataka i trendova
- **Offline mode** - Service Worker za rad bez interneta

### Dugoročna proširenja
- **Machine Learning integracija** - Hibridni pristup sa ML modelima
- **IoT senzori** - Direktna integracija sa hardware senzorima
- **Multi-tenant arhitektura** - Podrška za više korisnika/farmi
- **Blockchain** - Nepromenjiva evidencija tretmana za sertifikaciju

---

## 📚 Zaključak

Implementiran je **kompletan ekspertski sistem** koji demonstrira sve zahtevane napredne mehanizme:

### ✅ Ispunjeni zahtevi

1. **Forward Chaining sa 3+ nivoa ulančavanja** - Implementirano sa 4 nivoa
2. **Backward Chaining sa rekurzivnim upitima** - Stablo činjenica implementirano
3. **CEP sa pravim temporalnim operatorima** - 8 različitih operatora
4. **Klijentska aplikacija** - Kompletna React aplikacija
5. **Testni podaci** - 5 strukturiranih scenarija
6. **Dokumentacija** - Kompletna sa instrukcijama

### 🎯 Inovativni aspekti

- **Hibridni pristup** - Kombinacija sva tri mehanizma u jednom sistemu
- **Praktična primena** - Realni problem iz poljoprivrede
- **Objašnjivo AI** - Transparentno zaključivanje sa detaljnim trace-om
- **Temporalna analiza** - Rana detekcija rizika kroz CEP obrasce
- **Interaktivni UI** - Intuitivni interfejs za sve funkcionalnosti

Sistem predstavlja **naprednu implementaciju** ekspertskih sistema sa praktičnom primenom u poljoprivredi, demonstrirajući sve zahtevane kompleksne mehanizme kroz realne scenarije dijagnostike biljnih bolesti.

---

**Datum:** Mart 2024  
**Autor:** Vuk Dimitrov (SW-03/2021)  
**Kurs:** Sistemi bazirani na znanju  
**Fakultet tehničkih nauka, Univerzitet u Novom Sadu**