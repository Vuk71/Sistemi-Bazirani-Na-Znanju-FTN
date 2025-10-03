import React, { useState, useEffect } from 'react';
import { backwardChainingAPI } from '../services/api';
import { getActivePlant, hasActivePlant, getPlantDisplayName } from '../utils/plantUtils';

const BackwardChainingPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePlant, setActivePlant] = useState(null);
  const [queryData, setQueryData] = useState({
    type: 'disease',
    diseaseName: 'Plamenjača',
    treatmentName: 'Bakarni preparat'
  });

  // Učitaj aktivnu biljku pri pokretanju
  useEffect(() => {
    const plant = getActivePlant();
    setActivePlant(plant);

    // Postavi fenofazu iz aktivne biljke
    if (plant) {
      setQueryData(prev => ({
        ...prev,
        phenophase: plant.phenophase
      }));
    }
  }, []);



  const runQuery = async () => {
    if (!activePlant) {
      alert('⚠️ Molimo prvo definiši aktivnu biljku u sekciji "Vegetacija"');
      return;
    }

    setLoading(true);

    try {
      let response;

      console.log('🌱 Koristim aktivnu biljku:', {
        cropType: activePlant.cropType,
        variety: activePlant.variety,
        phenophase: activePlant.phenophase,
        temperature: activePlant.currentConditions?.temperature,
        humidity: activePlant.currentConditions?.humidity,
        symptoms: activePlant.symptoms
      });

      if (queryData.type === 'disease') {
        // Koristi aktivnu biljku za C1 upite!
        response = await backwardChainingAPI.queryDiseaseWithPlant(queryData.diseaseName, activePlant);
      } else if (queryData.type === 'cause') {
        // C3: Koji uslovi su doveli do rizika? - Koristi aktivnu biljku!
        console.log('🔍 C3 upit sa aktivnom biljkom');
        response = await backwardChainingAPI.queryWhatCausedWithPlant(queryData.diseaseName, activePlant);
      } else {
        // VAŽNO: Koristi fenofazu iz aktivne biljke!
        console.log('🔍 Proveravam tretman za fenofazu:', activePlant.phenophase);
        response = await backwardChainingAPI.queryTreatment(queryData.treatmentName, activePlant.phenophase);
      }

      const result = {
        success: true,
        data: response.data,
        timestamp: new Date().toLocaleString('sr-RS'),
        queryData: { ...queryData, plant: activePlant }
      };
      setResults([result]);
    } catch (error) {
      const result = {
        success: false,
        error: error.response?.data || error.message,
        timestamp: new Date().toLocaleString('sr-RS'),
        queryData: { ...queryData, plant: activePlant }
      };
      setResults([result]);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (field, value) => {
    setQueryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearResults = () => {
    setResults([]);
  };

  // Helper funkcija za izvlačenje verovatnoće iz rezultata
  const extractProbability = (result) => {
    // Prvo pokušaj iz result teksta
    const resultText = result.data?.result || '';
    let match = resultText.match(/(\d+\.?\d*)%/);
    if (match) return parseFloat(match[1]);

    // Ako nema u result, pokušaj iz explanation
    const explanations = result.data?.explanation || [];
    for (const exp of explanations) {
      match = exp.match(/Verovatnoća:\s*(\d+\.?\d*)%/);
      if (match) return parseFloat(match[1]);
    }

    // Ako ni tamo nema, pokušaj bilo koji procenat u explanation
    for (const exp of explanations) {
      match = exp.match(/(\d+\.?\d*)%/);
      if (match) return parseFloat(match[1]);
    }

    return null;
  };

  // Helper funkcija za izvlačenje podataka iz aktivne biljke
  const getPlantData = (result) => {
    return result.queryData?.plant || {};
  };

  const renderQueryResult = (result) => {
    if (!result.success) {
      return (
        <div className="alert alert-danger">
          <strong>Greška:</strong> {result.error}
        </div>
      );
    }

    const queryResult = result.data;
    const probability = extractProbability(result);
    const plantData = getPlantData(result);

    if (!queryResult) {
      return (
        <div className="alert alert-warning">
          <strong>Upozorenje:</strong> Nema podataka o rezultatu upita.
        </div>
      );
    }

    // Poseban slučaj za neodgovorene upite
    if (queryResult.answered === false) {
      return (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h4> Rezultat upita</h4>
          <br />
          <div style={{
            backgroundColor: '#fff3cd',
            padding: '15px',
            borderRadius: '8px',
            border: '2px solid #ffc107'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>
              {queryResult.queryType === 'IS_DISEASE_PROBABLE' && ' Da li je bolest verovatna?'}
              {queryResult.queryType === 'IS_TREATMENT_ALLOWED' && ' Da li je tretman dozvoljen?'}
              {queryResult.queryType === 'WHAT_CAUSED_RISK' && ' Koji uslovi su doveli do rizika?'}
            </div>
            <div style={{ fontSize: '16px', marginBottom: '10px' }}>
              <strong>Status:</strong>  Upit nije odgovoren
            </div>
            <div style={{ fontSize: '14px', color: '#856404', marginBottom: '10px' }}>
              Sistem trenutno nema dovoljno informacija da odgovori na ovaj upit.
            </div>
            {queryResult.diseaseName && (
              <div><strong>Bolest:</strong> {queryResult.diseaseName}</div>
            )}
            {queryResult.treatmentName && (
              <div><strong>Tretman:</strong> {queryResult.treatmentName}</div>
            )}
            {queryResult.phenophase && (
              <div><strong>Fenofaza:</strong> {queryResult.phenophase}</div>
            )}
          </div>

        </div>
      );
    }

    return (
      <div>
        {/* Osnovni rezultat upita */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h4> Rezultat upita</h4>
          <br />
          <div style={{
            backgroundColor: queryResult.result && queryResult.result.includes('DA') ? '#e8f5e8' : '#ffebee',
            padding: '15px',
            borderRadius: '8px',
            border: `2px solid ${queryResult.result && queryResult.result.includes('DA') ? '#4CAF50' : '#f44336'}`
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>
              {queryResult.queryType === 'IS_DISEASE_PROBABLE' && ' Da li je bolest verovatna?'}
              {queryResult.queryType === 'IS_TREATMENT_ALLOWED' && ' Da li je tretman dozvoljen?'}
              {queryResult.queryType === 'WHAT_CAUSED_RISK' && ' Koji uslovi su doveli do rizika?'}
            </div>
            <div style={{ fontSize: '16px', marginBottom: '10px' }}>
              <strong>Odgovor:</strong> {queryResult.result || 'Nema odgovora'}
            </div>
            {queryResult.diseaseName && (
              <div><strong>Bolest:</strong> {queryResult.diseaseName}</div>
            )}
            {queryResult.treatmentName && (
              <div><strong>Tretman:</strong> {queryResult.treatmentName}</div>
            )}
            {queryResult.phenophase && (
              <div><strong>Fenofaza (iz aktivne biljke):</strong> {queryResult.phenophase}</div>
            )}
          </div>
        </div>

        {/* Detaljno objašnjenje Backward Chaining trace-a */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h4> Backward Chaining - Trace rekurzivnog zaključivanja</h4>
          <br />

          {/* Simulacija pravog BC trace-a */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #dee2e6',
            fontFamily: 'monospace',
            fontSize: '13px'
          }}>
            <div style={{ color: '#28a745', fontWeight: 'bold', marginBottom: '10px' }}>
              === BACKWARD CHAINING TRACE ===
            </div>

            {queryResult.queryType === 'IS_DISEASE_PROBABLE' && (
              <div>
                <div style={{ color: '#007bff', marginBottom: '5px', fontWeight: 'bold' }}>
                  GOAL: IS_DISEASE_PROBABLE({queryResult.diseaseName})
                </div>
                <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                  ├─ PRAVILO: "BC-FACT: Bolest je verovatna"
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px', color: '#6c757d' }}>
                  │  WHEN: Disease(name == "{queryResult.diseaseName}", probability ≥ 50.0)
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ REKURZIVNI PODCILJ: Pronađi Disease({queryResult.diseaseName})
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Pretraga Working Memory...
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ Čitam: DISEASE_PROBABILITY({queryResult.diseaseName})
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Biljka: {plantData.cropType} - {plantData.variety}
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Uslovi: T={plantData.currentConditions?.temperature}°C, RH={plantData.currentConditions?.humidity}%
                </div>
                {queryResult.result && queryResult.result.includes('DA') ? (
                  <>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  ├─ Pronađen: Disease({queryResult.diseaseName}, probability={probability !== null ? probability.toFixed(1) : '?'}%)
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ Uslov zadovoljen: {probability !== null ? probability.toFixed(1) : '?'}% ≥ 50.0%
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px', color: '#28a745' }}>
                      │  └─ SVI USLOVI ZADOVOLJENI → Aktiviram THEN deo pravila
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ AKCIJA: insert(new Fact("DISEASE_PROBABLE", "{queryResult.diseaseName}"))
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ Kreiran novi fakt u Working Memory
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ PRAVILO: "BC-QUERY: Da li je bolest verovatna?"
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px', color: '#6c757d' }}>
                      │  WHEN: DiagnosticQuery + Fact(DISEASE_PROBABLE, "{queryResult.diseaseName}")
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ REKURZIVNI PODCILJ: Pronađi DiagnosticQuery
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ Pronađen query objekat
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ REKURZIVNI PODCILJ: Pronađi Fact(DISEASE_PROBABLE)
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ Pronađen fakt (kreiran u prethodnom pravilu)
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ AKCIJA: Postavljam result i explanation na query
                    </div>
                    <div style={{ color: '#28a745', marginLeft: '20px', fontWeight: 'bold' }}>
                      └─ FINALNI ZAKLJUČAK: DA - Bolest {queryResult.diseaseName} je verovatna ({probability !== null ? probability.toFixed(1) : '?'}%)
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  ├─ Pronađen: Disease({queryResult.diseaseName}, probability={probability !== null ? probability.toFixed(1) : '?'}%)
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ Uslov NIJE zadovoljen: {probability !== null ? probability.toFixed(1) : '?'}% &lt; 50.0%
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px', color: '#dc3545' }}>
                      │  └─ Pravilo se NE aktivira
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ PRAVILO: "BC-QUERY: Nema dovoljno činjenica" (FALLBACK)
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px', color: '#6c757d' }}>
                      │  WHEN: DiagnosticQuery + Disease(probability &lt; 50) + not Fact(DISEASE_PROBABLE)
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ REKURZIVNI PODCILJ: Pronađi DiagnosticQuery
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ Pronađen query objekat
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ REKURZIVNI PODCILJ: Pronađi Disease(probability &lt; 50%)
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ Pronađen: Disease({probability !== null ? probability.toFixed(1) : '?'}%)
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ REKURZIVNI PODCILJ: not Fact(DISEASE_PROBABLE)
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ Fakt ne postoji
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ AKCIJA: Postavljam negativan rezultat
                    </div>
                    <div style={{ color: '#dc3545', marginLeft: '20px', fontWeight: 'bold' }}>
                      └─ FINALNI ZAKLJUČAK: NE - Nedovoljno činjenica za potvrdu bolesti {queryResult.diseaseName}
                    </div>
                  </>
                )}
              </div>
            )}

            {queryResult.queryType === 'IS_TREATMENT_ALLOWED' && (
              <div>
                <div style={{ color: '#007bff', marginBottom: '5px', fontWeight: 'bold' }}>
                  GOAL: IS_TREATMENT_ALLOWED({queryResult.treatmentName}, {queryResult.phenophase})
                </div>

                {queryResult.result && queryResult.result.includes('NE') ? (
                  <>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ PRAVILO: "BC-QUERY: Tretman nije dozvoljen"
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px', color: '#6c757d' }}>
                      │  WHEN: DiagnosticQuery + Contraindication(treatmentName, phenophase)
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ REKURZIVNI PODCILJ: Pronađi DiagnosticQuery
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ Pronađen query objekat
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ REKURZIVNI PODCILJ: Pronađi Contraindication({queryResult.treatmentName}, {queryResult.phenophase})
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  ├─ Pretraga Working Memory...
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  ├─ Pronađen: Contraindication(treatmentName="{queryResult.treatmentName}", phenophase={queryResult.phenophase})
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ Uslov zadovoljen
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ AKCIJA: Postavljam negativan rezultat
                    </div>
                    <div style={{ color: '#dc3545', marginLeft: '20px', fontWeight: 'bold' }}>
                      └─ FINALNI ZAKLJUČAK: NE - Tretman {queryResult.treatmentName} je blokiran u {queryResult.phenophase}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ PRAVILO: "BC-FACT: Tretman je dozvoljen"
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px', color: '#6c757d' }}>
                      │  WHEN: Treatment + Crop + not Contraindication
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ REKURZIVNI PODCILJ: Pronađi Treatment({queryResult.treatmentName})
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  ├─ Pretraga Working Memory...
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ Pronađen: Treatment("{queryResult.treatmentName}")
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ REKURZIVNI PODCILJ: Pronađi Crop(phenophase={queryResult.phenophase})
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  ├─ Pretraga Working Memory...
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ Pronađen: Crop(phenophase={queryResult.phenophase})
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ REKURZIVNI PODCILJ: not Contraindication({queryResult.treatmentName}, {queryResult.phenophase})
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  ├─ Pretraga Working Memory...
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ Kontraindikacija ne postoji (tretman dozvoljen)
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px', color: '#28a745' }}>
                      │  └─ SVI USLOVI ZADOVOLJENI → Aktiviram THEN deo pravila
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ AKCIJA: insert(new Fact("TREATMENT_ALLOWED", "{queryResult.treatmentName}_{queryResult.phenophase}"))
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ Kreiran novi fakt u Working Memory
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ PRAVILO: "BC-QUERY: Da li je tretman dozvoljen?"
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px', color: '#6c757d' }}>
                      │  WHEN: DiagnosticQuery + Fact(TREATMENT_ALLOWED)
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ REKURZIVNI PODCILJ: Pronađi Fact(TREATMENT_ALLOWED)
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ Pronađen fakt (kreiran u prethodnom pravilu)
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ AKCIJA: Postavljam result i explanation na query
                    </div>
                    <div style={{ color: '#28a745', marginLeft: '20px', fontWeight: 'bold' }}>
                      └─ FINALNI ZAKLJUČAK: DA - Tretman {queryResult.treatmentName} je dozvoljen u {queryResult.phenophase}
                    </div>
                  </>
                )}
              </div>
            )}

            {queryResult.queryType === 'WHAT_CAUSED_RISK' && (
              <div>
                <div style={{ color: '#007bff', marginBottom: '5px' }}>
                  GOAL: WHAT_CAUSED_RISK({queryResult.diseaseName})
                </div>
                <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                  ├─ SUB-GOAL: CHECK_DISEASE_PROBABILITY
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ Biljka: {plantData.cropType} - {plantData.variety}
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ Verovatnoća: {probability !== null ? probability.toFixed(1) : '?'}%
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  └─ REZULTAT: {probability !== null && probability >= 50 ? 'PROBABILITY_CHECK = TRUE (≥ 50%)' : 'PROBABILITY_CHECK = FALSE (< 50%)'}
                </div>

                {queryResult.result && !queryResult.result.includes('nije dovoljno verovatna') ? (
                  <>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ SUB-GOAL: IDENTIFY_ENVIRONMENTAL_FACTORS
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ SUB-SUB-GOAL: CHECK_HUMIDITY_RISK
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  ├─ Čitam: CURRENT_HUMIDITY = {plantData.currentConditions?.humidity}%
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  ├─ Tražim: HUMIDITY_THRESHOLD({queryResult.diseaseName})
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ REZULTAT: {plantData.currentConditions?.humidity > 85 ? 'HIGH_HUMIDITY_RISK = TRUE' : 'HUMIDITY_RISK = FALSE'}
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ SUB-SUB-GOAL: CHECK_TEMPERATURE_RISK
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  ├─ Čitam: CURRENT_TEMPERATURE = {plantData.currentConditions?.temperature}°C
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  ├─ Tražim: OPTIMAL_TEMP_RANGE({queryResult.diseaseName})
                    </div>
                    <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                      │  │  └─ REZULTAT: TEMPERATURE_IN_RANGE = {plantData.currentConditions?.temperature >= 20 && plantData.currentConditions?.temperature <= 28 ? 'TRUE' : 'FALSE'}
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ REZULTAT: ENVIRONMENTAL_FACTORS = [T={plantData.currentConditions?.temperature}°C, RH={plantData.currentConditions?.humidity}%]
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ SUB-GOAL: IDENTIFY_BIOLOGICAL_FACTORS
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ Tražim: PATHOGEN_ACTIVITY({queryResult.diseaseName})
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ REZULTAT: BIOLOGICAL_FACTORS = [pathogen_conditions_met]
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ SUB-GOAL: COMBINE_ALL_FACTORS
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ ENVIRONMENTAL: T={plantData.currentConditions?.temperature}°C, RH={plantData.currentConditions?.humidity}%
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ BIOLOGICAL: Patogen aktivan
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ REZULTAT: ALL_FACTORS = kombinacija svih faktora
                    </div>
                    <div style={{ color: '#28a745', marginLeft: '20px' }}>
                      └─ FINALNI ZAKLJUČAK: Identifikovani uzroci rizika za {queryResult.diseaseName}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ SUB-GOAL: CHECK_IF_ANALYSIS_POSSIBLE
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ Uslov: Verovatnoća ≥ 50% za analizu uzroka
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ Trenutna verovatnoća: {probability !== null ? probability.toFixed(1) : '?'}%
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ REZULTAT: ANALYSIS_NOT_POSSIBLE = TRUE
                    </div>
                    <div style={{ color: '#dc3545', marginLeft: '20px' }}>
                      └─ FINALNI ZAKLJUČAK: NE - Bolest nije dovoljno verovatna za analizu uzroka
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stablo činjenica */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h4> Stablo činjenica (Fact Tree)</h4>
          <br />
          <div style={{
            backgroundColor: '#fff3e0',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #ff9800'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Hijerarhijska struktura znanja:
            </div>

            <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>
              <div style={{ marginBottom: '5px' }}>
                ROOT_FACTS (Aktivna biljka: {plantData.cropType} - {plantData.variety})
              </div>
              <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                ├─  PLANT_FACTS
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  ├─ CROP_TYPE({plantData.cropType})
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  ├─ VARIETY({plantData.variety})
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  └─ PHENOPHASE({plantData.phenophase})
              </div>
              {queryResult.diseaseName && (
                <>
                  <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                    ├─  DISEASE_FACTS
                  </div>
                  <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                    │  ├─ DISEASE_PROBABILITY({queryResult.diseaseName}, {probability !== null ? probability.toFixed(1) : '0.0'}%)
                  </div>
                  <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                    │  ├─ DISEASE_SYMPTOMS({queryResult.diseaseName}, [{
                      Object.entries(plantData.symptoms || {})
                        .filter(([_, value]) => value)
                        .map(([key]) => key)
                        .join(', ') || 'nema_simptoma'
                    }])
                  </div>
                  <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                    │  └─ DISEASE_STATUS({queryResult.diseaseName}, {probability !== null && probability >= 50 ? 'PROBABLE' : 'NOT_PROBABLE'})
                  </div>
                </>
              )}
              {queryResult.queryType === 'IS_TREATMENT_ALLOWED' && queryResult.treatmentName && (
                <>
                  <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                    ├─  TREATMENT_FACTS
                  </div>
                  <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                    │  ├─ TREATMENT_EXISTS({queryResult.treatmentName})
                  </div>
                  <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                    │  ├─ TREATMENT_PHENOPHASE({queryResult.treatmentName}, {plantData.phenophase})
                  </div>
                  <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                    │  └─ TREATMENT_STATUS({queryResult.treatmentName}, {queryResult.result?.includes('DA') ? 'ALLOWED' : 'BLOCKED'})
                  </div>
                </>
              )}
              <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                ├─  ENVIRONMENTAL_FACTS
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  ├─ CURRENT_HUMIDITY({plantData.currentConditions?.humidity}%)
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  ├─ CURRENT_TEMPERATURE({plantData.currentConditions?.temperature}°C)
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  ├─ CO2_LEVEL({plantData.currentConditions?.co2Level} ppm)
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  └─ VENTILATION({plantData.currentConditions?.ventilationActive ? 'ACTIVE' : 'INACTIVE'})
              </div>
              <div style={{ marginLeft: '20px' }}>
                └─  RISK_FACTS
              </div>
              {queryResult.diseaseName && (
                <>
                  <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                    ├─ RISK_FACTOR({queryResult.diseaseName}, {
                      plantData.currentConditions?.humidity > 85 ? 'high_humidity' :
                        plantData.currentConditions?.humidity >= 60 && plantData.currentConditions?.humidity <= 80 ? 'moderate_humidity' :
                          'low_humidity'
                    })
                  </div>
                  <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                    ├─ RISK_FACTOR({queryResult.diseaseName}, {
                      plantData.currentConditions?.temperature >= 20 && plantData.currentConditions?.temperature <= 28 ? 'optimal_temperature' : 'suboptimal_temperature'
                    })
                  </div>
                </>
              )}
              <div style={{ marginLeft: '40px' }}>
                └─ RISK_STATUS({queryResult.diseaseName || queryResult.treatmentName}, {
                  (() => {
                    if (queryResult.queryType === 'WHAT_CAUSED_RISK') {
                      return queryResult.result?.includes('Identifikovan') ? 'RISK_IDENTIFIED' : 'NO_RISK';
                    } else if (queryResult.queryType === 'IS_DISEASE_PROBABLE') {
                      return probability !== null && probability >= 50 ? 'HIGH_RISK' : 'LOW_RISK';
                    } else if (queryResult.queryType === 'IS_TREATMENT_ALLOWED') {
                      return queryResult.result?.includes('DA') ? 'SAFE_TO_TREAT' : 'TREATMENT_RESTRICTED';
                    }
                    return 'UNKNOWN';
                  })()
                })
              </div>
            </div>
          </div>
        </div>

        {/* Backend detalji - sirovi podaci iz Drools pravila */}
        {queryResult.explanation && queryResult.explanation.length > 0 && (
          <details style={{ marginBottom: '20px' }}>
            <summary style={{
              cursor: 'pointer',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
              fontWeight: 'bold',
              userSelect: 'none'
            }}>
              Detalji (klikni za prikaz)
            </summary>
            <div className="card" style={{ marginTop: '10px' }}>
              <div style={{
                backgroundColor: '#f0f8ff',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #2196F3',
                fontFamily: 'monospace',
                fontSize: '13px'
              }}>
                {queryResult.explanation.map((explanation, index) => (
                  <div key={index} style={{ marginBottom: '5px', lineHeight: '1.6' }}>
                    {explanation}
                  </div>
                ))}
              </div>
            </div>
          </details>
        )}

      </div>
    );
  };

  // Uklonjen tests array - koristimo samo interaktivnu formu

  return (
    <div>
      <div className="card">
        <h2> Backward Chaining - Dijagnostički upiti</h2>
        <p>
          Kreiraj specifične upite o aktivnoj biljci.
        </p>
        <br />

        {!hasActivePlant() ? (
          <div className="alert alert-warning">
            <strong> Nema aktivne biljke!</strong>
            <br />Molimo idite u sekciju <strong>" Vegetacija"</strong> i definiši biljku pre kreiranja upita.
            <br />
            <button
              className="btn"
              onClick={() => window.location.href = '/vegetation'}
              style={{ marginTop: '10px' }}
            >
              Idi na Vegetaciju
            </button>
          </div>
        ) : (
          <div className="alert alert-success">
            <strong> Aktivna biljka:</strong> {getPlantDisplayName()}
            <br />
            <small>Upiti će se odnositi na ovu biljku i njenu fenofazu ({activePlant?.phenophase})</small>
          </div>
        )}
      </div>

      <div className="grid">
        <div className="card">
          <h3> Kreiranje upita</h3>
          <br />
          <div className="form-group">
            <label>Tip upita:</label>
            <select
              value={queryData.type}
              onChange={(e) => handleQueryChange('type', e.target.value)}
            >
              <option value="disease">C1: Da li je bolest verovatna?</option>
              <option value="treatment">C2: Da li je tretman dozvoljen?</option>
              <option value="cause">C3: Koji uslovi su doveli do rizika?</option>
            </select>
          </div>

          {queryData.type === 'cause' ? (
            <div className="form-group">
              <label>Naziv bolesti:</label>
              <select
                value={queryData.diseaseName}
                onChange={(e) => handleQueryChange('diseaseName', e.target.value)}
              >
                <option value="Plamenjača">Plamenjača</option>
                <option value="Pepelnica">Pepelnica</option>
                <option value="Siva trulež">Siva trulež</option>
                <option value="Fuzarijum">Fuzarijum</option>
                <option value="Virus mozaika">Virus mozaika</option>
              </select>
              <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                C3 analizira uzročno-posledične veze za bolesti na osnovu aktivne biljke
              </small>
            </div>
          ) : queryData.type === 'disease' ? (
            <div className="form-group">
              <label>Naziv bolesti:</label>
              <select
                value={queryData.diseaseName}
                onChange={(e) => handleQueryChange('diseaseName', e.target.value)}
              >
                <option value="Plamenjača">Plamenjača</option>
                <option value="Pepelnica">Pepelnica</option>
                <option value="Siva trulež">Siva trulež</option>
                <option value="Fuzarijum">Fuzarijum</option>
                <option value="Virus mozaika">Virus mozaika</option>
              </select>
              <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                Verovatnoća zavisi od simptoma i uslova aktivne biljke
              </small>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Naziv tretmana:</label>
                <select
                  value={queryData.treatmentName}
                  onChange={(e) => handleQueryChange('treatmentName', e.target.value)}
                >
                  <option value="Bakarni preparat">Bakarni preparat (hemijski)</option>
                  <option value="Biološki fungicid">Biološki fungicid (biološki)</option>
                  <option value="Trichoderma">Trichoderma (biološki)</option>
                  <option value="Uklanjanje zaraženih biljaka">Uklanjanje biljaka (sanitarni)</option>
                </select>
                <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                  Fenofaza iz aktivne biljke: {activePlant?.phenophase || 'N/A'}
                </small>
              </div>

            </>
          )}

          <button
            className="btn btn-secondary"
            onClick={runQuery}
            disabled={loading}
            style={{ width: '100%', fontSize: '16px', padding: '12px', marginTop: '15px' }}
          >
            {loading ? ' Izvršava upit...' : ' Pokreni upit'}
          </button>
        </div>

        {/* Rezultati */}
        <div className="card">
          <h3> Rezultati upita</h3>
          {results.length === 0 ? (
            <div className="loading">
              Kreirajte i pokrenite upit da vidite rezultate...
            </div>
          ) : (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span><strong>Upit izvršen:</strong> {results[0].timestamp}</span>
                <button className="btn btn-danger" onClick={clearResults}>
                  Obriši rezultate
                </button>
              </div>

              {renderQueryResult(results[0])}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default BackwardChainingPage;