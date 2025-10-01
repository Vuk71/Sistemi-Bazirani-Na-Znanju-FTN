import React, { useState, useEffect } from 'react';
import { cepAPI } from '../services/api';
import { getActivePlant, hasActivePlant, getPlantDisplayName, updatePlantConditions } from '../utils/plantUtils';

const CEPPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePlant, setActivePlant] = useState(null);
  const [cepParameters, setCepParameters] = useState({
    analysisWindow: '6h',
    alertThresholds: {
      humidity: 85,
      temperature: { min: 22, max: 28 },
      ventilationTimeout: 30
    }
  });

  // Učitaj aktivnu biljku pri pokretanju
  useEffect(() => {
    const plant = getActivePlant();
    setActivePlant(plant);
  }, []);

  const runCEPAnalysis = async () => {
    if (!activePlant) {
      alert(' Molimo prvo definiši aktivnu biljku u sekciji "Vegetacija"');
      return;
    }

    setLoading(true);
    
    try {
      // Poziv API-ja sa podacima o aktivnoj biljci
      const response = await cepAPI.testCriticalConditions(); // Ovo ćemo zameniti sa pravim API pozivom
      
      const result = {
        success: true,
        data: response.data,
        timestamp: new Date().toLocaleString('sr-RS'),
        inputData: {
          plant: activePlant,
          cepParameters: cepParameters
        }
      };
      setResults([result]);
    } catch (error) {
      const result = {
        success: false,
        error: error.response?.data || error.message,
        timestamp: new Date().toLocaleString('sr-RS'),
        inputData: {
          plant: activePlant,
          cepParameters: cepParameters
        }
      };
      setResults([result]);
    } finally {
      setLoading(false);
    }
  };

  const handleParameterChange = (field, value) => {
    if (field.startsWith('alertThresholds.')) {
      const thresholdField = field.split('.')[1];
      setCepParameters(prev => ({
        ...prev,
        alertThresholds: {
          ...prev.alertThresholds,
          [thresholdField]: value
        }
      }));
    } else {
      setCepParameters(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const updatePlantConditionsFromCEP = () => {
    if (!activePlant) return;
    
    const newConditions = {
      temperature: activePlant.currentConditions.temperature,
      humidity: activePlant.currentConditions.humidity,
      co2Level: activePlant.currentConditions.co2Level,
      ventilationActive: activePlant.currentConditions.ventilationActive
    };
    
    updatePlantConditions(newConditions);
    alert(' Uslovi biljke su ažurirani!');
  };

  const clearResults = () => {
    setResults([]);
  };

  const renderCEPResults = (result) => {
    if (!result.success) {
      return (
        <div className="alert alert-danger">
          <strong>Greška:</strong> {result.error}
        </div>
      );
    }

    const alerts = result.data;

    return (
      <div>
        {/* CEP Alertovi */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h4> Generisani CEP alertovi</h4>
          {alerts && alerts.length > 0 ? (
            <div>
              {alerts.map((alert, index) => (
                <div key={index} style={{
                  backgroundColor: alert.level === 'CRITICAL' ? '#ffebee' : alert.level === 'HIGH' ? '#fff3e0' : '#e8f5e8',
                  padding: '15px',
                  borderRadius: '8px',
                  border: `2px solid ${alert.level === 'CRITICAL' ? '#f44336' : alert.level === 'HIGH' ? '#ff9800' : '#4CAF50'}`,
                  marginBottom: '15px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {alert.level === 'CRITICAL' && ''} 
                      {alert.level === 'HIGH' && ''} 
                      {alert.level === 'MEDIUM' && ''} 
                      {alert.diseaseName || 'CEP Alert'}
                    </div>
                    <div className={`status-badge ${alert.level === 'CRITICAL' ? 'status-high' : alert.level === 'HIGH' ? 'status-medium' : 'status-low'}`}>
                      {alert.level}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Opis:</strong> {alert.description || alert.message}
                  </div>
                  
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Preporučena akcija:</strong> {alert.recommendedAction || alert.recommendation}
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <strong>Vreme:</strong> {new Date(alert.triggeredAt || alert.timestamp).toLocaleString('sr-RS')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-success">
               Nema aktivnih alertova - uslovi su u normalnim granicama
            </div>
          )}
        </div>

        {/* Temporalni operatori */}
        <div className="card">
          <h4>🕐 Korišćeni temporalni operatori</h4>
          <div className="grid">
            <div style={{
              backgroundColor: '#f0f8ff',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #2196F3'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>SLIDING WINDOW</div>
              <div style={{ fontSize: '14px' }}>
                Klizni prozor od 6h za kontinuirano praćenje kritičnih uslova
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#fff3e0',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #ff9800'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>TEMPORALNI NOT</div>
              <div style={{ fontSize: '14px' }}>
                Detekcija nedostajućih događaja (ventilacija)
              </div>
            </div>
            
            <div style={{
              backgroundColor: '#e8f5e8',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #4CAF50'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>AFTER</div>
              <div style={{ fontSize: '14px' }}>
                Sekvencijalni događaji sa vremenskim ograničenjima
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Uklonjen tests array - koristimo samo monitoring formu

  return (
    <div>
      <div className="card">
        <h2> Complex Event Processing (CEP) - Rana detekcija rizika</h2>
        <p>
          Pokreni CEP analizu na aktivnoj biljci za detekciju kompleksnih temporalnih obrazaca 
          koji ukazuju na rizik od bolesti u realnom vremenu.
        </p>
        <br/>
        
        {!hasActivePlant() ? (
          <div className="alert alert-warning">
            <strong> Nema aktivne biljke!</strong> 
            <br />Molimo idite u sekciju <strong>" Vegetacija"</strong> i definiši biljku pre CEP analize.
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
            <small>CEP analiza će koristiti uslove ove biljke za detekciju rizika</small>
          </div>
        )}
      </div>

      <div className="grid">
        {/* Pregled aktivne biljke */}
        {activePlant && (
          <div className="card">
            <h3> Aktivna biljka</h3>
            <div className="grid">
              <div>
                <h4> Osnovni podaci</h4>
                <div><strong>Kultura:</strong> {activePlant.cropType}</div>
                <div><strong>Sorta:</strong> {activePlant.variety}</div>
                <div><strong>Fenofaza:</strong> {activePlant.phenophase}</div>
                <div><strong>Lokacija:</strong> {activePlant.location}</div>
              </div>
              <div>
                <h4> Trenutni uslovi</h4>
                <div><strong>Temperatura:</strong> {activePlant.currentConditions.temperature}°C</div>
                <div><strong>Vlažnost:</strong> {activePlant.currentConditions.humidity}%</div>
                <div><strong>CO₂:</strong> {activePlant.currentConditions.co2Level} ppm</div>
                <div><strong>Ventilacija:</strong> {activePlant.currentConditions.ventilationActive ? ' Aktivna' : ' Neaktivna'}</div>
              </div>
            </div>
          </div>
        )}

        {/* CEP parametri */}
        <div className="card">
          <h3> CEP parametri</h3>
          <p>Podesi parametre za Complex Event Processing analizu:</p>
          
          <div className="form-group">
            <label>Prozor analize:</label>
            <select 
              value={cepParameters.analysisWindow}
              onChange={(e) => handleParameterChange('analysisWindow', e.target.value)}
              disabled={!activePlant}
            >
              <option value="1h">1 sat</option>
              <option value="6h">6 sati</option>
              <option value="24h">24 sata</option>
            </select>
          </div>

          <div className="form-group">
            <label>Prag vlažnosti (%):</label>
            <input 
              type="number"
              value={cepParameters.alertThresholds.humidity}
              onChange={(e) => handleParameterChange('alertThresholds.humidity', parseInt(e.target.value))}
              disabled={!activePlant}
            />
          </div>

          <div className="form-group">
            <label>Min temperatura (°C):</label>
            <input 
              type="number"
              step="0.1"
              value={cepParameters.alertThresholds.temperature.min}
              onChange={(e) => {
                const newTemp = { ...cepParameters.alertThresholds.temperature };
                newTemp.min = parseFloat(e.target.value);
                handleParameterChange('alertThresholds.temperature', newTemp);
              }}
              disabled={!activePlant}
            />
          </div>

          <div className="form-group">
            <label>Max temperatura (°C):</label>
            <input 
              type="number"
              step="0.1"
              value={cepParameters.alertThresholds.temperature.max}
              onChange={(e) => {
                const newTemp = { ...cepParameters.alertThresholds.temperature };
                newTemp.max = parseFloat(e.target.value);
                handleParameterChange('alertThresholds.temperature', newTemp);
              }}
              disabled={!activePlant}
            />
          </div>

          <div className="form-group">
            <label>Timeout ventilacije (min):</label>
            <input 
              type="number"
              value={cepParameters.alertThresholds.ventilationTimeout}
              onChange={(e) => handleParameterChange('alertThresholds.ventilationTimeout', parseInt(e.target.value))}
              disabled={!activePlant}
            />
          </div>

          <button 
            className="btn" 
            onClick={runCEPAnalysis}
            disabled={loading}
            style={{ 
              width: '100%', 
              marginTop: '20px', 
              fontSize: '16px', 
              padding: '12px',
              backgroundColor: '#ff9800',
              borderColor: '#ff9800'
            }}
          >
            {loading ? ' Analiziram...' : ' Pokreni CEP analizu'}
          </button>
        </div>

        {/* Rezultati */}
        <div className="card">
          <h3> Rezultati CEP analize</h3>
          {results.length === 0 ? (
            <div className="loading">
              Unesite monitoring podatke i pokrenite CEP analizu da vidite rezultate...
            </div>
          ) : (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span><strong>Analiza završena:</strong> {results[0].timestamp}</span>
                <button className="btn btn-danger" onClick={clearResults}>
                   Obriši rezultate
                </button>
              </div>
              
              {renderCEPResults(results[0])}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default CEPPage;