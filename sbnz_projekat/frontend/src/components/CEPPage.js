import React, { useState } from 'react';
import { cepAPI } from '../services/api';

const CEPPage = () => {
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
      setResults(prev => [result, ...prev.slice(0, 9)]);
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
      category: 'Temporalni Window operatori',
      items: [
        { 
          name: 'E1: Kritični uslovi (Sliding Window 6h)', 
          key: 'critical', 
          func: cepAPI.testCriticalConditions,
          description: 'over window:time(6h) - SLIDING WINDOW'
        },
        { 
          name: 'E2: Rizik kondenzacije (Tumbling Window 24h)', 
          key: 'condensation', 
          func: cepAPI.testCondensationRisk,
          description: 'over window:time(24h) - TUMBLING WINDOW'
        },
      ]
    },
    {
      category: 'Temporalni sekvencijalni operatori',
      items: [
        { 
          name: 'E3: Rizik Botrytis (Sekvencijalni)', 
          key: 'botrytis', 
          func: cepAPI.testBotrytisRisk,
          description: 'after[0s,2h] - TEMPORALNI SEKVENCIJALNI'
        },
        { 
          name: 'E4: Alarm ventilacije (Nedostajući događaj)', 
          key: 'ventilation', 
          func: cepAPI.testVentilationAlarm,
          description: 'not ... after[0s,30m] - TEMPORALNI NOT'
        },
      ]
    },
    {
      category: 'Kombinovani temporalni operatori',
      items: [
        { 
          name: 'E5: Stabilni uslovi pepelnica (During)', 
          key: 'powdery', 
          func: cepAPI.testPowderyMildew,
          description: 'over window:time(4h) - TEMPORALNI DURING'
        },
        { 
          name: 'E6: Rastući trend vlažnosti (Before)', 
          key: 'humidity', 
          func: cepAPI.testHumidityTrend,
          description: 'after[30m,2h] - TEMPORALNI BEFORE'
        },
      ]
    },
    {
      category: 'Sveobuhvatni CEP testovi',
      items: [
        { name: 'Svi CEP testovi', key: 'all-cep', func: cepAPI.testAllCEP },
        { name: 'Demo CEP', key: 'demo-cep', func: cepAPI.demo },
      ]
    }
  ];

  return (
    <div>
      <div className="card">
        <h2>⚡ Complex Event Processing (CEP) - Rana detekcija rizika</h2>
        <p>
          CEP implementira prave temporalne operatore za analizu tokova događaja u realnom vremenu.
          Sistem detektuje kompleksne obrasce koji ukazuju na rizik od bolesti.
        </p>
      </div>

      <div className="grid">
        <div className="card">
          <h3>🧪 CEP testovi sa temporalnim operatorima</h3>
          {tests.map((category, categoryIndex) => (
            <div key={categoryIndex} style={{ marginBottom: '25px' }}>
              <h4 style={{ 
                color: '#ff9800', 
                marginBottom: '10px',
                borderBottom: '2px solid #ff9800',
                paddingBottom: '5px'
              }}>
                {category.category}
              </h4>
              {category.items.map((test, testIndex) => (
                <div key={testIndex} style={{ marginBottom: '12px' }}>
                  <button
                    className="btn"
                    onClick={() => runTest(test.name, test.func)}
                    disabled={loading}
                    style={{ 
                      width: '100%', 
                      marginBottom: '5px',
                      opacity: loading && activeTest !== test.name ? 0.6 : 1,
                      backgroundColor: '#ff9800',
                      borderColor: '#ff9800'
                    }}
                  >
                    {loading && activeTest === test.name ? '⏳ Izvršava...' : test.name}
                  </button>
                  {test.description && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#666', 
                      fontStyle: 'italic',
                      marginLeft: '10px'
                    }}>
                      {test.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          
          {results.length > 0 && (
            <button 
              className="btn btn-danger" 
              onClick={clearResults}
              style={{ width: '100%', marginTop: '15px' }}
            >
              🗑️ Obriši rezultate
            </button>
          )}
        </div>

        <div className="card">
          <h3>📊 CEP Analiza u realnom vremenu</h3>
          <div className="grid">
            <div>
              <h4>🕐 Window operatori</h4>
              <div className="status-badge status-high" style={{ margin: '5px', display: 'block' }}>
                SLIDING WINDOW - Klizni prozor
              </div>
              <div className="status-badge status-medium" style={{ margin: '5px', display: 'block' }}>
                TUMBLING WINDOW - Prekidajući prozor
              </div>
            </div>
            <div>
              <h4>⏰ Temporalni operatori</h4>
              <div className="status-badge status-low" style={{ margin: '5px', display: 'block' }}>
                AFTER - Sekvencijalni događaji
              </div>
              <div className="status-badge status-high" style={{ margin: '5px', display: 'block' }}>
                NOT AFTER - Nedostajući događaji
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>📋 Rezultati CEP analize</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span>Ukupno rezultata: {results.length}</span>
          {results.length > 0 && (
            <button className="btn btn-danger" onClick={clearResults}>
              🗑️ Obriši rezultate
            </button>
          )}
        </div>
        
        {results.length === 0 ? (
          <div className="loading">
            Pokrenite CEP test da vidite rezultate...
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

      <div className="card">
        <h3>📖 Objašnjenje CEP mehanizma</h3>
        <div className="grid">
          <div>
            <h4>⚡ Implementirani CEP obrasci</h4>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>E1:</strong> Sliding window 6h - kritični uslovi plamenjače</li>
              <li><strong>E2:</strong> Tumbling window 24h - rizik kondenzacije</li>
              <li><strong>E3:</strong> Sekvencijalni after[0s,2h] - Botrytis rizik</li>
              <li><strong>E4:</strong> Temporalni NOT - nedostajuća ventilacija</li>
              <li><strong>E5:</strong> During window 4h - stabilni uslovi pepelnice</li>
              <li><strong>E6:</strong> Before after[30m,2h] - trend vlažnosti</li>
            </ul>
          </div>
          <div>
            <h4>🎯 Tipovi događaja</h4>
            <div className="status-badge status-high" style={{ margin: '5px', display: 'block' }}>
              SensorReading - Senzorska očitavanja
            </div>
            <div className="status-badge status-medium" style={{ margin: '5px', display: 'block' }}>
              IrrigationEvent - Događaji navodnjavanja
            </div>
            <div className="status-badge status-low" style={{ margin: '5px', display: 'block' }}>
              VentilationEvent - Događaji ventilacije
            </div>
            <div className="status-badge status-high" style={{ margin: '5px', display: 'block' }}>
              RiskAlert - Generisani alarmi
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CEPPage;