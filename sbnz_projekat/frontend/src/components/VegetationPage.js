import React, { useState, useEffect } from 'react';

const VegetationPage = () => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [plantData, setPlantData] = useState({
    cropType: 'Paradajz',
    variety: 'Cherry',
    phenophase: 'VEGETATIVE',
    plantedDate: '2024-02-01',
    location: 'Plastenik 1',
    area: 100,
    // Trenutni uslovi
    currentConditions: {
      temperature: 25.0,
      humidity: 87.0,
      co2Level: 800,
      ventilationActive: false,
      lastUpdated: new Date().toISOString()
    },
    // Istorija
    history: {
      diseases: [],
      treatments: [],
      yields: []
    }
  });

  // Učitaj iz localStorage pri pokretanju
  useEffect(() => {
    const saved = localStorage.getItem('selectedPlant');
    if (saved) {
      const parsedPlant = JSON.parse(saved);
      setSelectedPlant(parsedPlant);
      setPlantData(parsedPlant);
    }
  }, []);

  const handleInputChange = (field, value) => {
    if (field.startsWith('currentConditions.')) {
      const conditionField = field.split('.')[1];
      setPlantData(prev => ({
        ...prev,
        currentConditions: {
          ...prev.currentConditions,
          [conditionField]: value,
          lastUpdated: new Date().toISOString()
        }
      }));
    } else {
      setPlantData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const savePlant = () => {
    const plantWithId = {
      ...plantData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setSelectedPlant(plantWithId);
    localStorage.setItem('selectedPlant', JSON.stringify(plantWithId));
    
    // Takođe sačuvaj u listu svih biljaka
    const allPlants = JSON.parse(localStorage.getItem('allPlants') || '[]');
    const existingIndex = allPlants.findIndex(p => p.id === plantWithId.id);
    
    if (existingIndex >= 0) {
      allPlants[existingIndex] = plantWithId;
    } else {
      allPlants.push(plantWithId);
    }
    
    localStorage.setItem('allPlants', JSON.stringify(allPlants));
    
    alert(' Biljka je sačuvana i aktivna za sve analize!');
  };

  const loadPlant = (plant) => {
    setSelectedPlant(plant);
    setPlantData(plant);
    localStorage.setItem('selectedPlant', JSON.stringify(plant));
  };

  const clearPlant = () => {
    setSelectedPlant(null);
    localStorage.removeItem('selectedPlant');
    alert(' Aktivna biljka je uklonjena');
  };

  const getAllPlants = () => {
    return JSON.parse(localStorage.getItem('allPlants') || '[]');
  };

  const cropTypes = [
    { value: 'Paradajz', label: 'Paradajz (Solanum lycopersicum)' },
    { value: 'Krastavac', label: 'Krastavac (Cucumis sativus)' },
    { value: 'Paprika', label: 'Paprika (Capsicum annuum)' },
    { value: 'Patlidžan', label: 'Patlidžan (Solanum melongena)' },
    { value: 'Salata', label: 'Salata (Lactuca sativa)' }
  ];

  const phenophases = [
    { value: 'VEGETATIVE', label: 'Vegetativni rast', description: 'Rast listova i stabla' },
    { value: 'FLOWERING', label: 'Cvetanje', description: 'Formiranje cvetova' },
    { value: 'FRUITING', label: 'Plodonošenje', description: 'Razvoj i sazrevanje plodova' }
  ];

  return (
    <div>
      <div className="card">
        <h2> Upravljanje vegetacijom</h2>
        <p>
          Definiši biljku koja će se koristiti za sve analize u sistemu (Forward Chaining, Backward Chaining, CEP).
          Ova biljka će biti aktivna za sve dijagnostike i upite.
        </p>
        <br/>
        
        {selectedPlant && (
          <div className="alert alert-success">
            <strong> Aktivna biljka:</strong> {selectedPlant.cropType} ({selectedPlant.variety}) - {selectedPlant.phenophase}
            <button 
              className="btn btn-danger" 
              onClick={clearPlant}
              style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '12px' }}
            >
               Ukloni
            </button>
          </div>
        )}
      </div>

      <div className="grid">
        {/* Forma za unos biljke */}
        <div className="card">
          <h3>🌿 Podaci o biljci</h3>
          
          <div className="form-group">
            <label>Tip kulture:</label>
            <select 
              value={plantData.cropType}
              onChange={(e) => handleInputChange('cropType', e.target.value)}
            >
              {cropTypes.map(crop => (
                <option key={crop.value} value={crop.value}>
                  {crop.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sorta:</label>
            <input 
              type="text"
              value={plantData.variety}
              onChange={(e) => handleInputChange('variety', e.target.value)}
              placeholder="npr. Cherry, Salad, Sweet..."
            />
          </div>

          <div className="form-group">
            <label>Fenofaza:</label>
            <select 
              value={plantData.phenophase}
              onChange={(e) => handleInputChange('phenophase', e.target.value)}
            >
              {phenophases.map(phase => (
                <option key={phase.value} value={phase.value}>
                  {phase.label}
                </option>
              ))}
            </select>
            <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              {phenophases.find(p => p.value === plantData.phenophase)?.description}
            </small>
          </div>

          <div className="form-group">
            <label>Datum sadnje:</label>
            <input 
              type="date"
              value={plantData.plantedDate}
              onChange={(e) => handleInputChange('plantedDate', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Lokacija:</label>
            <input 
              type="text"
              value={plantData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="npr. Plastenik 1, Sektor A..."
            />
          </div>

          <div className="form-group">
            <label>Površina (m²):</label>
            <input 
              type="number"
              value={plantData.area}
              onChange={(e) => handleInputChange('area', parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Trenutni uslovi */}
        <div className="card">
          <h3> Trenutni uslovi sredine</h3>
          
          <div className="form-group">
            <label>Temperatura (°C):</label>
            <input 
              type="number"
              step="0.1"
              value={plantData.currentConditions.temperature}
              onChange={(e) => handleInputChange('currentConditions.temperature', parseFloat(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Vlažnost (%):</label>
            <input 
              type="number"
              step="0.1"
              value={plantData.currentConditions.humidity}
              onChange={(e) => handleInputChange('currentConditions.humidity', parseFloat(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>CO₂ nivo (ppm):</label>
            <input 
              type="number"
              value={plantData.currentConditions.co2Level}
              onChange={(e) => handleInputChange('currentConditions.co2Level', parseInt(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox"
                checked={plantData.currentConditions.ventilationActive}
                onChange={(e) => handleInputChange('currentConditions.ventilationActive', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Ventilacija aktivna
            </label>
          </div>

          <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Poslednje ažuriranje: {new Date(plantData.currentConditions.lastUpdated).toLocaleString('sr-RS')}
          </div>
        </div>
      </div>

      {/* Akcije */}
      <div className="card">
        <h3>Akcije</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn" 
            onClick={savePlant}
            style={{ fontSize: '16px', padding: '12px 20px' }}
          >
            Sačuvaj i aktiviraj biljku
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              const allPlants = getAllPlants();
              if (allPlants.length === 0) {
                alert('Nema sačuvanih biljaka');
                return;
              }
              
              const plantList = allPlants.map((p, i) => 
                `${i + 1}. ${p.cropType} (${p.variety}) - ${p.phenophase}`
              ).join('\n');
              
              const choice = prompt(`Izaberite biljku (unesite broj):\n${plantList}`);
              const index = parseInt(choice) - 1;
              
              if (index >= 0 && index < allPlants.length) {
                loadPlant(allPlants[index]);
                alert(' Biljka je učitana!');
              }
            }}
          >
            Učitaj sačuvanu biljku
          </button>
        </div>
      </div>

      {/* Pregled aktivne biljke */}
      {selectedPlant && (
        <div className="card">
          <h3> Pregled aktivne biljke</h3>
          <div className="grid">
            <div>
              <h4> Osnovni podaci</h4>
              <div><strong>Kultura:</strong> {selectedPlant.cropType}</div>
              <div><strong>Sorta:</strong> {selectedPlant.variety}</div>
              <div><strong>Fenofaza:</strong> {selectedPlant.phenophase}</div>
              <div><strong>Posađeno:</strong> {new Date(selectedPlant.plantedDate).toLocaleDateString('sr-RS')}</div>
              <div><strong>Lokacija:</strong> {selectedPlant.location}</div>
              <div><strong>Površina:</strong> {selectedPlant.area} m²</div>
            </div>
            
            <div>
              <h4> Trenutni uslovi</h4>
              <div><strong>Temperatura:</strong> {selectedPlant.currentConditions.temperature}°C</div>
              <div><strong>Vlažnost:</strong> {selectedPlant.currentConditions.humidity}%</div>
              <div><strong>CO₂:</strong> {selectedPlant.currentConditions.co2Level} ppm</div>
              <div><strong>Ventilacija:</strong> {selectedPlant.currentConditions.ventilationActive ? ' Aktivna' : ' Neaktivna'}</div>
            </div>
          </div>
          
          <div className="alert alert-info" style={{ marginTop: '15px' }}>
            <strong> Napomena:</strong> Ova biljka će se koristiti za sve analize u Forward Chaining, Backward Chaining i CEP sekcijama.
          </div>
        </div>
      )}

    </div>
  );
};

export default VegetationPage;