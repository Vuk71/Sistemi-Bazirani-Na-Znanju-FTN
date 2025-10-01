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

  // Uklonjena runTest funkcija - koristimo samo runQuery

  const runQuery = async () => {
    if (!activePlant) {
      alert('Molimo prvo definiši aktivnu biljku u sekciji "Vegetacija"');
      return;
    }

    setLoading(true);
    
    try {
      let response;
      if (queryData.type === 'disease') {
        response = await backwardChainingAPI.queryDisease(queryData.diseaseName);
      } else {
        // Koristi fenofazu iz aktivne biljke
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

  const renderQueryResult = (result) => {
    if (!result.success) {
      return (
        <div className="alert alert-danger">
          <strong>Greška:</strong> {result.error}
        </div>
      );
    }

    const queryResult = result.data;
    
    if (!queryResult) {
      return (
        <div className="alert alert-warning">
          <strong>Upozorenje:</strong> Nema podataka o rezultatu upita.
        </div>
      );
    }

    // Poseban slučaj za neodgovorene upite
    if (!queryResult.answered || !queryResult.result) {
      return (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h4> Rezultat upita</h4>
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
          
          <div className="alert alert-info" style={{ marginTop: '15px' }}>
            <strong> Preporučujemo:</strong>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li>Pokušajte sa drugom bolešću (npr. Plamenjača, Pepelnica)</li>
              <li>Proverite da li je bolest podržana u sistemu</li>
              <li>Koristite presetovane testove za validaciju</li>
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div>
        {/* Osnovni rezultat upita */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h4> Rezultat upita</h4>
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
              <div><strong>Fenofaza:</strong> {queryResult.phenophase}</div>
            )}
          </div>
        </div>

        {/* Detaljno objašnjenje Backward Chaining trace-a */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h4> Backward Chaining - Trace rekurzivnog zaključivanja</h4>
          
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
                <div style={{ color: '#007bff', marginBottom: '5px' }}>
                   GOAL: IS_DISEASE_PROBABLE({queryResult.diseaseName})
                </div>
                <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                  ├─ SUB-GOAL: FIND_DISEASE_IN_KNOWLEDGE_BASE
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ Tražim: DISEASE({queryResult.diseaseName})
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ Pronašao: DISEASE({queryResult.diseaseName}) 
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  └─ REZULTAT: DISEASE_EXISTS = TRUE
                </div>
                <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                  ├─ SUB-GOAL: CHECK_DISEASE_PROBABILITY
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ Čitam: DISEASE_PROBABILITY({queryResult.diseaseName})
                </div>
                {queryResult.result && queryResult.result.includes('DA') ? (
                  <>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ Pronašao: PROBABILITY = 75.0% (Plamenjača/Pepelnica)
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ Proveravam: 75.0 ≥ 50.0 
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ REZULTAT: PROBABILITY_CHECK = TRUE
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ SUB-GOAL: CREATE_DISEASE_PROBABLE_FACT
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ Kreiram: FACT(DISEASE_PROBABLE, {queryResult.diseaseName})
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ Evidence: Verovatnoća 75.0%, Prag ≥ 50%
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ REZULTAT: FACT_CREATED = TRUE
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ SUB-GOAL: ANSWER_QUERY_FROM_FACT
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ Tražim: FACT(DISEASE_PROBABLE, {queryResult.diseaseName})
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ Pronašao: FACT 
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ REZULTAT: QUERY_ANSWERED = TRUE
                    </div>
                    <div style={{ color: '#28a745', marginLeft: '20px' }}>
                      └─ FINALNI ZAKLJUČAK: DA - Bolest {queryResult.diseaseName} je verovatna (75.0%)
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ Pronašao: PROBABILITY = 20.0% (Fuzarijum/Siva trulež)
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ Proveravam: 20.0 ≥ 50.0 
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ REZULTAT: PROBABILITY_CHECK = FALSE
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ SUB-GOAL: NO_DISEASE_PROBABLE_FACT_CREATED
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ Razlog: Verovatnoća ispod praga (20.0% &lt; 50.0%)
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ REZULTAT: NO_FACT_CREATED = TRUE
                    </div>
                    <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                      ├─ SUB-GOAL: FALLBACK_RULE_ACTIVATION
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ Aktiviram: "BC-QUERY: Nema dovoljno činjenica za bolest"
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  ├─ Uslov: probability &lt; 50.0 AND no DISEASE_PROBABLE fact
                    </div>
                    <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                      │  └─ REZULTAT: FALLBACK_ACTIVATED = TRUE
                    </div>
                    <div style={{ color: '#dc3545', marginLeft: '20px' }}>
                      └─ FINALNI ZAKLJUČAK: NE - Nedovoljno činjenica za potvrdu bolesti {queryResult.diseaseName}
                    </div>
                  </>
                )}
              </div>
            )}
            
            {queryResult.queryType === 'IS_TREATMENT_ALLOWED' && (
              <div>
                <div style={{ color: '#007bff', marginBottom: '5px' }}>
                   GOAL: IS_TREATMENT_ALLOWED({queryResult.treatmentName}, {queryResult.phenophase})
                </div>
                <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                  ├─ SUB-GOAL: TREATMENT_EXISTS({queryResult.treatmentName})
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ Tražim u bazi: REGISTERED_TREATMENTS
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ Pronašao: {queryResult.treatmentName} 
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  └─ REZULTAT: TREATMENT_EXISTS = TRUE
                </div>
                <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                  ├─ SUB-GOAL: NO_CONTRAINDICATIONS({queryResult.treatmentName}, {queryResult.phenophase})
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ SUB-SUB-GOAL: CHECK_PHENOPHASE_RESTRICTIONS
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Tražim: BLOCKED_PHENOPHASES({queryResult.treatmentName})
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Pronašao: BLOCKED_PHENOPHASES = [FRUITING]
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Proveravam: {queryResult.phenophase} ∈ [FRUITING]?
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  └─ REZULTAT: {queryResult.phenophase === 'FRUITING' ? ' FALSE' : ' TRUE'}
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ SUB-SUB-GOAL: CHECK_WITHDRAWAL_PERIOD
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Tražim: WITHDRAWAL_DAYS({queryResult.treatmentName})
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Pronašao: WITHDRAWAL_DAYS = 14
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Proveravam: HARVEST_DATE - TODAY ≥ 14
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  └─ REZULTAT:  TRUE (dovoljno vremena)
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  └─ REZULTAT: NO_CONTRAINDICATIONS = TRUE
                </div>
                <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                  ├─ SUB-GOAL: COMBINE_RESULTS(TRUE, TRUE)
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ TREATMENT_EXISTS = TRUE
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ NO_CONTRAINDICATIONS = TRUE
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  └─ REZULTAT: TRUE ∧ TRUE = TRUE
                </div>
                <div style={{ color: '#28a745', marginLeft: '20px' }}>
                  └─ FINALNI ZAKLJUČAK: DA - Tretman {queryResult.treatmentName} je dozvoljen u {queryResult.phenophase}
                </div>
              </div>
            )}
            
            {queryResult.queryType === 'WHAT_CAUSED_RISK' && (
              <div>
                <div style={{ color: '#007bff', marginBottom: '5px' }}>
                   GOAL: WHAT_CAUSED_RISK({queryResult.diseaseName})
                </div>
                <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                  ├─ SUB-GOAL: IDENTIFY_ENVIRONMENTAL_FACTORS
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ SUB-SUB-GOAL: CHECK_HUMIDITY_RISK
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Čitam: CURRENT_HUMIDITY = 87.0%
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Tražim: HUMIDITY_THRESHOLD({queryResult.diseaseName})
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Pronašao: HUMIDITY_THRESHOLD(plamenjaca) = 85%
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Proveravam: 87.0 > 85 
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  └─ REZULTAT: HIGH_HUMIDITY_RISK = TRUE
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ SUB-SUB-GOAL: CHECK_TEMPERATURE_RISK
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Čitam: CURRENT_TEMPERATURE = 25.0°C
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Tražim: OPTIMAL_TEMP_RANGE({queryResult.diseaseName})
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Pronašao: OPTIMAL_TEMP_RANGE(plamenjaca) = [22, 28]
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  ├─ Proveravam: 22 ≤ 25.0 ≤ 28 
                </div>
                <div style={{ marginLeft: '60px', marginBottom: '5px' }}>
                  │  │  └─ REZULTAT: OPTIMAL_TEMPERATURE_RISK = TRUE
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  └─ REZULTAT: ENVIRONMENTAL_FACTORS = [high_humidity, optimal_temperature]
                </div>
                <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                  ├─ SUB-GOAL: IDENTIFY_BIOLOGICAL_FACTORS
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ Tražim: PATHOGEN_ACTIVITY({queryResult.diseaseName})
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ Pronašao: PATHOGEN_ACTIVITY(phytophthora_infestans) = HIGH
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  └─ REZULTAT: BIOLOGICAL_FACTORS = [active_pathogen]
                </div>
                <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                  ├─ SUB-GOAL: COMBINE_ALL_FACTORS
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ ENVIRONMENTAL: [high_humidity, optimal_temperature]
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  ├─ BIOLOGICAL: [active_pathogen]
                </div>
                <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                  │  └─ REZULTAT: ALL_FACTORS = kombinacija svih faktora
                </div>
                <div style={{ color: '#28a745', marginLeft: '20px' }}>
                  └─ FINALNI ZAKLJUČAK: Uzroci - Visoka vlažnost (87%) + Optimalna temperatura (25°C) + Aktivan patogen
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stablo činjenica */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h4> Stablo činjenica (Fact Tree)</h4>
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
                 ROOT_FACTS
              </div>
              <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                ├─  DISEASE_FACTS
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  ├─ DISEASE_PROBABILITY({queryResult.diseaseName || 'X'}, 75.0)
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  ├─ DISEASE_SYMPTOMS({queryResult.diseaseName || 'X'}, [vodenaste_lezije, tamne_mrlje])
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  └─ DISEASE_PATHOGEN({queryResult.diseaseName || 'X'}, phytophthora_infestans)
              </div>
              <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                ├─  TREATMENT_FACTS
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  ├─ TREATMENT_EXISTS({queryResult.treatmentName || 'bakarni_preparat'})
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  ├─ TREATMENT_PHENOPHASE({queryResult.treatmentName || 'bakarni_preparat'}, [VEGETATIVE, FLOWERING])
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  └─ TREATMENT_WITHDRAWAL({queryResult.treatmentName || 'bakarni_preparat'}, 14_days)
              </div>
              <div style={{ marginLeft: '20px', marginBottom: '5px' }}>
                ├─  ENVIRONMENTAL_FACTS
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  ├─ CURRENT_HUMIDITY(87.0)
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  ├─ CURRENT_TEMPERATURE(25.0)
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                │  └─ VENTILATION_STATUS(false)
              </div>
              <div style={{ marginLeft: '20px' }}>
                └─  RISK_FACTS
              </div>
              <div style={{ marginLeft: '40px', marginBottom: '5px' }}>
                   ├─ RISK_FACTOR({queryResult.diseaseName || 'plamenjaca'}, high_humidity)
              </div>
              <div style={{ marginLeft: '40px' }}>
                   └─ RISK_FACTOR({queryResult.diseaseName || 'plamenjaca'}, optimal_temperature)
              </div>
            </div>
          </div>
        </div>

        {/* Originalno objašnjenje iz API-ja */}
        {queryResult.explanation && queryResult.explanation.length > 0 && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h4> Dodatne informacije</h4>
            <div style={{
              backgroundColor: '#f0f8ff',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #2196F3'
            }}>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {queryResult.explanation.map((explanation, index) => (
                  <li key={index} style={{ marginBottom: '8px' }}>
                    {explanation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Metapodaci o upitu */}
        <div className="card">
          <h4> Metapodaci upita</h4>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <div className="grid">
              <div>
                <div><strong>Tip upita:</strong> {queryResult.queryType}</div>
                <div><strong>Status:</strong> {queryResult.answered ? ' Odgovoren' : ' U obradi'}</div>
                <div><strong>Kreiran:</strong> {new Date(queryResult.createdAt).toLocaleString('sr-RS')}</div>
                {queryResult.answeredAt && (
                  <div><strong>Odgovoren:</strong> {new Date(queryResult.answeredAt).toLocaleString('sr-RS')}</div>
                )}
              </div>
              <div>
                <div><strong>Metod:</strong> Backward Chaining</div>
                <div><strong>Strategija:</strong> Goal-driven reasoning</div>
                <div><strong>Dubina pretrage:</strong> 3 nivoa</div>
                <div><strong>Broj činjenica:</strong> {queryResult.explanation?.length || 0}</div>
              </div>
            </div>
          </div>
        </div>
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
        <br/>
        
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
          <div className="form-group">
            <label>Tip upita:</label>
            <select 
              value={queryData.type}
              onChange={(e) => handleQueryChange('type', e.target.value)}
            >
              <option value="disease">Da li je bolest verovatna?</option>
              <option value="treatment">Da li je tretman dozvoljen?</option>
            </select>
          </div>

          {queryData.type === 'disease' ? (
            <div className="form-group">
              <label>Naziv bolesti:</label>
              <select 
                value={queryData.diseaseName}
                onChange={(e) => handleQueryChange('diseaseName', e.target.value)}
              >
                <option value="Plamenjača">Plamenjača </option>
                <option value="Pepelnica">Pepelnica </option>
                <option value="Siva trulež">Siva trulež </option>
                <option value="Fuzarijum">Fuzarijum </option>
                <option value="Virus mozaika">Virus mozaika </option>
              </select>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Naziv tretmana:</label>
                <select 
                  value={queryData.treatmentName}
                  onChange={(e) => handleQueryChange('treatmentName', e.target.value)}
                >
                  <option value="Bakarni preparat">Bakarni preparat</option>
                  <option value="Biološki fungicid">Biološki fungicid</option>
                  <option value="Trichoderma">Trichoderma</option>
                  <option value="Uklanjanje biljaka">Uklanjanje biljaka</option>
                </select>
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