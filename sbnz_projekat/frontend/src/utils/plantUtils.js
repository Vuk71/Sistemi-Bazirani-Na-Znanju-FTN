// Utility funkcije za rad sa aktivnom biljkom

export const getActivePlant = () => {
  const saved = localStorage.getItem('selectedPlant');
  return saved ? JSON.parse(saved) : null;
};

export const hasActivePlant = () => {
  return getActivePlant() !== null;
};

export const getPlantBasicInfo = () => {
  const plant = getActivePlant();
  if (!plant) return null;
  
  return {
    cropType: plant.cropType,
    variety: plant.variety,
    phenophase: plant.phenophase,
    plantedDate: plant.plantedDate,
    location: plant.location
  };
};

export const getPlantConditions = () => {
  const plant = getActivePlant();
  if (!plant) return null;
  
  return plant.currentConditions;
};

export const updatePlantConditions = (newConditions) => {
  const plant = getActivePlant();
  if (!plant) return false;
  
  const updatedPlant = {
    ...plant,
    currentConditions: {
      ...plant.currentConditions,
      ...newConditions,
      lastUpdated: new Date().toISOString()
    }
  };
  
  localStorage.setItem('selectedPlant', JSON.stringify(updatedPlant));
  return true;
};

export const getPlantDisplayName = () => {
  const plant = getActivePlant();
  if (!plant) return 'Nema aktivne biljke';
  
  return `${plant.cropType} (${plant.variety}) - ${plant.phenophase}`;
};