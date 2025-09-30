import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Forward Chaining API
export const diagnosisAPI = {
  // Osnovni testovi dijagnoze
  testPlamenjaca: () => api.get('/diagnosis/test-plamenjaca'),
  testPepelnica: () => api.get('/diagnosis/test-pepelnica'),
  testSivaTrulez: () => api.get('/diagnosis/test-siva-trulez'),
  testFuzarijum: () => api.get('/diagnosis/test-fuzarijum'),
  testVirus: () => api.get('/diagnosis/test-virus'),
  
  // Napredni testovi
  testComplexChaining: () => api.get('/diagnosis/test-complex-chaining'),
  testMultipleDiseases: () => api.get('/diagnosis/test-multiple-diseases'),
  testTreatmentRestrictions: () => api.get('/diagnosis/test-treatment-restrictions'),
  
  // Svi testovi
  testAll: () => api.get('/diagnosis/test-all'),
  
  // Demo
  demo: () => api.get('/demo'),
};

// Backward Chaining API
export const backwardChainingAPI = {
  // C1: Da li je bolest verovatna?
  testHighProbabilityDisease: () => api.get('/backward-chaining/test-high-probability-disease'),
  testLowProbabilityDisease: () => api.get('/backward-chaining/test-low-probability-disease'),
  
  // C2: Da li je tretman dozvoljen u fenofazi?
  testTreatmentAllowedVegetative: () => api.get('/backward-chaining/test-treatment-allowed-vegetative'),
  testTreatmentBlockedFruiting: () => api.get('/backward-chaining/test-treatment-blocked-fruiting'),
  
  // C3: Koji uslovi su doveli do rizika?
  testWhatCausedPlamenjaca: () => api.get('/backward-chaining/test-what-caused-plamenjaca'),
  testWhatCausedPepelnica: () => api.get('/backward-chaining/test-what-caused-pepelnica'),
  
  // Svi testovi
  testAllBackward: () => api.get('/backward-chaining/test-all-backward'),
  
  // Prilagođeni upiti
  queryDisease: (diseaseName) => api.get(`/backward-chaining/query-disease/${encodeURIComponent(diseaseName)}`),
  queryTreatment: (treatmentName, phenophase) => api.get(`/backward-chaining/query-treatment/${encodeURIComponent(treatmentName)}/${phenophase}`),
  
  // Demo
  demo: () => api.get('/backward-chaining/demo'),
};

// CEP API
export const cepAPI = {
  // E1: Kritični uslovi za plamenjaču
  testCriticalConditions: () => api.get('/cep/test-critical-conditions'),
  
  // E2: Rizik kondenzacije
  testCondensationRisk: () => api.get('/cep/test-condensation-risk'),
  
  // E3: Rizik Botrytis nakon navodnjavanja
  testBotrytisRisk: () => api.get('/cep/test-botrytis-risk'),
  
  // E4: Alarm ventilacije
  testVentilationAlarm: () => api.get('/cep/test-ventilation-alarm'),
  
  // E5: Optimalni uslovi za pepelnicu
  testPowderyMildew: () => api.get('/cep/test-powdery-mildew'),
  
  // E6: Rastući trend vlažnosti
  testHumidityTrend: () => api.get('/cep/test-humidity-trend'),
  
  // Svi CEP testovi
  testAllCEP: () => api.get('/cep/test-all-cep'),
  
  // Demo
  demo: () => api.get('/cep/demo'),
};

export default api;