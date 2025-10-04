import { useState, useEffect } from 'react';
import { cepAPI } from '../services/api';
import { getActivePlant, hasActivePlant, getPlantDisplayName } from '../utils/plantUtils';

const CEPPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePlant, setActivePlant] = useState(null);
  const [cepParameters, setCepParameters] = useState({
    analysisWindow: '6h'
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
      // Dodaj podatke aktivne biljke u request
      const requestWithPlantData = {
        ...cepParameters,
        plantData: {
          temperature: activePlant.currentConditions.temperature,
          humidity: activePlant.currentConditions.humidity,
          co2Level: activePlant.currentConditions.co2Level,
          ventilationActive: activePlant.currentConditions.ventilationActive
        }
      };
      
      const response = await cepAPI.analyzeWithParameters(requestWithPlantData);
      const testName = 'CEP Analiza - ' + cepParameters.analysisWindow;

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
    setCepParameters(prev => ({
      ...prev,
      [field]: value
    }));
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
          <br/>
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
            <br/>
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

        {/* CEP */}
        <div className="card">
          <h3> CEP</h3>

          <br/>

          <div className="alert alert-info" style={{ marginBottom: '20px' }}>
            <strong>Napomena:</strong> CEP analiza koristi trenutne uslove aktivne biljke i generiše varijacije (±5°C, ±5%, ±200ppm) kroz izabrani vremenski prozor.
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
          <br/>
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