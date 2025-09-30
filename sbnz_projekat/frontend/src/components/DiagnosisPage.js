import React, { useState } from 'react';
import { diagnosisAPI } from '../services/api';

const DiagnosisPage = () => {
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
      category: 'Osnovni testovi dijagnoze',
      items: [
        { name: 'Test Plamenjača', key: 'plamenjaca', func: diagnosisAPI.testPlamenjaca },
        { name: 'Test Pepelnica', key: 'pepelnica', func: diagnosisAPI.testPepelnica },
        { name: 'Test Siva trulež', key: 'siva-trulez', func: diagnosisAPI.testSivaTrulez },
        { name: 'Test Fuzarijum', key: 'fuzarijum', func: diagnosisAPI.testFuzarijum },
        { name: 'Test Virus mozaika', key: 'virus', func: diagnosisAPI.testVirus },
      ]
    },
    {
      category: 'Napredni testovi',
      items: [
        { name: 'Kompleksno ulančavanje', key: 'complex', func: diagnosisAPI.testComplexChaining },
        { name: 'Više bolesti istovremeno', key: 'multiple', func: diagnosisAPI.testMultipleDiseases },
        { name: 'Ograničenja tretmana', key: 'restrictions', func: diagnosisAPI.testTreatmentRestrictions },
      ]
    },
    {
      category: 'Sveobuhvatni testovi',
      items: [
        { name: 'Svi Forward Chaining testovi', key: 'all', func: diagnosisAPI.testAll },
        { name: 'Demo sistem', key: 'demo', func: diagnosisAPI.demo },
      ]
    }
  ];

  return (
    <div>
      <div className="card">
        <h2>🔄 Forward Chaining - Dijagnostika i tretmani</h2>
        <p>
          Forward chaining implementira operativne odluke sa 3+ nivoa ulančavanja pravila.
          Sistem analizira simptome, uslove sredine i istoriju tretmana da generiše dijagnoze i preporuke.
        </p>
      </div>

      <div className="grid">
        <div className="card">
          <h3>🧪 Dostupni testovi</h3>
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
                  {loading && activeTest === test.name ? '⏳ Izvršava...' : test.name}
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
              🗑️ Obriši rezultate
            </button>
          )}
        </div>

        <div className="card">
          <h3>📋 Rezultati testova</h3>
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

      <div className="card">
        <h3>📖 Objašnjenje Forward Chaining mehanizma</h3>
        <div className="grid">
          <div>
            <h4>🎯 Implementirana pravila</h4>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>R01:</strong> Kritični uslovi za plamenjaču (RH&gt;85%, T∈[22,28]°C)</li>
              <li><strong>R02:</strong> Plamenjača + vodenaste lezije → +25%</li>
              <li><strong>R11:</strong> Visoka vlažnost → dodatni rizik</li>
              <li><strong>R03:</strong> Preporuka tretmana (≥70%)</li>
              <li><strong>R04:</strong> Pepelnica sa belim naslagama</li>
              <li><strong>R06:</strong> Siva trulež + visoka vlažnost</li>
              <li><strong>R07:</strong> Fuzarijum (uvenuće + posmeđenje)</li>
              <li><strong>R09:</strong> Virus mozaika (mozaik bez gljivica)</li>
            </ul>
          </div>
          <div>
            <h4>🔗 Nivoi ulančavanja</h4>
            <div className="status-badge status-high" style={{ margin: '5px', display: 'block' }}>
              Nivo 1: Detekcija osnovnih uslova
            </div>
            <div className="status-badge status-medium" style={{ margin: '5px', display: 'block' }}>
              Nivo 2: Kombinovanje sa simptomima
            </div>
            <div className="status-badge status-low" style={{ margin: '5px', display: 'block' }}>
              Nivo 3: Dodatni faktori rizika
            </div>
            <div className="status-badge status-high" style={{ margin: '5px', display: 'block' }}>
              Nivo 4: Generisanje preporuka
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisPage;