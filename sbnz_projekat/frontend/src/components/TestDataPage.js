import React, { useState } from 'react';

const TestDataPage = () => {
  const [selectedScenario, setSelectedScenario] = useState('plamenjaca');

  const testScenarios = {
    plamenjaca: {
      title: '🍅 Scenario: Plamenjača (Phytophthora infestans)',
      description: 'Kompletan test scenario za dijagnostiku i tretman plamenjače',
      environmentalConditions: {
        temperature: 25.0,
        humidity: 87.0,
        co2Level: 800,
        ventilationActive: false
      },
      symptoms: [
        'Vodenaste lezije na listovima',
        'Tamne mrlje na plodovima',
        'Bela prevlaka na naličju lista'
      ],
      expectedDiagnosis: {
        disease: 'Plamenjača',
        probability: 75.0,
        confidence: 'Visoka'
      },
      recommendedTreatments: [
        {
          name: 'Bakarni preparat',
          type: 'CHEMICAL',
          dosage: '2-3 g/L',
          withdrawalDays: 14,
          priority: 3
        }
      ],
      cepAlerts: [
        'E1: Kritični uslovi za plamenjaču (RH>85%, T∈[22,28]°C)',
        'E4: Nedostajuća ventilacija pri visokoj vlažnosti'
      ],
      backwardChainingQueries: [
        'C1: Da li je Plamenjača verovatna? → DA (75%)',
        'C2: Da li je Bakarni preparat dozvoljen u vegetativnoj fazi? → DA',
        'C3: Koji uslovi su doveli do rizika? → Visoka vlažnost + optimalna temperatura'
      ]
    },
    pepelnica: {
      title: '🤍 Scenario: Pepelnica (Erysiphe cichoracearum)',
      description: 'Test scenario za pepelnicu sa stabilnim uslovima',
      environmentalConditions: {
        temperature: 22.0,
        humidity: 70.0,
        co2Level: 900,
        ventilationActive: true
      },
      symptoms: [
        'Bele praškaste naslage na listovima',
        'Žutilo starijih listova',
        'Deformacija mladih listova'
      ],
      expectedDiagnosis: {
        disease: 'Pepelnica',
        probability: 85.0,
        confidence: 'Vrlo visoka'
      },
      recommendedTreatments: [
        {
          name: 'Biološki fungicid',
          type: 'BIOLOGICAL',
          dosage: '1-2 mL/L',
          withdrawalDays: 3,
          priority: 2
        }
      ],
      cepAlerts: [
        'E5: Stabilni uslovi za pepelnicu (T: 20-25°C, RH: 60-80% tokom 4h)'
      ],
      backwardChainingQueries: [
        'C1: Da li je Pepelnica verovatna? → DA (85%)',
        'C2: Da li je Biološki fungicid dozvoljen? → DA',
        'C3: Koji uslovi su doveli do rizika? → Optimalni uslovi za Erysiphe'
      ]
    },
    sivaTrulez: {
      title: '🫐 Scenario: Siva trulež (Botrytis cinerea)',
      description: 'Test scenario za sivu trulež sa visokom vlažnošću',
      environmentalConditions: {
        temperature: 18.0,
        humidity: 92.0,
        co2Level: 1200,
        ventilationActive: false
      },
      symptoms: [
        'Siva prevlaka na plodovima',
        'Meke trule mrlje',
        'Sporulacija gljivice'
      ],
      expectedDiagnosis: {
        disease: 'Siva trulež',
        probability: 90.0,
        confidence: 'Vrlo visoka'
      },
      recommendedTreatments: [
        {
          name: 'Uklanjanje zaraženih delova',
          type: 'SANITARY',
          dosage: 'Kompletno uklanjanje',
          withdrawalDays: 0,
          priority: 1
        },
        {
          name: 'Poboljšanje ventilacije',
          type: 'PREVENTIVE',
          dosage: 'Kontinuirano',
          withdrawalDays: 0,
          priority: 1
        }
      ],
      cepAlerts: [
        'E2: Rizik kondenzacije (RH>90% tokom 24h)',
        'E3: Rizik Botrytis nakon navodnjavanja'
      ],
      backwardChainingQueries: [
        'C1: Da li je Siva trulež verovatna? → DA (90%)',
        'C2: Da li su sanitarne mere dozvoljene? → DA',
        'C3: Koji uslovi su doveli do rizika? → Ekstremno visoka vlažnost'
      ]
    },
    fuzarijum: {
      title: '🍄 Scenario: Fuzarijum (Fusarium oxysporum)',
      description: 'Test scenario za fuzarijum sa uvenuće simptomima',
      environmentalConditions: {
        temperature: 28.0,
        humidity: 65.0,
        co2Level: 1000,
        ventilationActive: true,
        soilPH: 5.2
      },
      symptoms: [
        'Uvenuće biljaka',
        'Posmeđenje provodnih sudova',
        'Žutilo donjih listova'
      ],
      expectedDiagnosis: {
        disease: 'Fuzarijum',
        probability: 80.0,
        confidence: 'Visoka'
      },
      recommendedTreatments: [
        {
          name: 'Trichoderma',
          type: 'BIOLOGICAL',
          dosage: '10g/L',
          withdrawalDays: 0,
          priority: 2
        },
        {
          name: 'Korekcija pH',
          type: 'PREVENTIVE',
          dosage: 'pH 6.0-6.5',
          withdrawalDays: 0,
          priority: 1
        }
      ],
      cepAlerts: [
        'Nema specifičnih CEP alertova - dijagnoza na osnovu simptoma'
      ],
      backwardChainingQueries: [
        'C1: Da li je Fuzarijum veroatan? → DA (80%)',
        'C2: Da li je Trichoderma dozvoljena? → DA',
        'C3: Koji uslovi su doveli do rizika? → Nizak pH + visoka temperatura'
      ]
    },
    virus: {
      title: '🦠 Scenario: Virus mozaika (TMV)',
      description: 'Test scenario za virus mozaika',
      environmentalConditions: {
        temperature: 24.0,
        humidity: 60.0,
        co2Level: 850,
        ventilationActive: true
      },
      symptoms: [
        'Mozaik šare na listovima',
        'Deformacija listova',
        'Zaostajanje u rastu'
      ],
      expectedDiagnosis: {
        disease: 'Virus mozaika',
        probability: 70.0,
        confidence: 'Visoka'
      },
      recommendedTreatments: [
        {
          name: 'Uklanjanje zaraženih biljaka',
          type: 'SANITARY',
          dosage: 'Kompletno uklanjanje',
          withdrawalDays: 0,
          priority: 1
        },
        {
          name: 'Dezinfekcija alata',
          type: 'SANITARY',
          dosage: '70% alkohol',
          withdrawalDays: 0,
          priority: 1
        }
      ],
      cepAlerts: [
        'Nema specifičnih CEP alertova - dijagnoza na osnovu simptoma'
      ],
      backwardChainingQueries: [
        'C1: Da li je Virus mozaika veroatan? → DA (70%)',
        'C2: Da li su sanitarne mere dozvoljene? → DA',
        'C3: Koji uslovi su doveli do rizika? → Mehanička transmisija'
      ]
    }
  };

  const currentScenario = testScenarios[selectedScenario];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Kopirano u clipboard!');
    });
  };

  const generateCurlCommands = () => {
    const commands = [
      '# Forward Chaining testovi',
      'curl http://localhost:8080/api/diagnosis/test-plamenjaca',
      'curl http://localhost:8080/api/diagnosis/test-pepelnica',
      'curl http://localhost:8080/api/diagnosis/test-siva-trulez',
      'curl http://localhost:8080/api/diagnosis/test-fuzarijum',
      'curl http://localhost:8080/api/diagnosis/test-virus',
      '',
      '# Backward Chaining testovi',
      'curl http://localhost:8080/api/backward-chaining/test-high-probability-disease',
      'curl http://localhost:8080/api/backward-chaining/test-treatment-allowed-vegetative',
      'curl http://localhost:8080/api/backward-chaining/test-what-caused-plamenjaca',
      '',
      '# CEP testovi',
      'curl http://localhost:8080/api/cep/test-critical-conditions',
      'curl http://localhost:8080/api/cep/test-condensation-risk',
      'curl http://localhost:8080/api/cep/test-botrytis-risk',
      '',
      '# Sveobuhvatni testovi',
      'curl http://localhost:8080/api/diagnosis/test-all',
      'curl http://localhost:8080/api/backward-chaining/test-all-backward',
      'curl http://localhost:8080/api/cep/test-all-cep'
    ].join('\n');

    return commands;
  };

  return (
    <div>
      <div className="card">
        <h2>🧪 Testni podaci i scenariji</h2>
        <p>
          Strukturirani test scenariji za demonstraciju svih funkcionalnosti sistema.
          Svaki scenario sadrži kompletne podatke za testiranje Forward Chaining, Backward Chaining i CEP mehanizama.
        </p>
      </div>

      <div className="grid">
        <div className="card">
          <h3>📋 Dostupni scenariji</h3>
          <div className="form-group">
            <label>Izaberite test scenario:</label>
            <select 
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
            >
              <option value="plamenjaca">🍅 Plamenjača</option>
              <option value="pepelnica">🤍 Pepelnica</option>
              <option value="sivaTrulez">🫐 Siva trulež</option>
              <option value="fuzarijum">🍄 Fuzarijum</option>
              <option value="virus">🦠 Virus mozaika</option>
            </select>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h4>{currentScenario.title}</h4>
            <p style={{ fontStyle: 'italic', color: '#666' }}>
              {currentScenario.description}
            </p>
          </div>
        </div>

        <div className="card">
          <h3>🌡️ Uslovi sredine</h3>
          <div className="grid">
            {Object.entries(currentScenario.environmentalConditions).map(([key, value]) => (
              <div key={key} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span style={{ fontWeight: 'bold' }}>
                  {key === 'temperature' && '🌡️ Temperatura:'}
                  {key === 'humidity' && '💧 Vlažnost:'}
                  {key === 'co2Level' && '🌬️ CO₂:'}
                  {key === 'ventilationActive' && '💨 Ventilacija:'}
                  {key === 'soilPH' && '🧪 pH zemljišta:'}
                </span>
                <span>
                  {typeof value === 'boolean' ? (value ? 'Aktivna' : 'Neaktivna') : value}
                  {key === 'temperature' && '°C'}
                  {key === 'humidity' && '%'}
                  {key === 'co2Level' && ' ppm'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>🔍 Simptomi</h3>
          <ul style={{ paddingLeft: '20px' }}>
            {currentScenario.symptoms.map((symptom, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>
                {symptom}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>🎯 Očekivana dijagnoza</h3>
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            padding: '15px', 
            borderRadius: '8px',
            border: '2px solid #4CAF50'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>
              {currentScenario.expectedDiagnosis.disease}
            </div>
            <div>
              <strong>Verovatnoća:</strong> {currentScenario.expectedDiagnosis.probability}%
            </div>
            <div>
              <strong>Pouzdanost:</strong> {currentScenario.expectedDiagnosis.confidence}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>💊 Preporučeni tretmani</h3>
        <div className="grid">
          {currentScenario.recommendedTreatments.map((treatment, index) => (
            <div key={index} style={{ 
              backgroundColor: '#f0f8ff', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid #2196F3'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {treatment.name}
              </div>
              <div><strong>Tip:</strong> {treatment.type}</div>
              <div><strong>Doza:</strong> {treatment.dosage}</div>
              <div><strong>Karenca:</strong> {treatment.withdrawalDays} dana</div>
              <div><strong>Prioritet:</strong> {treatment.priority}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>⚡ CEP Alertovi</h3>
          <ul style={{ paddingLeft: '20px' }}>
            {currentScenario.cepAlerts.map((alert, index) => (
              <li key={index} style={{ 
                marginBottom: '8px',
                padding: '8px',
                backgroundColor: '#fff3cd',
                borderRadius: '4px',
                border: '1px solid #ffeaa7'
              }}>
                {alert}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>🔍 Backward Chaining upiti</h3>
          <ul style={{ paddingLeft: '20px' }}>
            {currentScenario.backwardChainingQueries.map((query, index) => (
              <li key={index} style={{ 
                marginBottom: '8px',
                padding: '8px',
                backgroundColor: '#e3f2fd',
                borderRadius: '4px',
                border: '1px solid #bbdefb'
              }}>
                {query}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <h3>🖥️ cURL komande za testiranje</h3>
        <p>Kopirajte i pokrenite ove komande u terminalu za testiranje backend API-ja:</p>
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '12px',
          whiteSpace: 'pre-wrap',
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid #ddd'
        }}>
          {generateCurlCommands()}
        </div>
        <button 
          className="btn" 
          onClick={() => copyToClipboard(generateCurlCommands())}
          style={{ marginTop: '10px' }}
        >
          📋 Kopiraj cURL komande
        </button>
      </div>

      <div className="card">
        <h3>📊 Statistike test podataka</h3>
        <div className="grid">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>5</div>
            <div>Test scenarija</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>15</div>
            <div>Forward Chaining testova</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>8</div>
            <div>Backward Chaining upita</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336' }}>6</div>
            <div>CEP obrazaca</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDataPage;