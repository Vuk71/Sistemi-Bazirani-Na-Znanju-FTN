import React, { useState, useEffect } from 'react';

// Komponenta za upravljanje sačuvanim biljkama
const SavedPlantsManager = ({ getAllPlants, loadPlant, deletePlant, deleteAllPlants, selectedPlant, exportPlants, importPlants }) => {
  const [plants, setPlants] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setPlants(getAllPlants());
  }, [refreshKey, getAllPlants]);

  const handleDelete = (plantId) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovu biljku?')) {
      deletePlant(plantId);
      setRefreshKey(prev => prev + 1); // Refresh listu
      alert('Biljka je obrisana');
    }
  };

  const handleLoad = (plant) => {
    loadPlant(plant);
    alert('Biljka je učitana i aktivirana!');
  };

  const handleDeleteAll = () => {
    deleteAllPlants();
    setRefreshKey(prev => prev + 1); // Refresh listu
  };

  if (plants.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
        <p>Nema sačuvanih biljaka</p>
        <small>Sačuvajte biljku da biste je videli ovde</small>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <span><strong>Ukupno sačuvanih biljaka:</strong> {plants.length}</span>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            className="btn btn-secondary"
            onClick={exportPlants}
            style={{ fontSize: '12px', padding: '5px 10px' }}
          >
            Export
          </button>
          <label className="btn btn-secondary" style={{ fontSize: '12px', padding: '5px 10px' }}>
            Import
            <input
              type="file"
              accept=".json"
              onChange={importPlants}
              style={{ display: 'none' }}
            />
          </label>
          <button
            className="btn btn-danger"
            onClick={handleDeleteAll}
            style={{ fontSize: '12px', padding: '5px 10px' }}
          >
            Obriši sve
          </button>
        </div>
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {plants.map((plant, index) => (
          <div
            key={plant.id}
            style={{
              backgroundColor: selectedPlant && selectedPlant.id === plant.id ? '#e8f5e8' : '#f8f9fa',
              border: selectedPlant && selectedPlant.id === plant.id ? '2px solid #4CAF50' : '1px solid #dee2e6',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {plant.cropType} ({plant.variety})
                  {selectedPlant && selectedPlant.id === plant.id && (
                    <span style={{
                      color: '#4CAF50',
                      fontSize: '12px',
                      marginLeft: '8px',
                      fontWeight: 'normal'
                    }}>
                      AKTIVNA
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  <div>Fenofaza: {plant.phenophase}</div>
                  <div>Lokacija: {plant.location}</div>
                  <div>Posađeno: {new Date(plant.plantedDate).toLocaleDateString('sr-RS')}</div>
                  <div>Uslovi: {plant.currentConditions.temperature}°C, {plant.currentConditions.humidity}%</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleLoad(plant)}
                  disabled={selectedPlant && selectedPlant.id === plant.id}
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  {selectedPlant && selectedPlant.id === plant.id ? 'Aktivna' : 'Učitaj'}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(plant.id)}
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  Obriši
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
    // Trenutni simptomi
    symptoms: {
      vodenasteLezioni: false,
      belePrevlake: false,
      sivaPrevlaka: false,
      zutilo: false,
      uvenuće: false,
      mozaikSare: false,
      tamneMarlje: false,
      posmeđenjeZila: false
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

      // Dodaj simptome ako ne postoje (za kompatibilnost sa starim podacima)
      if (!parsedPlant.symptoms) {
        parsedPlant.symptoms = {
          vodenasteLezioni: false,
          belePrevlake: false,
          sivaPrevlaka: false,
          zutilo: false,
          uvenuće: false,
          mozaikSare: false,
          tamneMarlje: false,
          posmeđenjeZila: false
        };
      }

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
    } else if (field.startsWith('symptoms.')) {
      const symptomField = field.split('.')[1];
      setPlantData(prev => ({
        ...prev,
        symptoms: {
          ...(prev.symptoms || {}),
          [symptomField]: value
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
    // Dodaj simptome ako ne postoje (za kompatibilnost sa starim podacima)
    if (!plant.symptoms) {
      plant.symptoms = {
        vodenasteLezioni: false,
        belePrevlake: false,
        sivaPrevlaka: false,
        zutilo: false,
        uvenuće: false,
        mozaikSare: false,
        tamneMarlje: false,
        posmeđenjeZila: false
      };
    }

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

  const deletePlant = (plantId) => {
    const allPlants = getAllPlants();
    const updatedPlants = allPlants.filter(p => p.id !== plantId);
    localStorage.setItem('allPlants', JSON.stringify(updatedPlants));

    // Ako je obrisana aktivna biljka, ukloni je iz aktivnih
    if (selectedPlant && selectedPlant.id === plantId) {
      clearPlant();
    }

    return updatedPlants;
  };

  const deleteAllPlants = () => {
    if (window.confirm('Da li ste sigurni da želite da obrišete sve sačuvane biljke?')) {
      localStorage.removeItem('allPlants');
      clearPlant();
      alert('Sve sačuvane biljke su obrisane');
    }
  };

  const exportPlants = () => {
    const allPlants = getAllPlants();
    if (allPlants.length === 0) {
      alert('Nema biljaka za export');
      return;
    }

    const dataStr = JSON.stringify(allPlants, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `biljke_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const importPlants = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedPlants = JSON.parse(e.target.result);
        if (!Array.isArray(importedPlants)) {
          throw new Error('Nevaljan format fajla');
        }

        const existingPlants = getAllPlants();
        const mergedPlants = [...existingPlants, ...importedPlants];

        localStorage.setItem('allPlants', JSON.stringify(mergedPlants));
        alert(`Uspešno importovano ${importedPlants.length} biljaka`);

        // Reset file input
        event.target.value = '';
      } catch (error) {
        alert('Greška pri importu: ' + error.message);
      }
    };
    reader.readAsText(file);
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
        <br />

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
          <h3>Podaci o biljci</h3>
          <br />

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
          <br />

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

        {/* Simptomi na biljci */}
        <div className="card">
          <h3>Trenutni simptomi</h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
            Označite simptome koje uočavate na biljci. Ovi simptomi će se koristiti u svim analizama.
          </p>

          <div className="grid">
            {Object.entries({
              vodenasteLezioni: 'Vodenaste lezije na listovima',
              belePrevlake: 'Bele praškaste naslage',
              sivaPrevlaka: 'Siva prevlaka na plodovima',
              zutilo: 'Žutilo listova',
              uvenuće: 'Uvenuće biljaka',
              mozaikSare: 'Mozaik šare na listovima',
              tamneMarlje: 'Tamne mrlje na plodovima',
              posmeđenjeZila: 'Posmeđenje provodnih žila'
            }).map(([key, label]) => (
              <div key={key} style={{ marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={plantData.symptoms && plantData.symptoms[key]}
                    onChange={(e) => handleInputChange(`symptoms.${key}`, e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontSize: '14px' }}>{label}</span>
                </label>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Akcije */}
      <div className="card">
        <h3>Akcije</h3>
        <br />
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
                alert('Biljka je učitana!');
              }
            }}
          >
            Učitaj sačuvanu biljku
          </button>
        </div>
      </div>

      {/* Upravljanje sačuvanim biljkama */}
      <div className="card">
        <h3>Sačuvane biljke</h3>
        <SavedPlantsManager
          getAllPlants={getAllPlants}
          loadPlant={loadPlant}
          deletePlant={deletePlant}
          deleteAllPlants={deleteAllPlants}
          selectedPlant={selectedPlant}
          exportPlants={exportPlants}
          importPlants={importPlants}
        />
      </div>

      {/* Pregled aktivne biljke */}
      {selectedPlant && (
        <div className="card">
          <h3> Pregled aktivne biljke</h3>
          <br />
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

            <div>
              <h4> Trenutni simptomi</h4>
              {selectedPlant.symptoms && Object.entries(selectedPlant.symptoms).some(([key, value]) => value) ? (
                <div>
                  {Object.entries({
                    vodenasteLezioni: 'Vodenaste lezije na listovima',
                    belePrevlake: 'Bele praškaste naslage',
                    sivaPrevlaka: 'Siva prevlaka na plodovima',
                    zutilo: 'Žutilo listova',
                    uvenuće: 'Uvenuće biljaka',
                    mozaikSare: 'Mozaik šare na listovima',
                    tamneMarlje: 'Tamne mrlje na plodovima',
                    posmeđenjeZila: 'Posmeđenje provodnih žila'
                  }).map(([key, label]) =>
                    selectedPlant.symptoms && selectedPlant.symptoms[key] && (
                      <div key={key} style={{ fontSize: '13px', marginBottom: '3px' }}>
                        • {label}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                  Nema označenih simptoma
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default VegetationPage;