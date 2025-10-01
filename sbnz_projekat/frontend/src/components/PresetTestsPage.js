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

  const formatResult = (result) => {
    if (typeof result === 'string') {
      return result.split('\n').map((line, index) => (
        <div key={index} style={{ marginBottom: '5px' }}>
          {line}
        </div>
      ));
    }
    return JSON.stringify(result, null, 2);
  };

  const tests = [
    {
      category: 'Forward Chaining - Osnovni testovi',
      items: [
        { name: 'Test Plamenjača', key: 'plamenjaca', func: diagnosisAPI.testPlamenjaca },
        { name: 'Test Pepelnica', key: 'pepelnica', func: diagnosisAPI.testPepelnica },
        { name: 'Test Siva trulež', key: 'siva-trulez', func: diagnosisAPI.testSivaTrulez },
        { name: 'Test Fuzarijum', key: 'fuzarijum', func: diagnosisAPI.testFuzarijum },
        { name: 'Test Virus mozaika', key: 'virus', func: diagnosisAPI.testVirus },
      ]
    },
    {
      category: 'Forward Chaining - Napredni testovi',
      items: [
        { name: 'Kompleksno ulančavanje', key: 'complex', func: diagnosisAPI.testComplexChaining },
        { name: 'Više bolesti istovremeno', key: 'multiple', func: diagnosisAPI.testMultipleDiseases },
        { name: 'Ograničenja tretmana', key: 'restrictions', func: diagnosisAPI.testTreatmentRestrictions },
      ]
    },
    {
      category: 'Backward Chaining - Upiti',
      items: [
        { name: 'Visoka verovatnoća bolesti', key: 'high-prob', func: backwardChainingAPI.testHighProbabilityDisease },
        { name: 'Niska verovatnoća bolesti', key: 'low-prob', func: backwardChainingAPI.testLowProbabilityDisease },
        { name: 'Tretman dozvoljen (vegetativni)', key: 'allowed-veg', func: backwardChainingAPI.testTreatmentAllowedVegetative },
        { name: 'Tretman blokiran (plodonošenje)', key: 'blocked-fruit', func: backwardChainingAPI.testTreatmentBlockedFruiting },
        { name: 'Uzroci rizika - Plamenjača', key: 'cause-plam', func: backwardChainingAPI.testWhatCausedPlamenjaca },
        { name: 'Uzroci rizika - Pepelnica', key: 'cause-pep', func: backwardChainingAPI.testWhatCausedPepelnica },
      ]
    },
    {
      category: 'CEP - Temporalni operatori',
      items: [
        { name: 'E1: Kritični uslovi (Sliding Window)', key: 'critical', func: cepAPI.testCriticalConditions },
        { name: 'E2: Rizik kondenzacije (Tumbling Window)', key: 'condensation', func: cepAPI.testCondensationRisk },
        { name: 'E3: Rizik Botrytis (Sekvencijalni)', key: 'botrytis', func: cepAPI.testBotrytisRisk },
        { name: 'E4: Alarm ventilacije (Temporalni NOT)', key: 'ventilation', func: cepAPI.testVentilationAlarm },
        { name: 'E5: Stabilni uslovi pepelnica (During)', key: 'powdery', func: cepAPI.testPowderyMildew },
        { name: 'E6: Rastući trend vlažnosti (Before)', key: 'humidity', func: cepAPI.testHumidityTrend },
      ]
    },
    {
      category: 'Sveobuhvatni testovi',
      items: [
        { name: 'Svi Forward Chaining testovi', key: 'all-fc', func: diagnosisAPI.testAll },
        { name: 'Svi Backward Chaining testovi', key: 'all-bc', func: backwardChainingAPI.testAllBackward },
        { name: 'Svi CEP testovi', key: 'all-cep', func: cepAPI.testAllCEP },
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
        <br/>
        <div className="alert alert-warning">
          <strong>Napomena:</strong> Ovi testovi koriste fiksne podatke za demonstraciju. 
          Za unos vlastitih podataka koristite glavne sekcije (Forward Chaining, Backward Chaining, CEP).
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3> Dostupni presetovani testovi</h3>
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
                  style={{ 
                    width: '100%', 
                    marginBottom: '8px',
                    opacity: loading && activeTest !== test.name ? 0.6 : 1
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
          {results.length === 0 ? (
            <div className="loading">
              Pokrenite test da vidite rezultate...
            </div>
          ) : (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
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
                      padding: '10px', 
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      whiteSpace: 'pre-wrap',
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}>
                      {formatResult(result.data)}
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