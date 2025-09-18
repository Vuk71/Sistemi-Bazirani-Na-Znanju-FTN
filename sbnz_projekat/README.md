# Pametni sistem za preporuku tretmana biljnih bolesti u plastenicima

Ekspertski sistem baziran na pravilima koji koristi Drools rule engine za dijagnostiku biljnih bolesti i preporuku tretmana u plastenicima.

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

Aplikacija automatski pokreće testove prilikom startovanja. Možete videti rezultate u konzoli.

Alternativno, možete testirati preko REST API-ja:

```bash
# Test dijagnoze plamenjače
curl http://localhost:8080/api/diagnosis/test-plamenjaca

# Test dijagnoze pepelnice
curl http://localhost:8080/api/diagnosis/test-pepelnica

# Test dijagnoze sive truleži
curl http://localhost:8080/api/diagnosis/test-siva-trulez

# Test dijagnoze fuzarijuma
curl http://localhost:8080/api/diagnosis/test-fuzarijum

# Test dijagnoze virusa
curl http://localhost:8080/api/diagnosis/test-virus

# Test svih scenarija odjednom
curl http://localhost:8080/api/diagnosis/test-all
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

## Implementirana funkcionalnost

### Dijagnostička pravila

| Pravilo | Opis | Kompleksnost |
|---------|------|--------------|
| **R01** | Visok rizik plamenjače (RH>85%, T∈[22,28]°C) | Jednostavno |
| **R02** | Plamenjača + vodenaste lezije | Srednje |
| **R04** | Pepelnica sa belim naslagama | Jednostavno |
| **R06** | Siva trulež sa sivom prevlakom | Srednje |
| **R07** | Fuzarijum (uvenuće + posmeđenje žila) | Složeno |
| **R09** | Virus mozaika (mozaik bez gljivica) | Složeno |

### Pravila za tretmane

| Pravilo | Opis |
|---------|------|
| **R03** | Bakarni preparat za plamenjaču (≥70%) |
| **R05** | Biološki fungicidi u plodonošenju |
| **R08** | Trichoderma za fuzarijum |
| **R10** | Sanitarne mere za virus |

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

## Primer rada sistema

```
=== POKRETANJE DIJAGNOSTIKE ===
Uslovi: T=25.0°C, RH=87.0%
Kultura: Paradajz (Vegetativni rast)
Simptomi:
  - Vodenaste lezije

R01: Detektovani kritični uslovi za plamenjaču - RH: 87.0%, T: 25.0°C
     Povećana verovatnoća plamenjače na: 30.0%
R02: Detektovane vodenaste lezije uz visok rizik plamenjače
     Povećana verovatnoća plamenjače na: 55.0%
DIJAGNOZA: Plamenjača sa verovatnoćom 55.0%
PREPORUČEN TRETMAN: Bakarni preparat (CHEMICAL)

=== REZULTAT DIJAGNOSTIKE ===
Aktivirano pravila: 4

Rezultat dijagnoze:
  Dijagnostikovane bolesti:
    - Plamenjača (55.0%)
  Preporučeni tretmani:
    - Bakarni preparat (CHEMICAL)
```

## Tehnologije

- **Java 11** - Programski jezik
- **Spring Boot 2.7.9** - Application framework
- **Drools 7.49.0.Final** - Rule engine
- **Maven** - Build tool i dependency management

## Struktura pravila

```
kjar/src/main/resources/rules/
├── forward/
│   ├── disease-detection.drl    # Pravila za dijagnostiku bolesti
│   └── treatment-recommendation.drl  # Pravila za preporuku tretmana
├── backward/                    # (Planirano za buduće proširenje)
└── cep/                        # (Planirano za buduće proširenje)
```

## Buduća proširenja

- **CEP (Complex Event Processing)** - Praćenje vremenskih sekvenci
- **Backward chaining** - Dijagnostički upiti
- **Dodatna pravila** - Proširenje baze znanja
- **Web UI** - Grafički interfejs
- **Baza podataka** - Perzistentno čuvanje podataka

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
```
