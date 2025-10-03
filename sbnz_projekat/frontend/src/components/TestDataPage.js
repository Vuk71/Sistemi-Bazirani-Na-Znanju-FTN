import React, { useState } from 'react';

const TestDataPage = () => {
  const [selectedScenario, setSelectedScenario] = useState('plamenjaca');

  const testScenarios = {
    plamenjaca: {
      title: ' Scenario: Plamenjača (Phytophthora infestans)',
      description: 'Kompletan test scenario za dijagnostiku i tretman plamenjače',
      requiredPlant: {
        cropType: 'Paradajz',
        variety: 'San Marzano',
        phenophase: 'VEGETATIVE',
        location: 'Plastenik 1'
      },
      environmentalConditions: {
        temperature: 25.0,
        humidity: 87.0,
        co2Level: 800,
        ventilationActive: false
      },
      symptoms: [
        'Vodenaste lezije na listovima',
        'Tamne mrlje na plodovima'
      ],
      availableSymptoms: {
        vodenasteLezioni: true,
        tamneMarlje: true,
        belePrevlake: false,
        sivaPrevlaka: false,
        zutilo: false,
        uvenuće: false,
        mozaikSare: false,
        posmeđenjeZila: false
      },
      expectedDiagnosis: {
        disease: 'Plamenjača',
        probability: 95.0,
        confidence: 'Vrlo visoka'
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
        'E1: Kritični uslovi za plamenjaču (SLIDING WINDOW)',
        'E4: Alarm ventilacije (TEMPORALNI NOT)',
        'E6: Rastući trend vlažnosti (TEMPORALNI BEFORE)'
      ],
      backwardChainingQueries: [
        'C1: Da li je Plamenjača verovatna? → DA (verovatnoća ≥ 50%)',
        'C2: Da li je Bakarni preparat dozvoljen u vegetativnoj fazi? → DA',
        'C3: Koji uslovi su doveli do rizika Plamenjače? → GET /api/backward-chaining/test-what-caused-plamenjaca'
      ]
    },
    pepelnica: {
      title: ' Scenario: Pepelnica (Erysiphe cichoracearum)',
      description: 'Test scenario za pepelnicu sa stabilnim uslovima',
      requiredPlant: {
        cropType: 'Krastavac',
        variety: 'Marketmore',
        phenophase: 'FLOWERING',
        location: 'Plastenik 2'
      },
      environmentalConditions: {
        temperature: 22.0,
        humidity: 70.0,
        co2Level: 900,
        ventilationActive: true
      },
      symptoms: [
        'Bele praškaste naslage',
        'Žutilo listova'
      ],
      availableSymptoms: {
        belePrevlake: true,
        zutilo: true,
        vodenasteLezioni: false,
        tamneMarlje: false,
        sivaPrevlaka: false,
        uvenuće: false,
        mozaikSare: false,
        posmeđenjeZila: false
      },
      expectedDiagnosis: {
        disease: 'Pepelnica',
        probability: 55.0,
        confidence: 'Umerena'
      },
      recommendedTreatments: [
        {
          name: 'Trichoderma',
          type: 'BIOLOGICAL',
          dosage: '5g/L',
          withdrawalDays: 0,
          priority: 2
        },
        {
          name: 'Biološki fungicid',
          type: 'BIOLOGICAL',
          dosage: '1-2g/L',
          withdrawalDays: 0,
          priority: 2
        }
      ],
      cepAlerts: [
        'E5: Optimalni uslovi za pepelnicu (TEMPORALNI DURING)'
      ],
      backwardChainingQueries: [
        'C1: Da li je Pepelnica verovatna? → DA (verovatnoća ≥ 50%)',
        'C2: Da li je Biološki fungicid dozvoljen? → DA',
        'C3: Koji uslovi su doveli do rizika Pepelnice? → GET /api/backward-chaining/test-what-caused-pepelnica'
      ]
    },
    sivaTrulez: {
      title: ' Scenario: Siva trulež (Botrytis cinerea)',
      description: 'Test scenario za sivu trulež sa visokom vlažnošću',
      requiredPlant: {
        cropType: 'Paprika',
        variety: 'California Wonder',
        phenophase: 'FRUITING',
        location: 'Plastenik 3'
      },
      environmentalConditions: {
        temperature: 18.0,
        humidity: 92.0,
        co2Level: 1200,
        ventilationActive: false
      },
      symptoms: [
        'Siva prevlaka na plodovima'
      ],
      availableSymptoms: {
        sivaPrevlaka: true,
        vodenasteLezioni: false,
        tamneMarlje: false,
        belePrevlake: false,
        zutilo: false,
        uvenuće: false,
        mozaikSare: false,
        posmeđenjeZila: false
      },
      expectedDiagnoses: [
        {
          disease: 'Plamenjača',
          probability: 64.3,
          confidence: 'Umerena',
          primary: true
        },
        {
          disease: 'Siva trulež',
          probability: 35.7,
          confidence: 'Niska',
          primary: false
        }
      ],
      recommendedTreatments: [
        {
          name: 'Biološki fungicid',
          type: 'BIOLOGICAL',
          dosage: '1-2g/L',
          withdrawalDays: 0,
          priority: 2
        },
        {
          name: 'Uklanjanje zaraženih biljaka',
          type: 'SANITARY',
          dosage: 'Ručno',
          withdrawalDays: 0,
          priority: 1
        },
        {
          name: 'Bakarni preparat',
          type: 'CHEMICAL',
          dosage: '2-3g/L',
          withdrawalDays: 14,
          priority: 3
        }
      ],
      cepAlerts: [
        'E2: Rizik kondenzacije - Siva trulež (TUMBLING WINDOW)',
        'E1: Kritični uslovi za plamenjaču (SLIDING WINDOW)',
        'E4: Alarm ventilacije (TEMPORALNI NOT)',
        'E3: Rizik Botrytis nakon navodnjavanja (SEKVENCIJALNI)',
        'E6: Rastući trend vlažnosti (TEMPORALNI BEFORE)'
      ],
      backwardChainingQueries: [
        'C1: Da li je Siva trulež verovatna? → NE (verovatnoća 35.7% < 50%)',
        'C1: Da li je Plamenjača verovatna? → DA (verovatnoća 64.3% ≥ 50%)',
        'C2: Da li su sanitarne mere dozvoljene? → DA',
        'C2: Da li je Bakarni preparat dozvoljen u FRUITING? → NE (blokiran)'
      ]
    },
    fuzarijum: {
      title: ' Scenario: Fuzarijum (Fusarium oxysporum)',
      description: 'Test scenario za fuzarijum sa uvenuće simptomima',
      requiredPlant: {
        cropType: 'Paradajz',
        variety: 'Cherokee Purple',
        phenophase: 'VEGETATIVE',
        location: 'Plastenik 4'
      },
      environmentalConditions: {
        temperature: 28.0,
        humidity: 65.0,
        co2Level: 1000,
        ventilationActive: true,
        soilPH: 5.2
      },
      symptoms: [
        'Uvenuće biljaka',
        'Posmeđenje provodnih žila',
        'Žutilo listova'
      ],
      availableSymptoms: {
        uvenuće: true,
        posmeđenjeZila: true,
        zutilo: true,
        vodenasteLezioni: false,
        tamneMarlje: false,
        belePrevlake: false,
        sivaPrevlaka: false,
        mozaikSare: false
      },
      expectedDiagnosis: {
        disease: 'Fuzarijum',
        probability: 45.0,
        confidence: 'Umerena'
      },
      recommendedTreatments: [
        {
          name: 'Trichoderma',
          type: 'BIOLOGICAL',
          dosage: '5g/L',
          withdrawalDays: 0,
          priority: 2
        }
      ],
      cepAlerts: [
        'Nema CEP alertova - dijagnoza na osnovu simptoma'
      ],
      backwardChainingQueries: [
        'C1: Da li je Fuzarijum veroatan? → NE (verovatnoća 45% < 50%)',
        'C2: Da li je Trichoderma dozvoljena? → DA'
      ]
    },
    virus: {
      title: ' Scenario: Virus mozaika (TMV)',
      description: 'Test scenario za virus mozaika',
      requiredPlant: {
        cropType: 'Salata',
        variety: 'Burley',
        phenophase: 'VEGETATIVE',
        location: 'Plastenik 5'
      },
      environmentalConditions: {
        temperature: 24.0,
        humidity: 60.0,
        co2Level: 850,
        ventilationActive: true
      },
      symptoms: [
        'Mozaik šare na listovima'
      ],
      availableSymptoms: {
        mozaikSare: true,
        vodenasteLezioni: false,
        tamneMarlje: false,
        belePrevlake: false,
        sivaPrevlaka: false,
        zutilo: false,
        uvenuće: false,
        posmeđenjeZila: false
      },
      expectedDiagnosis: {
        disease: 'Virus mozaika',
        probability: 60.0,
        confidence: 'Umerena'
      },
      recommendedTreatments: [
        {
          name: 'Dezinfekcija alata',
          type: 'SANITARY',
          dosage: '70% alkohol',
          withdrawalDays: 0,
          priority: 1
        },
        {
          name: 'Uklanjanje zaraženih biljaka',
          type: 'SANITARY',
          dosage: 'Ručno',
          withdrawalDays: 0,
          priority: 1
        }
      ],
      cepAlerts: [
        'Nema CEP alertova - dijagnoza na osnovu simptoma'
      ],
      backwardChainingQueries: [
        'C1: Da li je Virus mozaika veroatan? → DA (verovatnoća ≥ 50%)',
        'C2: Da li su sanitarne mere dozvoljene? → DA'
      ]
    }
  };

  const currentScenario = testScenarios[selectedScenario];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Kopirano u clipboard!');
    });
  };

  const createPlantForScenario = () => {
    const scenario = currentScenario;
    const plantData = {
      ...scenario.requiredPlant,
      plantedDate: '2024-02-01',
      area: 100,
      currentConditions: {
        ...scenario.environmentalConditions,
        lastUpdated: new Date().toISOString()
      },
      symptoms: {
        ...scenario.availableSymptoms
      },
      history: {
        diseases: [],
        treatments: [],
        yields: []
      },
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    // Sačuvaj kao aktivnu biljku
    localStorage.setItem('selectedPlant', JSON.stringify(plantData));

    // Dodaj u listu svih biljaka
    const allPlants = JSON.parse(localStorage.getItem('allPlants') || '[]');
    allPlants.push(plantData);
    localStorage.setItem('allPlants', JSON.stringify(allPlants));

    alert(`Biljka za scenario "${scenario.title}" je kreirana i aktivirana sa svim potrebnim simptomima!`);
  };

  const copySymptomSettings = () => {
    const symptoms = currentScenario.availableSymptoms;
    const settingsText = Object.entries(symptoms)
      .filter(([key, value]) => value)
      .map(([key, value]) => {
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
        return `✓ ${symptomLabels[key]}`;
      })
      .join('\n');

    copyToClipboard(`Simptomi za označavanje u Forward Chaining:\n\n${settingsText}`);
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
        <h2> Testni podaci i scenariji</h2>
        <p>
          Strukturirani test scenariji za demonstraciju svih funkcionalnosti sistema.
          Svaki scenario sadrži kompletne podatke za testiranje Forward Chaining, Backward Chaining i CEP mehanizama.
        </p>
      </div>

      <div className="grid">
        <div className="card">
          <h3> Dostupni scenariji</h3>
          <div className="alert alert-info" style={{ marginBottom: '15px' }}>
            <strong>Napomena:</strong> Za svaki scenario potrebno je da definisati odgovarajuću biljku u sekciji "Vegetacija"
            pre pokretanja testova. Detalji o potrebnoj vegetaciji su prikazani pored.
          </div>
          <div className="form-group">
            <label>Izaberite test scenario:</label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
            >
              <option value="plamenjaca"> Plamenjača</option>
              <option value="pepelnica"> Pepelnica</option>
              <option value="sivaTrulez"> Siva trulež</option>
              <option value="fuzarijum"> Fuzarijum</option>
              <option value="virus"> Virus mozaika</option>
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
          <h3> Potrebna vegetacija</h3>
          <br/>
          <div style={{
            backgroundColor: '#e8f5e8',
            padding: '15px',
            borderRadius: '8px',
            border: '2px solid #4CAF50',
            marginBottom: '15px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#2e7d32' }}>
              Definiši sledeću biljku u sekciji "Vegetacija":
            </div>
            <div className="grid" style={{ gap: '10px' }}>
              <div><strong>Kultura:</strong> {currentScenario.requiredPlant.cropType}</div>
              <div><strong>Sorta:</strong> {currentScenario.requiredPlant.variety}</div>
              <div><strong>Fenofaza:</strong> {currentScenario.requiredPlant.phenophase}</div>
              <div><strong>Lokacija:</strong> {currentScenario.requiredPlant.location}</div>
            </div>
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                className="btn"
                onClick={createPlantForScenario}
                style={{ fontSize: '14px', padding: '8px 16px' }}
              >
                Kreiraj biljku za ovaj scenario
              </button>
              <span style={{ fontSize: '13px', color: '#666' }}>
                ili ručno unesi podatke u sekciji "Vegetacija"
              </span>
            </div>
          </div>

          <h4> Uslovi sredine</h4>
          <br/>
          <div className="grid">
            {Object.entries(currentScenario.environmentalConditions).map(([key, value]) => (
              <div key={key} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span style={{ fontWeight: 'bold' }}>
                  {key === 'temperature' && ' Temperatura:'}
                  {key === 'humidity' && ' Vlažnost:'}
                  {key === 'co2Level' && ' CO₂:'}
                  {key === 'ventilationActive' && ' Ventilacija:'}
                  {key === 'soilPH' && ' pH zemljišta:'}
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
          <h3> Simptomi biljke</h3>
          <br/>

          <div style={{ marginBottom: '15px' }}>
            <ul style={{ paddingLeft: '20px' }}>
              {currentScenario.symptoms.map((symptom, index) => (
                <li key={index} style={{
                  marginBottom: '8px',
                  padding: '5px',
                  backgroundColor: '#e8f5e8',
                  borderRadius: '4px',
                  listStyle: 'none',
                  position: 'relative',
                  paddingLeft: '25px'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '5px',
                    color: '#4CAF50',
                    fontWeight: 'bold'
                  }}>✓</span>
                  {symptom}
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="card">
          <h3> Očekivana dijagnoza</h3>
          <br/>
          
          {/* Prikaz za jednu dijagnozu */}
          {currentScenario.expectedDiagnosis && (
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
          )}
          
          {/* Prikaz za više dijagnoza */}
          {currentScenario.expectedDiagnoses && (
            <div>
              <div className="alert alert-info" style={{ marginBottom: '15px' }}>
                <strong>Napomena:</strong> Ovaj scenario generiše više dijagnoza. Sistem će prikazati sve dijagnoze sa verovatnoćom ≥ 30%.
              </div>
              
              {currentScenario.expectedDiagnoses.map((diagnosis, index) => (
                <div key={index} style={{ 
                  backgroundColor: diagnosis.primary ? '#e8f5e8' : '#fff3e0', 
                  padding: '15px', 
                  borderRadius: '8px',
                  border: `2px solid ${diagnosis.primary ? '#4CAF50' : '#FF9800'}`,
                  marginBottom: '10px'
                }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    fontSize: '18px', 
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{diagnosis.disease}</span>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: 'normal',
                      color: diagnosis.primary ? '#2e7d32' : '#f57c00'
                    }}>
                      {diagnosis.primary ? 'GLAVNA DIJAGNOZA' : 'SEKUNDARNA DIJAGNOZA'}
                    </span>
                  </div>
                  <div>
                    <strong>Verovatnoća:</strong> {diagnosis.probability}%
                  </div>
                  <div>
                    <strong>Pouzdanost:</strong> {diagnosis.confidence}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3> Preporučeni tretmani</h3>
        <br/>

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
      
      </div>

    </div>
  );
};


export default TestDataPage;
