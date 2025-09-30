# Greenhouse Expert System - Frontend

React aplikacija za Greenhouse Expert System - klijentska aplikacija za pametni sistem preporuke tretmana biljnih bolesti u plastenicima.

## 🚀 Pokretanje aplikacije

### Preduslovi
- **Node.js 16+** ili noviji
- **npm** ili **yarn**

### Instalacija i pokretanje

```bash
# Pozicioniraj se u frontend direktorijum
cd frontend

# Instaliraj dependencies
npm install

# Pokreni development server
npm start
```

Aplikacija će biti dostupna na `http://localhost:3000`

### Build za produkciju

```bash
# Kreiraj production build
npm run build

# Build fajlovi će biti u build/ direktorijumu
```

## 📱 Funkcionalnosti

### 🏠 Dashboard
- Pregled statusa sistema (Backend, Forward Chaining, Backward Chaining, CEP)
- Brza statistika testova
- Pregled implementiranih mehanizama
- Lista podržanih bolesti

### 🔄 Forward Chaining
- **Osnovni testovi dijagnoze**: Plamenjača, Pepelnica, Siva trulež, Fuzarijum, Virus mozaika
- **Napredni testovi**: Kompleksno ulančavanje, Više bolesti istovremeno, Ograničenja tretmana
- **Sveobuhvatni testovi**: Svi Forward Chaining testovi, Demo sistem
- Prikaz rezultata sa detaljnim objašnjenjima

### 🔍 Backward Chaining
- **C1 upiti**: Da li je bolest verovatna?
- **C2 upiti**: Da li je tretman dozvoljen u fenofazi?
- **C3 upiti**: Koji uslovi su doveli do rizika?
- **Prilagođeni upiti**: Mogućnost kreiranja custom upita
- Prikaz stabla činjenica i rekurzivnih odgovora

### ⚡ CEP (Complex Event Processing)
- **E1**: Kritični uslovi za plamenjaču (Sliding Window 6h)
- **E2**: Rizik kondenzacije (Tumbling Window 24h)
- **E3**: Rizik Botrytis nakon navodnjavanja (Sekvencijalni)
- **E4**: Alarm ventilacije (Nedostajući događaj)
- **E5**: Stabilni uslovi za pepelnicu (During)
- **E6**: Rastući trend vlažnosti (Before)
- Prikaz temporalnih operatora i CEP analiza

### 🧪 Testni podaci
- **5 kompletnih test scenarija** za sve bolesti
- Detaljni prikaz uslova sredine, simptoma, dijagnoza
- Preporučeni tretmani sa dozama i karencama
- CEP alertovi i Backward Chaining upiti
- cURL komande za direktno testiranje API-ja

## 🏗️ Arhitektura

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # React komponente
│   │   ├── Header.js          # Header komponenta
│   │   ├── Navigation.js      # Navigacija
│   │   ├── Dashboard.js       # Dashboard stranica
│   │   ├── DiagnosisPage.js   # Forward Chaining
│   │   ├── BackwardChainingPage.js  # Backward Chaining
│   │   ├── CEPPage.js         # CEP analiza
│   │   └── TestDataPage.js    # Testni podaci
│   ├── services/
│   │   └── api.js             # API servisi
│   ├── App.js                 # Glavna aplikacija
│   ├── index.js               # Entry point
│   └── index.css              # Stilovi
└── package.json               # Dependencies
```

## 🔌 API Integracija

Aplikacija komunicira sa Spring Boot backend-om preko REST API-ja:

- **Forward Chaining**: `/api/diagnosis/*`
- **Backward Chaining**: `/api/backward-chaining/*`
- **CEP**: `/api/cep/*`
- **Demo**: `/api/demo`

### Proxy konfiguracija
Frontend koristi proxy za development server koji preusmjerava API pozive na `http://localhost:8080`

## 🎨 UI/UX Karakteristike

- **Responzivni dizajn** - prilagođava se svim veličinama ekrana
- **Intuitivna navigacija** - jasno organizovane sekcije
- **Real-time rezultati** - trenutni prikaz rezultata testova
- **Vizuelni indikatori** - status badge-ovi za različite stanja
- **Kopiraj/Paste funkcionalnost** - za cURL komande
- **Istorija rezultata** - čuva poslednje rezultate testova

## 🌐 Lokalizacija

Aplikacija je lokalizovana na srpski jezik:
- Svi tekstovi su na srpskom
- Datumi u srpskom formatu
- Lokalizovane greške i poruke

## 🔧 Konfiguracija

### Environment varijable
```bash
# .env fajl (opciono)
REACT_APP_API_URL=http://localhost:8080/api
```

### Proxy konfiguracija (package.json)
```json
{
  "proxy": "http://localhost:8080"
}
```

## 🧪 Testiranje

```bash
# Pokreni testove
npm test

# Pokreni testove sa coverage
npm test -- --coverage
```

## 📦 Dependencies

### Glavne biblioteke
- **React 18.2.0** - UI framework
- **React Router 6.3.0** - Routing
- **Axios 0.27.2** - HTTP klijent
- **Recharts 2.5.0** - Grafikoni (za buduće proširenje)
- **Lucide React 0.263.1** - Ikone

### Development dependencies
- **React Scripts 5.0.1** - Build tools
- **Testing Library** - Testiranje komponenti

## 🚀 Deployment

### Development
```bash
npm start  # http://localhost:3000
```

### Production
```bash
npm run build
# Serviranje build/ direktorijuma preko web servera
```

### Docker (opciono)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 Troubleshooting

### Backend nije dostupan
- Proverite da li je Spring Boot aplikacija pokrenuta na portu 8080
- Proverite proxy konfiguraciju u package.json

### CORS greške
- Backend ima konfigurisan CORS za localhost:3000
- Proverite da li frontend radi na ispravnom portu

### Slow loading
- Proverite network tab u browser dev tools
- API pozivi mogu biti sporiji pri prvom pokretanju backend-a

## 📈 Buduća proširenja

- **Grafički prikazi** - Recharts integracija za vizualizaciju podataka
- **Real-time notifikacije** - WebSocket integracija
- **Offline mode** - Service Worker za rad bez interneta
- **Mobile app** - React Native verzija
- **Multilingual** - Podrška za više jezika