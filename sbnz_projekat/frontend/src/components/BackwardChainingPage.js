import React, { useState } from 'react';
import { backwardChainingAPI } from '../services/api';

const BackwardChainingPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTest, setActiveTest] = useState(null);
  const [customQuery, setCustomQuery] = useState({
    type: 'disease',
    diseaseName: 'Plamenjača',
    treatmentName: 'Bakarni preparat',
    phenophase: 'VEGETATIVE'
  });

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

  const runCustomQuery = async () => {
    if (customQuery.type === 'disease') {
      await runTest(
        `Prilagođeni upit: ${customQuery.diseaseName}`,
        () => backwardChainingAPI.queryDisease(customQuery.diseaseName)
      );
    } else {
      await runTest(
        `Prilagođeni upit: ${customQuery.treatmentName} u ${customQuery.phenophase}`,
        () => backwardChainingAPI.queryTreatment(customQuery.treatmentName, customQuery.phenophase)
      );
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
      category: 'C1: Da li je bolest verovatna?',
      items: [
        { name: 'Visoka verovatnoća bolesti', key: 'high-prob', func: backwardChainingAPI.testHighProbabilityDisease },
        { name: 'Niska verovatnoća bolesti', key: 'low-prob', func: backwardChainingAPI.testLowProbabilityDisease },
      ]
    },
    {
      category: 'C2: Da li je tretman dozvoljen?',
      items: [
        { name: 'Tretman dozvoljen (vegetativni)', key: 'allowed-veg', func: backwardChainingAPI.testTreatmentAllowedVegetative },
        { name: 'Tretman blokiran (plodonošenje)', key: 'blocked-fruit', func: backwardChainingAPI.testTreatmentBlockedFruiting },
      ]
    },
    {
      category: 'C3: Analiza uzroka rizika',
      items: [
        { name: 'Uzroci rizika - Plamenjača', key: 'cause-plam', func: backwardChainingAPI.testWhatCausedPlamenjaca },
        { name: 'Uzroci rizika - Pepelnica', key: 'cause-pep', func: backwardChainingAPI.testWhatCausedPepelnica },
      ]
    },
    {
      category: 'Sveobuhvatni testovi',
      items: [
        { name: 'Svi Backward Chaining testovi', key: 'all-bc', func: backwardChainingAPI.testAllBackward },
        { name: 'Demo Backward Chaining', key: 'demo-bc', func: backwardChainingAPI.demo },
      ]
    }
  ];

  return (
    <div>
      <div className="card">
        <h2>🔍 Backward Chaining - Dijagnostički upiti</h2>
        <p>
          Backward chaining implementira rekurzivne upite kroz stablo činjenica.
          Sistem odgovara na specifična pitanja analizirajući postojeće znanje unazad.
        </p>
      </div>

      <div className="grid">
        <div className="card">
          <h3>🧪 Predefinisani testovi</h3>
          {tests.map((category, categoryIndex) => (
            <div key={categoryIndex} style={{ marginBottom: '25px' }}>
              <h4 style={{ 
                color: '#2196F3', 
                marginBottom: '10px',
                borderBottom: '2px solid #2196F3',
                paddingBottom: '5px'
              }}>
                {category.category}
              </h4>
              {category.items.map((test, testIndex) => (
                <button
                  key={testIndex}
                  className="btn btn-secondary"
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
        </div>

        <div className="card">
          <h3>🎯 Prilagođeni upiti</h3>
          <div className="form-group">
            <label>Tip upita:</label>
            <select 
              value={customQuery.type}
              onChange={(e) => setCustomQuery(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="disease">Da li je bolest verovatna?</option>
              <option value="treatment">Da li je tretman dozvoljen?</option>
            </select>
          </div>

          {customQuery.type === 'disease' ? (
            <div className="form-group">
              <label>Naziv bolesti:</label>
              <select 
                value={customQuery.diseaseName}
                onChange={(e) => setCustomQuery(prev => ({ ...prev, diseaseName: e.target.value }))}
              >
                <option value="Plamenjača">Plamenjača</option>
                <option value="Pepelnica">Pepelnica</option>
                <option value="Siva trulež">Siva trulež</option>
                <option value="Fuzarijum">Fuzarijum</option>
                <option value="Virus mozaika">Virus mozaika</option>
              </select>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Naziv tretmana:</label>
                <select 
                  value={customQuery.treatmentName}
                  onChange={(e) => setCustomQuery(prev => ({ ...prev, treatmentName: e.target.value }))}
                >
                  <option value="Bakarni preparat">Bakarni preparat</option>
                  <option value="Biološki fungicid">Biološki fungicid</option>
                  <option value="Trichoderma">Trichoderma</option>
                  <option value="Uklanjanje biljaka">Uklanjanje biljaka</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fenofaza:</label>
                <select 
                  value={customQuery.phenophase}
                  onChange={(e) => setCustomQuery(prev => ({ ...prev, phenophase: e.target.value }))}
                >
                  <option value="VEGETATIVE">Vegetativni rast</option>
                  <option value="FLOWERING">Cvetanje</option>
                  <option value="FRUITING">Plodonošenje</option>
                </select>
              </div>
            </>
          )}

          <button 
            className="btn btn-secondary" 
            onClick={runCustomQuery}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? '⏳ Izvršava upit...' : '🔍 Pokreni prilagođeni upit'}
          </button>
        </div>
      </div>

      <div className="card">
        <h3>📋 Rezultati upita</h3>
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
            Pokrenite upit da vidite rezultate...
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
        <h3>📖 Objašnjenje Backward Chaining mehanizma</h3>
        <div className="grid">
          <div>
            <h4>🎯 Tipovi upita</h4>
            <div className="status-badge status-high" style={{ margin: '5px', display: 'block' }}>
              C1: IS_DISEASE_PROBABLE - Da li je bolest verovatna?
            </div>
            <div className="status-badge status-medium" style={{ margin: '5px', display: 'block' }}>
              C2: IS_TREATMENT_ALLOWED - Da li je tretman dozvoljen?
            </div>
            <div className="status-badge status-low" style={{ margin: '5px', display: 'block' }}>
              C3: WHAT_CAUSED_RISK - Koji uslovi su doveli do rizika?
            </div>
          </div>
          <div>
            <h4>🌳 Stablo činjenica</h4>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>DISEASE_PROBABLE:</strong> Verovatnoća bolesti</li>
              <li><strong>TREATMENT_ALLOWED:</strong> Dozvoljeni tretmani</li>
              <li><strong>RISK_CAUSE:</strong> Uzroci rizika</li>
              <li><strong>PHENOPHASE_RESTRICTION:</strong> Ograničenja po fenofazi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackwardChainingPage;