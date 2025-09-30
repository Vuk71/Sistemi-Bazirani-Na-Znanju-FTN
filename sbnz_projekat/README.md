# Pametni sistem za preporuku tretmana biljnih bolesti u plastenicima

Napredni ekspertski sistem koji implementira **tri kompleksna mehanizma** za dijagnostiku biljnih bolesti i preporuku tretmana:

- **Forward Chaining** - Operativne odluke i preporuke tretmana
- **Backward Chaining** - Dijagnostički upiti i objašnjavanje
- **Complex Event Processing (CEP)** - Rana detekcija rizika u realnom vremenu

## Preduslovi

- **Java 11** ili noviji
- **Maven 3.6+** (ili koristi uključeni Maven wrapper)
- **Node.js 16+** (za frontend aplikaciju)
- **npm** ili **yarn** (za frontend dependencies)

### Instalacija Java-e na macOS

```bash
# Instalacija preko Homebrew
brew install openjdk@11

# Dodavanje u PATH
echo 'export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc

# Kreiranje system symlink
sudo ln -sfn /opt/homebrew/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk
```

## 🚀 Pokretanje sistema

### 1. Build backend projekta

```bash
# Pozicioniraj se u root direktorijum
cd sbnz_projekat

# Build svih modula
./mvnw clean install
```

### 2. Pokretanje backend aplikacije

```bash
# Pokretanje Spring Boot aplikacije
./mvnw spring-boot:run -pl service
```

Backend će biti dostupan na `http://localhost:8080`

### 3. Pokretanje frontend aplikacije

```bash
# Pozicioniraj se u frontend direktorijum
cd frontend

# Instaliraj dependencies
npm install

# Pokreni React aplikaciju
npm start
```

Frontend će biti dostupan na `http://localhost:3000`

### 4. Kompletna demonstracija

Za finalnu odbranu, pokrenite oba dela sistema:
1. Backend na portu 8080
2. Frontend na portu 3000
3. Otvorite `http://localhost:3000` u browser-u
4. Navigirajte kroz sekcije i testirajte funkcionalnosti

### 3. Testiranje sistema

#### 🔄 Forward Chaining - Dijagnostika i tretmani

```bash
# Osnovni testovi dijagnoze
curl http://localhost:8080/api/diagnosis/test-plamenjaca
curl http://localhost:8080/api/diagnosis/test-pepelnica
curl http://localhost:8080/api/diagnosis/test-siva-trulez
curl http://localhost:8080/api/diagnosis/test-fuzarijum
curl http://localhost:8080/api/diagnosis/test-virus

# Napredni testovi
curl http://localhost:8080/api/diagnosis/test-complex-chaining
curl http://localhost:8080/api/diagnosis/test-multiple-diseases
curl http://localhost:8080/api/diagnosis/test-treatment-restrictions

# Svi Forward Chaining testovi
curl http://localhost:8080/api/diagnosis/test-all
```

#### 🔍 Backward Chaining - Dijagnostički upiti

```bash
# C1: Da li je bolest verovatna?
curl http://localhost:8080/api/backward-chaining/test-high-probability-disease
curl http://localhost:8080/api/backward-chaining/test-low-probability-disease

# C2: Da li je tretman dozvoljen u fenofazi?
curl http://localhost:8080/api/backward-chaining/test-treatment-allowed-vegetative
curl http://localhost:8080/api/backward-chaining/test-treatment-blocked-fruiting

# C3: Koji uslovi su doveli do rizika?
curl http://localhost:8080/api/backward-chaining/test-what-caused-plamenjaca
curl http://localhost:8080/api/backward-chaining/test-what-caused-pepelnica

# Svi Backward Chaining testovi
curl http://localhost:8080/api/backward-chaining/test-all-backward

# Prilagođeni upiti
curl http://localhost:8080/api/backward-chaining/query-disease/Plamenjača
curl http://localhost:8080/api/backward-chaining/query-treatment/Bakarni%20preparat/FRUITING
```

#### ⚡ Complex Event Processing (CEP) - Rana detekcija

```bash
# E1: Kritični uslovi za plamenjaču (sliding window 6h)
curl http://localhost:8080/api/cep/test-critical-conditions

# E2: Rizik kondenzacije (tumbling window 24h)
curl http://localhost:8080/api/cep/test-condensation-risk

# E3: Rizik Botrytis nakon navodnjavanja (sekvencijalni obrazac)
curl http://localhost:8080/api/cep/test-botrytis-risk

# E4: Alarm ventilacije (nedostajući događaj)
curl http://localhost:8080/api/cep/test-ventilation-alarm

# E5: Optimalni uslovi za pepelnicu (kombinovani uslovi)
curl http://localhost:8080/api/cep/test-powdery-mildew

# E6: Rastući trend vlažnosti (trend analiza)
curl http://localhost:8080/api/cep/test-humidity-trend

# Svi CEP testovi
curl http://localhost:8080/api/cep/test-all-cep
```

#### 📋 Pregled sistema

```bash
# Demonstracija svih mehanizama
curl http://localhost:8080/api/demo

# Demonstracija pojedinačnih mehanizama
curl http://localhost:8080/api/cep/demo
curl http://localhost:8080/api/backward-chaining/demo
```

## Arhitektura projekta

```
sbnz_projekat/
├── model/          # Domenski model (entiteti, enumi)
├── kjar/           # Drools pravila i konfiguracija
├── service/        # Spring Boot aplikacija i servisi
├── frontend/       # React klijentska aplikacija
│   ├── src/
│   │   ├── components/     # React komponente
│   │   ├── services/       # API servisi
│   │   └── ...
│   └── package.json
└── pom.xml         # Parent POM
```

### Moduli

- **model**: Sadrži domenski model (Disease, Symptom, Treatment, itd.)
- **kjar**: Sadrži Drools pravila organizovana po kategorijama
- **service**: Spring Boot aplikacija sa REST API-jem i business logikom
- **frontend**: React aplikacija sa kompletnim korisničkim interfejsom

## 🖥️ Frontend aplikacija

React aplikacija pruža kompletni korisnički interfejs za testiranje i demonstraciju svih funkcionalnosti sistema:

### 📱 Dostupne stranice

- **🏠 Dashboard** - Pregled statusa sistema i brza statistika
- **🔄 Forward Chaining** - Testiranje dijagnostike sa 3+ nivoa ulančavanja
- **🔍 Backward Chaining** - Rekurzivni upiti kroz stablo činjenica
- **⚡ CEP** - Complex Event Processing sa temporalnim operatorima
- **🧪 Testni podaci** - 5 kompletnih test scenarija

### 🎯 Funkcionalnosti

- **Interaktivni testovi** - Pokretanje svih backend testova kroz UI
- **Real-time rezultati** - Trenutni prikaz rezultata sa detaljnim objašnjenjima
- **Prilagođeni upiti** - Kreiranje custom Backward Chaining upita
- **Strukturirani scenariji** - Kompletni test podaci za sve bolesti
- **cURL komande** - Generisanje komandi za direktno API testiranje
- **Responzivni dizajn** - Prilagođava se svim veličinama ekrana

## 🎯 Implementirani kompleksni mehanizmi

### 🔄 Forward Chaining - Operativne odluke (3+ nivoa ulančavanja)

| Pravilo | Opis | Ulančavanje |
|---------|------|-------------|
| **R01** | Kritični uslovi za plamenjaču (RH>85%, T∈[22,28]°C) | Nivo 1 |
| **R02** | Plamenjača + vodenaste lezije → +25% | Nivo 2 |
| **R11** | Visoka vlažnost → dodatni rizik | Nivo 3 |
| **R03** | Preporuka tretmana (≥70%) | Nivo 4 |
| **R04** | Pepelnica sa belim naslagama | Jednostavno |
| **R06** | Siva trulež + visoka vlažnost | Složeno |
| **R07** | Fuzarijum (uvenuće + posmeđenje) | Složeno |
| **R09** | Virus mozaika (mozaik bez gljivica) | Složeno |
| **R14** | Blokiranje tretmana (karenca) | Ograničenja |
| **R15** | Bayes analiza (više bolesti) | Napredna logika |

### 🔍 Backward Chaining - Stablo činjenica sa rekurzivnim upitima

| Komponenta | Opis | Implementacija |
|------------|------|----------------|
| **Stablo činjenica** | Hijerarhijska struktura znanja | ✅ Fact klasa sa tipovima |
| **Rekurzivni upiti** | Upiti koji koriste postojeće činjenice | ✅ Query → Fact → Query |
| **C1** | Da li je bolest X verovatna? | ✅ Rekurzivno kroz DISEASE_PROBABLE |
| **C2** | Da li je tretman Y dozvoljen? | ✅ Rekurzivno kroz TREATMENT_ALLOWED |
| **C3** | Analiza uzroka kroz stablo | ✅ Kombinuje RISK_CAUSE + DISEASE_PROBABLE |

### ⚡ Complex Event Processing (CEP) - Pravi temporalni operatori

| Obrazac | Opis | Temporalni operator |
|---------|------|---------------------|
| **E1** | Kritični uslovi za plamenjaču | ✅ `over window:time(6h)` - SLIDING WINDOW |
| **E2** | Rizik kondenzacije | ✅ `over window:time(24h)` - TUMBLING WINDOW |
| **E3** | Rizik Botrytis sekvencijalno | ✅ `after[0s,2h]` - TEMPORALNI SEKVENCIJALNI |
| **E4** | Alarm ventilacije | ✅ `not ... after[0s,30m]` - TEMPORALNI NOT |
| **E5** | Stabilni uslovi za pepelnicu | ✅ `over window:time(4h)` - TEMPORALNI DURING |
| **E6** | Rastući trend vlažnosti | ✅ `after[30m,2h]` - TEMPORALNI BEFORE |

### Podržane bolesti

- **Plamenjača** (Phytophthora infestans)
- **Pepelnica** (Erysiphe cichoracearum)
- **Siva trulež** (Botrytis cinerea)
- **Fuzarijum** (Fusarium oxysporum)
- **Virus mozaika** (Tobacco mosaic virus)

### Tipovi tretmana

- **Hemijski**: Bakarni preparati
- **Biološki**: Biološki fungicidi, Trichoderma
- **Sanitarni**: Uklanjanje biljaka, dezinfekcija alata

## Primeri rada sistema

### Forward Chaining - Kompleksno ulančavanje

```
=== POKRETANJE DIJAGNOSTIKE ===
Uslovi: T=25.0°C, RH=87.0%
Kultura: Paradajz (Vegetativni rast)
Simptomi: Vodenaste lezije

R01: Detektovani kritični uslovi za plamenjaču - RH: 87.0%, T: 25.0°C
     Povećana verovatnoća plamenjače na: 30.0%
R02: Detektovane vodenaste lezije uz visok rizik plamenjače
     Povećana verovatnoća plamenjače na: 55.0%
R11: Visoka vlažnost povećava rizik plamenjače
     Povećana verovatnoća plamenjače na: 65.0%
R03: Preporučen bakarni preparat za plamenjaču
     Verovatnoća: 75.0%
PRIORITET 3 (HEMIJSKI): Bakarni preparat
DIJAGNOZA: Plamenjača sa verovatnoćom 75.0%

=== REZULTAT ===
Aktivirano pravila: 12
Dijagnostikovane bolesti: 1 (Plamenjača: 75.0%)
Preporučeni tretmani: 1 (Bakarni preparat)
```

### Backward Chaining - Rekurzivni upit kroz stablo činjenica

```
=== BACKWARD CHAINING - STABLO ČINJENICA ===
Kreiranje činjenica:
BC-FACT: Kreiran fakt - Bolest Plamenjača je verovatna (75.0%)
BC-FACT: Kreiran složeni fakt - Bolest Plamenjača je OPASNA - visok rizik
BC-FACT: Kreiran fakt uzroka - Identifikovan uzrok rizika za Plamenjača

Rekurzivni upit:
BC-QUERY: Rekurzivni odgovor na osnovu fakta
          Fakt: Bolest Plamenjača je verovatna (75.0%)

=== STABLO ČINJENICA ===
1. DISEASE_PROBABLE: Bolest Plamenjača je verovatna (75.0%)
   - Verovatnoća: 75.0%
   - Prag: >= 50%
2. RISK_CAUSE: Identifikovan uzrok rizika za Plamenjača
   - Kritični uslovi: RH=87.0%, T=25.0°C
   - Optimalni uslovi za Phytophthora infestans
```

### CEP - Pravi temporalni operatori

```
=== CEP ANALIZA SA TEMPORALNIM OPERATORIMA ===
Senzorska očitavanja: 12
Događaji navodnjavanja: 1
Događaji ventilacije: 0

CEP-E1: SLIDING WINDOW ALARM - Kritični uslovi za plamenjaču!
        RH > 85% (5 očitavanja u 6h)
        T: 22-28°C (4 očitavanja u 6h)
        Temporalni operator: over window:time(6h)

CEP-E3: TEMPORALNI SEKVENCIJALNI ALARM - Botrytis!
        Sekvenca: Navodnjavanje → RH: 89.0% → CO2: 1300ppm
        Temporalni operatori: after[0s,2h] i after[0s,3h]

CEP-E4: TEMPORALNI NOT ALARM - Nedostajući događaj!
        RH: 92.0% > 90%
        Temporalni NOT: Nema ventilacije u poslednjih 30min

=== REZULTAT CEP ANALIZE ===
Aktivirano pravila: 6
Generisano alertova: 4
Korišćeni temporalni operatori: 8
```

## Tehnologije

### Backend
- **Java 11** - Programski jezik
- **Spring Boot 2.7.9** - Application framework
- **Drools 7.49.0.Final** - Rule engine
- **Maven** - Build tool i dependency management

### Frontend
- **React 18.2.0** - UI framework
- **React Router 6.3.0** - Client-side routing
- **Axios 0.27.2** - HTTP klijent
- **Responsive CSS** - Prilagodljiv dizajn

## 📁 Struktura pravila

```
kjar/src/main/resources/rules/
├── forward/
│   ├── disease-detection.drl         # Forward chaining - dijagnostika
│   └── treatment-recommendation.drl  # Forward chaining - tretmani
├── backward/
│   └── backward.drl                  # Backward chaining - upiti
└── cep/
    └── cep.drl                       # CEP - event processing
```

### Konfiguracija (kmodule.xml)

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

## Troubleshooting

### Java nije instalirana
```bash
# Proverite instalaciju
java -version

# Ako nije instalirana, sledite instrukcije za instalaciju iznad
```

### Maven build greške
```bash
# Očistite cache i rebuild
./mvnw clean
./mvnw install
```

### Port 8080 je zauzet
```bash
# Promenite port u application.properties ili zaustavite proces na portu 8080
lsof -ti:8080 | xargs kill -9

# Alternativno, pokrenite na drugom portu
./mvnw spring-boot:run -pl service -Dspring-boot.run.arguments=--server.port=8081
```

### Standalone testiranje (bez Spring Boot-a)
```bash
# Direktno testiranje Drools pravila
./mvnw exec:java -Dexec.mainClass="com.ftn.sbnz.service.StandaloneDemo" -Dexec.classpathScope=test -pl service
```

## 🎓 Finalna odbrana

### 📋 Pripremljeno za odbranu

- [x] **Klijentska aplikacija (UI)** - Kompletna React aplikacija
- [x] **Testni podaci** - 5 strukturiranih test scenarija
- [x] **Ažuriran predlog projekta** - Finalni dokument sa svim detaljima

### 🚀 Demonstracija

Za demonstraciju na odbrani:

1. **Pokrenite backend**: `./mvnw spring-boot:run -pl service`
2. **Pokrenite frontend**: `cd frontend && npm start`
3. **Otvorite browser**: `http://localhost:3000`
4. **Navigirajte kroz sekcije**:
   - Dashboard → pregled sistema
   - Forward Chaining → kompleksno ulančavanje
   - Backward Chaining → rekurzivni upiti
   - CEP → temporalni operatori
   - Testni podaci → strukturirani scenariji

### 📊 Ključni pokazatelji

| Metrika | Vrednost |
|---------|----------|
| **Forward Chaining pravila** | 15 |
| **Nivoi ulančavanja** | 4+ |
| **Backward Chaining upita** | 8 |
| **CEP obrazaca** | 6 |
| **Temporalnih operatora** | 8 |
| **Test scenarija** | 5 |
| **Podržanih bolesti** | 5 |
| **UI stranica** | 5 |

### 🎯 Kompleksnost implementacije

- ✅ **Forward Chaining**: 3+ nivoa ulančavanja (implementirano 4 nivoa)
- ✅ **Backward Chaining**: Rekurzivni upiti kroz stablo činjenica
- ✅ **CEP**: Pravi temporalni operatori (SLIDING, TUMBLING, AFTER, NOT)
- ✅ **Kompletna UI**: Interaktivni interfejs za sve mehanizme
- ✅ **Testni podaci**: Strukturirani scenariji za demonstraciju

---

**Sistem je spreman za finalnu odbranu sa svim zahtevnim komponentama implementiranim i testiranim.**