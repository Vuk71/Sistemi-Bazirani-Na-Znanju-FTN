# 🚀 Instrukcije za pokretanje - Finalna odbrana

## Preduslovi

- **Java 11+** instaliran
- **Node.js 16+** instaliran
- **npm** instaliran

## Korak po korak

### 1. Pokretanje backend-a

```bash
# Pozicioniraj se u glavni direktorijum
cd sbnz_projekat

# Build projekta
./mvnw clean install

# Pokretanje Spring Boot aplikacije
./mvnw spring-boot:run -pl service
```

**Backend će biti dostupan na: http://localhost:8080**

### 2. Pokretanje frontend-a (novi terminal)

```bash
# Pozicioniraj se u frontend direktorijum
cd sbnz_projekat/frontend

# Instaliraj dependencies
npm install

# Pokretanje React aplikacije
npm start
```

**Frontend će biti dostupan na: http://localhost:3000**

### 3. Testiranje sistema

#### Opcija A: Kroz UI (preporučeno za demonstraciju)
1. Otvori http://localhost:3000 u browser-u
2. Navigiraj kroz sekcije:
   - **Dashboard** → pregled sistema
   - **Forward Chaining** → pokreni "Kompleksno ulančavanje"
   - **Backward Chaining** → pokreni prilagođeni upit
   - **CEP** → pokreni "Kritični uslovi"
   - **Testni podaci** → prikaži scenario S1

#### Opcija B: Direktno API testiranje
```bash
# Forward Chaining - kompleksno ulančavanje
curl http://localhost:8080/api/diagnosis/test-complex-chaining

# Backward Chaining - svi testovi
curl http://localhost:8080/api/backward-chaining/test-all-backward

# CEP - svi testovi
curl http://localhost:8080/api/cep/test-all-cep

# Svi testovi odjednom
curl http://localhost:8080/api/diagnosis/test-all
```

## 🎯 Za demonstraciju na odbrani

### Redosled demonstracije:

1. **Dashboard** (http://localhost:3000)
   - Prikaži status sistema
   - Objasni implementirane mehanizme

2. **Forward Chaining** 
   - Pokreni "Kompleksno ulančavanje"
   - Objasni 4 nivoa ulančavanja
   - Prikaži detaljni trace

3. **Backward Chaining**
   - Pokreni prilagođeni upit za "Plamenjača"
   - Objasni rekurzivne upite
   - Prikaži stablo činjenica

4. **CEP**
   - Pokreni "Kritični uslovi (Sliding Window 6h)"
   - Objasni temporalne operatore
   - Prikaži CEP analizu

5. **Testni podaci**
   - Prikaži scenario S1: Plamenjača
   - Objasni kompletne test podatke
   - Prikaži cURL komande

## 🔧 Troubleshooting

### Backend se ne pokreće
```bash
# Proverite Java verziju
java -version

# Očistite Maven cache
./mvnw clean

# Pokušajte ponovo
./mvnw spring-boot:run -pl service
```

### Frontend se ne pokreće
```bash
# Proverite Node.js verziju
node --version

# Očistite node_modules
rm -rf node_modules package-lock.json
npm install

# Pokušajte ponovo
npm start
```

### Port 8080 je zauzet
```bash
# Pronađite proces na portu 8080
lsof -ti:8080

# Zaustavite proces
kill -9 $(lsof -ti:8080)

# Ili pokrenite na drugom portu
./mvnw spring-boot:run -pl service -Dspring-boot.run.arguments=--server.port=8081
```

### Port 3000 je zauzet
```bash
# React će automatski predložiti port 3001
# Ili eksplicitno postavite port
PORT=3001 npm start
```

## ✅ Checklist pre demonstracije

- [ ] Backend pokrenut na portu 8080
- [ ] Frontend pokrenut na portu 3000
- [ ] Browser otvoren na http://localhost:3000
- [ ] Dashboard prikazuje "Online" status za sve komponente
- [ ] Testiran jedan test iz svake sekcije
- [ ] Pripremljen scenario za demonstraciju

## 📊 Očekivani rezultati

### Forward Chaining (Kompleksno ulančavanje)
```
=== POKRETANJE DIJAGNOSTIKE ===
R01: Detektovani kritični uslovi za plamenjaču
R02: Detektovane vodenaste lezije uz visok rizik plamenjače
R11: Visoka vlažnost povećava rizik plamenjače
R03: Preporučen bakarni preparat za plamenjaču
DIJAGNOZA: Plamenjača sa verovatnoćom 75.0%
```

### Backward Chaining (Rekurzivni upit)
```
=== BACKWARD CHAINING - STABLO ČINJENICA ===
BC-QUERY: Rekurzivni odgovor na osnovu fakta
Fakt: Bolest Plamenjača je verovatna (75.0%)
```

### CEP (Temporalni operatori)
```
=== CEP ANALIZA SA TEMPORALNIM OPERATORIMA ===
CEP-E1: SLIDING WINDOW ALARM - Kritični uslovi za plamenjaču!
Temporalni operator: over window:time(6h)
```

---

**Sistem je spreman za demonstraciju! 🎉**