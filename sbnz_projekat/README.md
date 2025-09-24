# Pametni sistem za preporuku tretmana biljnih bolesti u plastenicima

Napredni ekspertski sistem koji implementira **tri kompleksna mehanizma** za dijagnostiku biljnih bolesti i preporuku tretmana:

- 🔄 **Forward Chaining** - Operativne odluke i preporuke tretmana
- 🔍 **Backward Chaining** - Dijagnostički upiti i objašnjavanje
- ⚡ **Complex Event Processing (CEP)** - Rana detekcija rizika u realnom vremenu

## Preduslovi

- **Java 11** ili noviji
- **Maven 3.6+** (ili koristi uključeni Maven wrapper)

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

### 1. Build projekta

```bash
# Pozicioniraj se u root direktorijum
cd sbnz_projekat

# Build svih modula
./mvnw clean install
```

### 2. Pokretanje aplikacije

```bash
# Pokretanje Spring Boot aplikacije
./mvnw spring-boot:run -pl service
```

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
└── pom.xml         # Parent POM
```

### Moduli

- **model**: Sadrži domenski model (Disease, Symptom, Treatment, itd.)
- **kjar**: Sadrži Drools pravila organizovana po kategorijama
- **service**: Spring Boot aplikacija sa REST API-jem i business logikom

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

### 🔍 Backward Chaining - Dijagnostički upiti

| Upit | Opis | Objašnjavanje |
|------|------|---------------|
| **C1** | Da li je bolest X verovatna? | ✅ Prag ≥50% |
| **C2** | Da li je tretman Y dozvoljen u fenofazi Z? | ✅ Kontraindikacije |
| **C3** | Koji uslovi su doveli do rizika bolesti X? | ✅ Uzročno-posledične veze |

### ⚡ Complex Event Processing (CEP) - Rana detekcija

| Obrazac | Opis | Tip |
|---------|------|-----|
| **E1** | Kritični uslovi za plamenjaču (6h) | Sliding Window |
| **E2** | Rizik kondenzacije (24h) | Tumbling Window |
| **E3** | Rizik Botrytis nakon navodnjavanja | Sekvencijalni |
| **E4** | Alarm ventilacije | Nedostajući događaj |
| **E5** | Optimalni uslovi za pepelnicu | Kombinovani uslovi |
| **E6** | Rastući trend vlažnosti | Trend analiza |

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

## 🚀 Primeri rada sistema

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

### Backward Chaining - Dijagnostički upit

```
=== BACKWARD CHAINING UPIT ===
Tip upita: Da li je bolest verovatna?
Bolest: Plamenjača

=== REZULTAT BC UPITA ===
Aktivirano pravila: 1
Odgovor: DA - Bolest Plamenjača je verovatna sa 75.0%
Objašnjenje:
  - Verovatnoća bolesti: 75.0%
  - Prag za pozitivnu dijagnozu: 50%
  - VISOKA verovatnoća - preporučuje se tretman
```

### CEP - Rana detekcija rizika

```
=== CEP ANALIZA ===
Senzorska očitavanja: 12
Događaji navodnjavanja: 1
Događaji ventilacije: 0

CEP-E1: ALARM - Kritični uslovi za plamenjaču!
        Prosečna RH > 85% uz temperaturu 22-28°C u poslednjih 6h
        Preporuka: Povećati ventilaciju, smanjiti vlažnost

CEP-E4: HITNI ALARM - Ventilacija nije aktivirana!
        RH > 90% bez ventilacije u poslednjih 30 minuta
        Preporuka: HITNO: Aktivirati ventilaciju

=== REZULTAT CEP ANALIZE ===
Aktivirano pravila: 3
Generisano alertova: 2
```

## Tehnologije

- **Java 11** - Programski jezik
- **Spring Boot 2.7.9** - Application framework
- **Drools 7.49.0.Final** - Rule engine
- **Maven** - Build tool i dependency management

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
<kbase name="bwBase" packages="backward">
    <ksession name="bwKsession"/>
</kbase>
<kbase name="cepKbase" eventProcessingMode="stream" packages="cep">
    <ksession name="cepKsession" clockType="pseudo"/>
</kbase>
```

## 🔧 Adekvatna struktura pravila

Sva pravila imaju logiku izdvojenu iz THEN dela:

```drools
// ❌ LOŠE - logika u THEN delu
rule "Loš primer"
    when
        $disease: Disease(name == "Plamenjača")
    then
        $disease.probability = $disease.probability + 25.0;
        if ($disease.probability > 100.0) $disease.probability = 100.0;
end

// ✅ DOBRO - logika u objektu
rule "R02 - Plamenjača sa vodenastim lezijama"
    when
        $disease: Disease(name == "Plamenjača", probability >= 30.0, probability < 55.0)
        $symptom: Symptom(type == SymptomType.WATERY_LESIONS, present == true)
    then
        $disease.increaseProbability(25.0);  // Metoda objekta
        System.out.println("R02: Detektovane vodenaste lezije...");
        update($disease);
end
```

## 🚀 Buduća proširenja

- **Web UI** - Grafički interfejs za lakše korišćenje
- **Baza podataka** - Perzistentno čuvanje dijagnoza i tretmana
- **Machine Learning** - Poboljšanje preciznosti dijagnoze
- **IoT integracija** - Direktno povezivanje sa senzorima
- **Mobile app** - Mobilna aplikacija za poljoprivrednike

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

## 📊 Rezultati testiranja

Sistem uspešno demonstrira:

- ✅ **Forward Chaining** - 3+ nivoa ulančavanja pravila
- ✅ **Backward Chaining** - Dijagnostički upiti sa objašnjenjem  
- ✅ **Complex Event Processing** - 6 različitih CEP obrazaca
- ✅ **Adekvatna struktura pravila** - Logika izdvojena iz THEN dela
- ✅ **HTTP aktivacija** - REST API endpoints za sve mehanizme
- ✅ **Kompleksni scenariji** - Bayes analiza, ograničenja tretmana, prioritizacija

**Status:** ✅ **Svi zahtevani mehanizmi uspešno implementirani i testirani**
