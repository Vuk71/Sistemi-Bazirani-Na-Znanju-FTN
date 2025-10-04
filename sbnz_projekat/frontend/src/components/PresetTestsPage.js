import React, { useState } from 'react';
import { diagnosisAPI, backwardChainingAPI, cepAPI } from '../services/api';

const PresetTestsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTest, setActiveTest] = useState(null);

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    setActiveTest(testName);

    try {
      const response = await testFunction();
      const result = {
        testName,
        success: true,
        data: response.data,
        timestamp: new Date().toLocaleString('sr-RS')
      };
      setResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
    } catch (error) {
      const result = {
        testName,
        success: false,
        error: error.response?.data || error.message,
        timestamp: new Date().toLocaleString('sr-RS')
      };
      setResults(prev => [result, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
      setActiveTest(null);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const formatResult = (result, testName) => {
    // Ako je string, formatuj kao tekst
    if (typeof result === 'string') {
      return result.split('\n').map((line, index) => (
        <div key={index} style={{ marginBottom: '5px' }}>
          {line}
        </div>
      ));
    }

    // Ako je objekat, formatuj na osnovu tipa testa
    if (typeof result === 'object' && result !== null) {

      // Forward Chaining rezultati
      if (result.probableDiseases || result.recommendedTreatments) {
        return (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <h5 style={{ color: '#2196F3', marginBottom: '8px' }}>Dijagnostikovane bolesti:</h5>
              {result.probableDiseases && result.probableDiseases.length > 0 ? (
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {result.probableDiseases.map((disease, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>
                      <strong>{disease.name}</strong> - {disease.probability}% verovatnoća
                      <br />
                      <small style={{ color: '#666' }}>Patogen: {disease.pathogen}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: '#666', fontStyle: 'italic' }}>Nema dijagnostikovanih bolesti</div>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h5 style={{ color: '#4CAF50', marginBottom: '8px' }}>Preporučeni tretmani:</h5>
              {result.recommendedTreatments && result.recommendedTreatments.length > 0 ? (
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {result.recommendedTreatments.map((treatment, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>
                      <strong>{treatment.name}</strong> ({treatment.type})
                      <br />
                      <small style={{ color: '#666' }}>
                        Doza: {treatment.dosage} | Karenca: {treatment.withdrawalPeriod} dana
                      </small>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: '#666', fontStyle: 'italic' }}>Nema preporučenih tretmana</div>
              )}
            </div>

            {result.explanation && result.explanation.length > 0 && (
              <div>
                <h5 style={{ color: '#FF9800', marginBottom: '8px' }}>Objašnjenje:</h5>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {result.explanation.map((exp, index) => (
                    <li key={index} style={{ marginBottom: '3px', fontSize: '13px' }}>
                      {exp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      }

      // Backward Chaining rezultati
      if (result.queryType) {
        return (
          <div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Tip upita:</strong> {result.queryType}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Rezultat:</strong>
              <span style={{
                color: result.result && result.result.includes('DA') ? '#4CAF50' : '#f44336',
                fontWeight: 'bold',
                marginLeft: '8px'
              }}>
                {result.result || 'Nema odgovora'}
              </span>
            </div>
            {result.diseaseName && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Bolest:</strong> {result.diseaseName}
              </div>
            )}
            {result.treatmentName && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Tretman:</strong> {result.treatmentName}
              </div>
            )}
            {result.phenophase && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Fenofaza:</strong> {result.phenophase}
              </div>
            )}
            {result.explanation && result.explanation.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <h5 style={{ color: '#FF9800', marginBottom: '8px' }}>Objašnjenje:</h5>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {result.explanation.map((exp, index) => (
                    <li key={index} style={{ marginBottom: '3px', fontSize: '13px' }}>
                      {exp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      }

      // CEP rezultati - može biti niz alertova ili objekat sa alerts svojstvom
      if (Array.isArray(result) && result.length > 0 && result[0].level) {
        // Direktan niz alertova
        return (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <h5 style={{ color: '#f44336', marginBottom: '8px' }}>
                CEP Alertovi ({result.length} detektovano):
              </h5>
              {result.map((alert, index) => {
                const levelColor = alert.level === 'CRITICAL' ? '#f44336' :
                  alert.level === 'HIGH' ? '#ff9800' :
                    alert.level === 'MEDIUM' ? '#2196f3' : '#4caf50';
                const levelBg = alert.level === 'CRITICAL' ? '#ffebee' :
                  alert.level === 'HIGH' ? '#fff3e0' :
                    alert.level === 'MEDIUM' ? '#e3f2fd' : '#e8f5e8';

                return (
                  <div key={index} style={{
                    backgroundColor: levelBg,
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    border: `2px solid ${levelColor}`
                  }}>
                    <div style={{
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      color: levelColor,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>
                        {alert.level === 'CRITICAL' && 'KRITIČNO'}
                        {alert.level === 'HIGH' && 'VISOK RIZIK'}
                        {alert.level === 'MEDIUM' && 'UMEREN RIZIK'}
                        {alert.level === 'LOW' && 'NIZAK RIZIK'}
                        {alert.diseaseName && ` - ${alert.diseaseName}`}
                      </span>
                      <small style={{ color: '#666', fontWeight: 'normal' }}>
                        {new Date(alert.timestamp || alert.triggeredAt).toLocaleTimeString('sr-RS')}
                      </small>
                    </div>

                    <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                      <strong>Opis:</strong> {alert.message || alert.description}
                    </div>

                    {alert.recommendation && (
                      <div style={{
                        fontSize: '13px',
                        color: '#333',
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        padding: '8px',
                        borderRadius: '4px',
                        marginTop: '8px'
                      }}>
                        <strong>Preporuka:</strong> {alert.recommendation || alert.recommendedAction}
                      </div>
                    )}

                    {alert.status && (
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        Status: {alert.status}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '13px'
            }}>
              <strong>Statistike:</strong>
              <div style={{ marginTop: '5px' }}>
                • Ukupno alertova: {result.length}
                • Kritični: {result.filter(a => a.level === 'CRITICAL').length}
                • Visoki rizik: {result.filter(a => a.level === 'HIGH').length}
                • Umeren rizik: {result.filter(a => a.level === 'MEDIUM').length}
              </div>
            </div>
          </div>
        );
      }

      // CEP rezultati kao objekat
      if (result.alerts || result.events) {
        return (
          <div>
            {result.alerts && result.alerts.length > 0 && (
              <div style={{ marginBottom: '15px' }}>
                <h5 style={{ color: '#f44336', marginBottom: '8px' }}>CEP Alertovi:</h5>
                {result.alerts.map((alert, index) => (
                  <div key={index} style={{
                    backgroundColor: '#ffebee',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    border: '1px solid #f44336'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      {alert.level} - {alert.diseaseName || 'CEP Alert'}
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                      {alert.message}
                    </div>
                    {alert.recommendation && (
                      <div style={{ fontSize: '13px', color: '#666' }}>
                        Preporuka: {alert.recommendation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {result.events && result.events.length > 0 && (
              <div>
                <h5 style={{ color: '#2196F3', marginBottom: '8px' }}>Detektovani događaji:</h5>
                <div style={{ fontSize: '13px' }}>
                  Ukupno događaja: {result.events.length}
                </div>
              </div>
            )}

            {(!result.alerts || result.alerts.length === 0) &&
              (!result.events || result.events.length === 0) && (
                <div style={{ color: '#666', fontStyle: 'italic' }}>
                  Nema detektovanih alertova ili događaja
                </div>
              )}
          </div>
        );
      }
    }

    // Fallback - prikaži kao JSON
    return (
      <pre style={{
        fontSize: '12px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    );
  };

  const tests = [
    {
      category: 'Forward Chaining - Osnovni testovi',
      items: [
        {
          name: 'Test Plamenjača',
          key: 'plamenjaca',
          func: diagnosisAPI.testPlamenjaca,
          description: 'Biljka: Paradajz (San Marzano), Fenofaza: Vegetativna\nSimptomi: Vodenaste lezije\nUslovi: T=25°C, RH=87%\nOčekivani rezultat: Dijagnoza plamenjače (Phytophthora infestans)'
        },
        {
          name: 'Test Pepelnica',
          key: 'pepelnica',
          func: diagnosisAPI.testPepelnica,
          description: 'Biljka: Krastavac (Marketmore), Fenofaza: Plodonošenje\nSimptomi: Bele naslage\nUslovi: T=24°C, RH=75%\nOčekivani rezultat: Dijagnoza pepelnice (Erysiphe spp.)'
        },
        {
          name: 'Test Siva trulež',
          key: 'siva-trulez',
          func: diagnosisAPI.testSivaTrulez,
          description: 'Biljka: Paprika (California Wonder), Fenofaza: Cvetanje\nSimptomi: Siva prevlaka\nUslovi: T=22°C, RH=95%\nOčekivani rezultat: Dijagnoza sive truleži (Botrytis cinerea)'
        },
        {
          name: 'Test Fuzarijum',
          key: 'fuzarijum',
          func: diagnosisAPI.testFuzarijum,
          description: 'Biljka: Paradajz (Cherokee Purple), Fenofaza: Vegetativna\nSimptomi: Uvenuće, Posmeđenje žila\nUslovi: T=28°C, RH=70%\nOčekivani rezultat: Dijagnoza fuzarijumskog venenja (Fusarium oxysporum)'
        },
        {
          name: 'Test Virus mozaika',
          key: 'virus',
          func: diagnosisAPI.testVirus,
          description: 'Biljka: Duvanski list (Burley), Fenofaza: Vegetativna\nSimptomi: Mozaik šare\nUslovi: T=26°C, RH=65%\nOčekivani rezultat: Dijagnoza virusa mozaika (TMV/ToMV), bez hemijskog tretmana'
        },
      ]
    },
    {
      category: 'Forward Chaining - Napredni testovi',
      items: [
        {
          name: 'Kompleksno ulančavanje',
          key: 'complex',
          func: diagnosisAPI.testComplexChaining,
          description: 'Biljka: Paradajz (San Marzano), Fenofaza: Vegetativna\nSimptomi: Vodenaste lezije + Bele naslage\nUslovi: T=25°C, RH=87%, CO₂=1100ppm, Ventilacija: OFF\n'
        },
        {
          name: 'Više bolesti istovremeno',
          key: 'multiple',
          func: diagnosisAPI.testMultipleDiseases,
          description: 'Biljka: Paradajz (Cherokee Purple), Fenofaza: Cvetanje\nSimptomi: Vodenaste lezije + Siva prevlaka + Uvenuće\nUslovi: T=24°C, RH=92%\nDemonstrira: Bayes analizu za više verovatnih bolesti, prioritizaciju tretmana'
        },
        {
          name: 'Ograničenja tretmana',
          key: 'restrictions',
          func: diagnosisAPI.testTreatmentRestrictions,
          description: 'Biljka: Paradajz (San Marzano), Fenofaza: Plodonošenje\nSimptomi: Vodenaste lezije\nUslovi: T=25°C, RH=87%\nPlanirana berba: Za 7 dana\nDemonstrira: Proveru karencije, blokiranje tretmana neodgovarajućih za fenofazu'
        },
      ]
    },
    {
      category: 'Backward Chaining - Upiti',
      items: [
        {
          name: 'Visoka verovatnoća bolesti',
          key: 'high-prob',
          func: backwardChainingAPI.testHighProbabilityDisease,
          description: 'Upit: "Da li je plamenjača verovatna?"\nBiljka: Paradajz, Fenofaza: Vegetativna\nSimptomi: Vodenaste lezije, Bela prevlaka, Trulež plodova\nUslovi: T=25°C, RH=90%\nOčekivani odgovor: DA (>70% verovatnoća)'
        },
        {
          name: 'Niska verovatnoća bolesti',
          key: 'low-prob',
          func: backwardChainingAPI.testLowProbabilityDisease,
          description: 'Upit: "Da li je pepelnica verovatna?"\nBiljka: Paradajz, Fenofaza: Vegetativna\nSimptomi: Samo žućenje listova (nedostaju ključni simptomi)\nUslovi: T=30°C, RH=50% (van optimalnog opsega)\nOčekivani odgovor: NE (<30% verovatnoća)'
        },
        {
          name: 'Tretman dozvoljen (vegetativni)',
          key: 'allowed-veg',
          func: backwardChainingAPI.testTreatmentAllowedVegetative,
          description: 'Upit: "Da li je Mancozeb dozvoljen u vegetativnoj fazi?"\nBiljka: Paradajz, Fenofaza: Vegetativna\nTretman: Mancozeb (karenca: 14 dana)\nPlanirana berba: Za 30 dana\nOčekivani odgovor: DA (karenca zadovoljena, fenofaza odgovarajuća)'
        },
        {
          name: 'Tretman blokiran (plodonošenje)',
          key: 'blocked-fruit',
          func: backwardChainingAPI.testTreatmentBlockedFruiting,
          description: 'Upit: "Da li je Mancozeb dozvoljen u plodonošenju?"\nBiljka: Paradajz, Fenofaza: Plodonošenje\nTretman: Mancozeb (karenca: 14 dana)\nPlanirana berba: Za 7 dana\nOčekivani odgovor: NE (karenca nije zadovoljena)'
        },
        {
          name: 'Uzroci rizika - Plamenjača',
          key: 'cause-plam',
          func: backwardChainingAPI.testWhatCausedPlamenjaca,
          description: 'Upit: "Koji uslovi su doveli do rizika plamenjače?"\nBiljka: Paradajz, Fenofaza: Vegetativna\nUslovi: T=25°C, RH=90%, Ventilacija: OFF\nOčekivani odgovor: Visoka vlažnost (>85%), temperatura u opsegu (22-28°C), nedovoljna ventilacija'
        },
        {
          name: 'Uzroci rizika - Pepelnica',
          key: 'cause-pep',
          func: backwardChainingAPI.testWhatCausedPepelnica,
          description: 'Upit: "Koji uslovi su doveli do rizika pepelnice?"\nBiljka: Krastavac, Fenofaza: Cvetanje\nUslovi: T=23°C, RH=70%, Ventilacija: OFF\nOčekivani odgovor: Umerena vlažnost (60-80%), temperatura u opsegu (20-25°C), loša cirkulacija vazduha'
        },
      ]
    },
    {
      category: 'CEP - Temporalni operatori',
      items: [
        {
          name: 'E1: Kritični uslovi (Sliding Window)',
          key: 'critical',
          func: cepAPI.testCriticalConditions,
          description: 'CEP Operator: Sliding Window (6h)\nPodaci: 6 očitavanja u poslednjih 6h\n  • Temperatura: 25±3°C (22-28°C)\n  • Vlažnost: 87-95%\nOčekivani rezultat: Alert za plamenjaču (RH > 85% + T ∈ [22,28]°C)'
        },
        {
          name: 'E2: Rizik kondenzacije (Tumbling Window)',
          key: 'condensation',
          func: cepAPI.testCondensationRisk,
          description: 'CEP Operator: Tumbling Window (24h)\nPodaci: 8 očitavanja u poslednjih 24h\n  • Vlažnost: 92-97% (>90%)\n  • Ventilacija: 3 događaja OFF\nOčekivani rezultat: Kritičan alert za kondenzaciju i Botrytis'
        },
        {
          name: 'E3: Rizik Botrytis (Sekvencijalni)',
          key: 'botrytis',
          func: cepAPI.testBotrytisRisk,
          description: 'CEP Operator: Sekvencijalni obrazac (after)\nPodaci:\n  1. Navodnjavanje (50L, 30min) - pre 1h\n  2. Vlažnost: 90% - nakon 30min\n  3. CO₂: 1300ppm - nakon 20min\nOčekivani rezultat: Alert za Botrytis (sekvenca: navodnjavanje → RH → CO₂)'
        },
        {
          name: 'E4: Alarm ventilacije (Temporalni NOT)',
          key: 'ventilation',
          func: cepAPI.testVentilationAlarm,
          description: 'CEP Operator: Temporalni NOT (missing event)\nPodaci:\n  • Vlažnost: 95% (SADA)\n  • Ventilacija: Nema događaja (NOT)\nOčekivani rezultat: Kritičan alert - ventilacija nije aktivirana uprkos visokoj vlažnosti'
        },
        {
          name: 'E5: Stabilni uslovi pepelnica (During)',
          key: 'powdery',
          func: cepAPI.testPowderyMildew,
          description: 'CEP Operator: DURING (stabilni uslovi)\nPodaci: 4 očitavanja u poslednjih 4h\n  • Temperatura: 22-25°C (stabilno)\n  • Vlažnost: 65-80% (stabilno)\nOčekivani rezultat: Alert za pepelnicu (stabilni optimalni uslovi tokom 4h)'
        },
        {
          name: 'E6: Rastući trend vlažnosti (Before)',
          key: 'humidity',
          func: cepAPI.testHumidityTrend,
          description: 'CEP Operator: BEFORE (trend analiza)\nPodaci:\n  • Početna vlažnost: 50% (pre 3h)\n  • 5 očitavanja: 62%, 64%, 66%, 68%, 70%\n  • Finalna vlažnost: 75% (pre 1h)\nOčekivani rezultat: Alert za rastući trend (+25% rast)'
        },
      ]
    },
    {
      category: 'Sveobuhvatni testovi',
      items: [
        {
          name: 'Svi Forward Chaining testovi',
          key: 'all-fc',
          func: diagnosisAPI.testAll,
          description: 'Izvršava sve Forward Chaining testove redom:\n  1. Plamenjača\n  2. Pepelnica\n  3. Siva trulež\n  4. Fuzarijum\n  5. Virus mozaika\n  6. Kompleksno ulančavanje\n  7. Više bolesti\n  8. Ograničenja tretmana\nKoristi se za brzu validaciju celokupnog FC sistema.'
        },
        {
          name: 'Svi Backward Chaining testovi',
          key: 'all-bc',
          func: backwardChainingAPI.testAllBackward,
          description: 'Izvršava sve Backward Chaining testove redom:\n  1. Visoka verovatnoća bolesti\n  2. Niska verovatnoća bolesti\n  3. Tretman dozvoljen\n  4. Tretman blokiran\n  5. Uzroci rizika - Plamenjača\n  6. Uzroci rizika - Pepelnica\nKoristi se za brzu validaciju celokupnog BC sistema.'
        },
        {
          name: 'Svi CEP testovi',
          key: 'all-cep',
          func: cepAPI.testAllCEP,
          description: 'Izvršava sve CEP testove redom:\n  E1: Sliding Window\n  E2: Tumbling Window\n  E3: Sekvencijalni obrazac\n  E4: Temporalni NOT\n  E5: DURING operator\n  E6: BEFORE operator\nKoristi se za brzu validaciju celokupnog CEP sistema.'
        },
      ]
    }
  ];

  return (
    <div>
      <div className="card">
        <h2> Presetovani testovi sistema</h2>
        <p>
          Ova sekcija sadrži predefinirane testove za demonstraciju svih funkcionalnosti sistema.
          Testovi koriste unapred pripremljene podatke za brzu validaciju implementiranih mehanizama.
        </p>
        <br />
        <div className="alert alert-warning">
          <strong>Napomena:</strong> Ovi testovi koriste fiksne podatke za demonstraciju.
          Za unos vlastitih podataka koristite glavne sekcije (Forward Chaining, Backward Chaining, CEP).
        </div>
      </div>

      <div className="grid">
        <div className="card">
          {tests.map((category, categoryIndex) => (
            <div key={categoryIndex} style={{ marginBottom: '25px' }}>
              <h4 style={{
                color: '#4CAF50',
                marginBottom: '10px',
                borderBottom: '2px solid #4CAF50',
                paddingBottom: '5px'
              }}>
                {category.category}
              </h4>
              {category.items.map((test, testIndex) => (
                <button
                  key={testIndex}
                  className="btn"
                  onClick={() => runTest(test.name, test.func)}
                  disabled={loading}
                  title={test.description}
                  style={{
                    width: '100%',
                    marginBottom: '8px',
                    opacity: loading && activeTest !== test.name ? 0.6 : 1,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {loading && activeTest === test.name ? ' Izvršava...' : test.name}
                </button>
              ))}
            </div>
          ))}

          {results.length > 0 && (
            <button
              className="btn btn-danger"
              onClick={clearResults}
              style={{ width: '100%', marginTop: '15px' }}
            >
              Obriši rezultate
            </button>
          )}
        </div>

        <div className="card">
          <h3> Rezultati testova</h3>
          <br />

          {results.length === 0 ? (
            <div className="loading">
              Pokrenite test da vidite rezultate...
            </div>
          ) : (
            <div style={{ maxHeight: '1461px', overflowY: 'auto' }}>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`alert ${result.success ? 'alert-success' : 'alert-danger'}`}
                  style={{ marginBottom: '15px' }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <strong>{result.testName}</strong>
                    <small>{result.timestamp}</small>
                  </div>

                  {result.success ? (
                    <div style={{
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      padding: '15px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      maxHeight: '400px',
                      overflowY: 'auto'
                    }}>
                      {formatResult(result.data, result.testName)}
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      padding: '10px',
                      borderRadius: '4px',
                      color: '#721c24'
                    }}>
                      <strong>Greška:</strong> {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default PresetTestsPage;