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
      const { humidity, temperature } = cepParameters.alertThresholds;
      const window = cepParameters.analysisWindow;

      let response;
      let testName = '';

      // Pokušaj prvo sa novim endpointom (ako je backend restartovan)
      try {
        response = await cepAPI.analyzeWithParameters(cepParameters);

        // Određivanje imena testa na osnovu parametara
        if (humidity >= 90 && window === '24h') {
          testName = 'E2: Rizik kondenzacije (Siva trulež)';
        } else if (humidity >= 85 && temperature.min >= 20 && temperature.max <= 30 && window === '6h') {
          testName = 'E1: Kritični uslovi (Plamenjača)';
        } else if (humidity >= 60 && humidity <= 80 && temperature.min >= 18 && temperature.max <= 26) {
          testName = 'E5: Optimalni uslovi (Pepelnica)';
        } else if (humidity >= 88) {
          testName = 'E3: Rizik Botrytis';
        } else if (cepParameters.alertThresholds.ventilationTimeout > 20) {
          testName = 'E4: Alarm ventilacije';
        } else {
          testName = 'E6: Trend vlažnosti';
        }
      } catch (newEndpointError) {
        // Fallback na stare endpointe ako novi ne postoji
        console.log('Novi endpoint nije dostupan, koristim stare endpointe');

        if (humidity >= 90 && window === '24h') {
          response = await cepAPI.testCondensationRisk();
          testName = 'E2: Rizik kondenzacije (Siva trulež)';
        } else if (humidity >= 85 && temperature.min >= 20 && temperature.max <= 30 && window === '6h') {
          response = await cepAPI.testCriticalConditions();
          testName = 'E1: Kritični uslovi (Plamenjača)';
        } else if (humidity >= 60 && humidity <= 80 && temperature.min >= 18 && temperature.max <= 26) {
          response = await cepAPI.testPowderyMildew();
          testName = 'E5: Optimalni uslovi (Pepelnica)';
        } else if (humidity >= 88) {
          response = await cepAPI.testBotrytisRisk();
          testName = 'E3: Rizik Botrytis';
        } else if (cepParameters.alertThresholds.ventilationTimeout > 20) {
          response = await cepAPI.testVentilationAlarm();
          testName = 'E4: Alarm ventilacije';
        } else {
          response = await cepAPI.testHumidityTrend();
          testName = 'E6: Trend vlažnosti';
        }
      }

      const result = {
        success: true,
        data: response.data,
        timestamp: new Date().toLocaleString('sr-RS'),
        testName: testName,
        inputData: {
          plant: activePlant,
          cepParameters: cepParameters
        }
      };
      setResults([result]);
    } catch (error) {
      // Formatiranje greške u string
      let errorMessage = error.message;
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      }

      const result = {
        success: false,
        error: errorMessage,
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
        <br />

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

          <br/>

          {/* Presetovane vrednosti */}
          <div style={{ marginBottom: '20px' }}>
            <strong>Brzi presetovi za sva CEP pravila:</strong>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setCepParameters({
                  analysisWindow: '6h',
                  alertThresholds: {
                    humidity: 85,
                    temperature: { min: 22, max: 28 },
                    ventilationTimeout: 30
                  }
                })}
                style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#f44336', borderColor: '#f44336', color: 'white' }}
              >
                E1: Plamenjača
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setCepParameters({
                  analysisWindow: '24h',
                  alertThresholds: {
                    humidity: 90,
                    temperature: { min: 15, max: 25 },
                    ventilationTimeout: 60
                  }
                })}
                style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#9c27b0', borderColor: '#9c27b0', color: 'white' }}
              >
                E2: Siva trulež
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setCepParameters({
                  analysisWindow: '2h',
                  alertThresholds: {
                    humidity: 88,
                    temperature: { min: 18, max: 28 },
                    ventilationTimeout: 15
                  }
                })}
                style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#009688', borderColor: '#009688', color: 'white' }}
              >
                E3: Botrytis
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setCepParameters({
                  analysisWindow: '1h',
                  alertThresholds: {
                    humidity: 92,
                    temperature: { min: 15, max: 30 },
                    ventilationTimeout: 35
                  }
                })}
                style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#ff9800', borderColor: '#ff9800', color: 'white' }}
              >
                E4: Ventilacija
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setCepParameters({
                  analysisWindow: '4h',
                  alertThresholds: {
                    humidity: 70,
                    temperature: { min: 20, max: 25 },
                    ventilationTimeout: 20
                  }
                })}
                style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#4caf50', borderColor: '#4caf50', color: 'white' }}
              >
                E5: Pepelnica
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setCepParameters({
                  analysisWindow: '3h',
                  alertThresholds: {
                    humidity: 55,
                    temperature: { min: 18, max: 28 },
                    ventilationTimeout: 15
                  }
                })}
                style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#2196f3', borderColor: '#2196f3', color: 'white' }}
              >
                E6: Trend vlažnosti
              </button>
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Klikni na preset da automatski podesiš parametre za odgovarajući CEP test
            </div>
          </div>

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
            <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              Vremenski period za analizu događaja. Duži prozor detektuje dugotrajne obrasce.
            </small>
          </div>

          <div className="form-group">
            <label>Prag vlažnosti (%):</label>
            <input
              type="number"
              value={cepParameters.alertThresholds.humidity}
              onChange={(e) => handleParameterChange('alertThresholds.humidity', parseInt(e.target.value))}
              disabled={!activePlant}
              min="0"
              max="100"
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              Minimalna vlažnost za aktiviranje alarma. Plamenjača: &gt;85%, Siva trulež: &gt;90%
            </small>
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
              min="0"
              max="50"
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
              min="0"
              max="50"
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              Optimalni temperaturni opseg za bolest. Plamenjača: 22-28°C, Pepelnica: 20-25°C
            </small>
          </div>

          <div className="form-group">
            <label>Timeout ventilacije (min):</label>
            <input
              type="number"
              value={cepParameters.alertThresholds.ventilationTimeout}
              onChange={(e) => handleParameterChange('alertThresholds.ventilationTimeout', parseInt(e.target.value))}
              disabled={!activePlant}
              min="0"
              max="120"
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              Maksimalno vreme bez ventilacije pri visokoj vlažnosti pre alarma (TEMPORALNI NOT operator)
            </small>
          </div>

          <button
            className="btn"
            onClick={runCEPAnalysis}
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '10px',
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
                <div>
                  <div><strong>Analiza završena:</strong> {results[0].timestamp}</div>
                  {results[0].testName && (
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                      <strong>Pokrenut test:</strong> {results[0].testName}
                    </div>
                  )}
                </div>
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