import React, { useState, useEffect } from 'react';
import { diagnosisAPI } from '../services/api';
import { getActivePlant, hasActivePlant, getPlantDisplayName } from '../utils/plantUtils';

const DiagnosisPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePlant, setActivePlant] = useState(null);
  const [symptoms, setSymptoms] = useState({
    vodenasteLezioni: false,
    belePrevlake: false,
    sivaPrevlaka: false,
    zutilo: false,
    uvenuće: false,
    mozaikSare: false,
    tamneMarlje: false,
    posmeđenjeZila: false
  });

  // Učitaj aktivnu biljku pri pokretanju
  useEffect(() => {
    const plant = getActivePlant();
    setActivePlant(plant);
  }, []);

  const runDiagnosis = async () => {
    if (!activePlant) {
      alert(' Molimo prvo definiši aktivnu biljku u sekciji "Vegetacija"');
      return;
    }

    setLoading(true);
    
    try {
      // Poziv API-ja sa podacima o aktivnoj biljci i simptomima
      const response = await diagnosisAPI.testComplexChaining(); // Ovo ćemo zameniti sa pravim API pozivom
      
      const result = {
        success: true,
        data: response.data,
        timestamp: new Date().toLocaleString('sr-RS'),
        inputData: {
          plant: activePlant,
          symptoms: symptoms
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
          symptoms: symptoms
        }
      };
      setResults([result]);
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomChange = (symptom, value) => {
    setSymptoms(prev => ({
      ...prev,
      [symptom]: value
    }));
  };

  const clearResults = () => {
    setResults([]);
  };

  const renderDiagnosisResult = (result) => {
    if (!result.success) {
      return (
        <div className="alert alert-danger">
          <strong>Greška:</strong> {result.error}
        </div>
      );
    }

    const { probableDiseases, recommendedTreatments, explanations } = result.data;

    return (
      <div>
        {/* Dijagnostikovane bolesti */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h4> Dijagnostikovane bolesti</h4>
          {probableDiseases && probableDiseases.length > 0 ? (
            <div className="grid">
              {probableDiseases.map((disease, index) => (
                <div key={index} style={{
                  backgroundColor: disease.probability > 70 ? '#ffebee' : disease.probability > 50 ? '#fff3e0' : '#e8f5e8',
                  padding: '15px',
                  borderRadius: '8px',
                  border: `2px solid ${disease.probability > 70 ? '#f44336' : disease.probability > 50 ? '#ff9800' : '#4CAF50'}`
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>
                    {disease.name}
                  </div>
                  <div><strong>Patogen:</strong> {disease.pathogen}</div>
                  <div><strong>Verovatnoća:</strong> {disease.probability.toFixed(1)}%</div>
                  <div className={`status-badge ${disease.probability > 70 ? 'status-high' : disease.probability > 50 ? 'status-medium' : 'status-low'}`}>
                    {disease.probability > 70 ? 'VISOKA VEROVATNOĆA' : disease.probability > 50 ? 'SREDNJA VEROVATNOĆA' : 'NISKA VEROVATNOĆA'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-warning">Nema dijagnostikovanih bolesti</div>
          )}
        </div>

        {/* Preporučeni tretmani */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h4> Preporučeni tretmani</h4>
          {recommendedTreatments && recommendedTreatments.length > 0 ? (
            <div className="grid">
              {recommendedTreatments.map((treatment, index) => (
                <div key={index} style={{
                  backgroundColor: '#f0f8ff',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #2196F3'
                }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
                    {treatment.name}
                  </div>
                  <div><strong>Tip:</strong> {treatment.type}</div>
                  <div><strong>Doza:</strong> {treatment.dosage}</div>
                  <div><strong>Karenca:</strong> {treatment.withdrawalDays} dana</div>
                  <div><strong>Prioritet:</strong> {treatment.priority}</div>
                  {treatment.recommendationReason && (
                    <div style={{ marginTop: '10px', fontStyle: 'italic', color: '#666' }}>
                      <strong>Razlog:</strong> {treatment.recommendationReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-warning">Nema preporučenih tretmana</div>
          )}
        </div>

        {/* Objašnjenja */}
        {explanations && explanations.length > 0 && (
          <div className="card">
            <h4>📝 Objašnjenja sistema</h4>
            <ul style={{ paddingLeft: '20px' }}>
              {explanations.map((explanation, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  {explanation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const symptomLabels = {
    vodenasteLezioni: 'Vodenaste lezije na listovima',
    belePrevlake: 'Bele praškaste naslage',
    sivaPrevlaka: 'Siva prevlaka na plodovima',
    zutilo: 'Žutilo listova',
    uvenuće: 'Uvenuće biljaka',
    mozaikSare: 'Mozaik šare na listovima',
    tamneMarlje: 'Tamne mrlje na plodovima',
    posmeđenjeZila: 'Posmeđenje provodnih žila'
  };

  return (
    <div>
      <div className="card">
        <h2> Forward Chaining - Dijagnostika i tretmani</h2>
        <p>
          Označite simptome na aktivnoj biljci da biste dobili dijagnozu i preporuke tretmana.
        </p>
        <br/>
        
        {!hasActivePlant() ? (
          <div className="alert alert-warning">
            <strong> Nema aktivne biljke!</strong> 
            <br />Molimo idite u sekciju <strong>" Vegetacija"</strong> i definiši biljku pre dijagnostike.
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
            <small>Lokacija: {activePlant?.location} | Posađeno: {activePlant?.plantedDate}</small>
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

        {/* Forma za simptome */}
        <div className="card">
          <h3> Simptomi na biljci</h3>
          <p>Označite simptome koje uočavate na aktivnoj biljci:</p>
          
          {Object.entries(symptomLabels).map(([key, label]) => (
            <div key={key} className="form-group">
              <label>
                <input 
                  type="checkbox"
                  checked={symptoms[key]}
                  onChange={(e) => handleSymptomChange(key, e.target.checked)}
                  style={{ marginRight: '8px' }}
                  disabled={!activePlant}
                />
                {label}
              </label>
            </div>
          ))}

          <button 
            className="btn" 
            onClick={runDiagnosis}
            disabled={loading || !activePlant}
            style={{ width: '100%', marginTop: '20px', fontSize: '16px', padding: '12px' }}
          >
            {loading ? ' Analiziram...' : ' Pokreni dijagnostiku'}
          </button>
          
          {!activePlant && (
            <div className="alert alert-warning" style={{ marginTop: '15px' }}>
              Definiši aktivnu biljku u sekciji " Vegetacija" da bi mogao da pokreneš dijagnostiku.
            </div>
          )}
        </div>

        {/* Rezultati */}
        <div className="card">
          <h3> Rezultati dijagnostike</h3>
          {results.length === 0 ? (
            <div className="loading">
              Unesite podatke i pokrenite dijagnostiku da vidite rezultate...
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
              
              {renderDiagnosisResult(results[0])}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Primer Forward Chaining mehanizma</h3>
        <div className="grid">
          <div>
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
            <h4>Nivoi ulančavanja</h4>
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