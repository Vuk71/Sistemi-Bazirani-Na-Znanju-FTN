import React, { useState, useEffect } from 'react';
import { diagnosisAPI, backwardChainingAPI, cepAPI } from '../services/api';
import { getActivePlant, hasActivePlant, getPlantDisplayName } from '../utils/plantUtils';

const Dashboard = () => {
  const [systemStatus, setSystemStatus] = useState({
    backend: 'checking',
    forwardChaining: 'checking',
    backwardChaining: 'checking',
    cep: 'checking'
  });

  const [quickStats, setQuickStats] = useState({
    totalTests: 0,
    successfulTests: 0,
    failedTests: 0
  });

  const [activePlant, setActivePlant] = useState(null);

  useEffect(() => {
    checkSystemStatus();
    setActivePlant(getActivePlant());
  }, []);

  const checkSystemStatus = async () => {
    const checks = [
      { name: 'forwardChaining', api: diagnosisAPI.demo },
      { name: 'backwardChaining', api: backwardChainingAPI.demo },
      { name: 'cep', api: cepAPI.demo }
    ];

    let successful = 0;
    let failed = 0;

    for (const check of checks) {
      try {
        await check.api();
        setSystemStatus(prev => ({ ...prev, [check.name]: 'online' }));
        successful++;
      } catch (error) {
        setSystemStatus(prev => ({ ...prev, [check.name]: 'offline' }));
        failed++;
      }
    }

    setSystemStatus(prev => ({ 
      ...prev, 
      backend: successful > 0 ? 'online' : 'offline' 
    }));

    setQuickStats({
      totalTests: successful + failed,
      successfulTests: successful,
      failedTests: failed
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'offline': return '#f44336';
      case 'checking': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'checking': return 'Proverava...';
      default: return 'Nepoznato';
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Pregled sistema</h2>
      </div>

      <div className="grid">
        <div className="card">
          <h3> Status sistema</h3>
          <div style={{ marginTop: '20px' }}>
            {Object.entries(systemStatus).map(([component, status]) => (
              <div key={component} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span style={{ fontWeight: 'bold' }}>
                  {component === 'backend' && ' Backend'}
                  {component === 'forwardChaining' && ' Forward Chaining'}
                  {component === 'backwardChaining' && ' Backward Chaining'}
                  {component === 'cep' && ' CEP'}
                </span>
                <span style={{ 
                  color: getStatusColor(status),
                  fontWeight: 'bold'
                }}>
                  {getStatusText(status)}
                </span>
              </div>
            ))}
          </div>
          <button 
            className="btn" 
            onClick={checkSystemStatus}
            style={{ marginTop: '15px', width: '100%' }}
          >
             Osvezi status
          </button>
        </div>

        <div className="card">
          <h3> Aktivna biljka</h3>
          {!hasActivePlant() ? (
            <div style={{ marginTop: '20px' }}>
              <div className="alert alert-warning">
                <strong> Nema aktivne biljke</strong>
                <br />
                Definiši biljku da bi mogao da koristiš Forward Chaining, Backward Chaining i CEP.
              </div>
              <button 
                className="btn" 
                onClick={() => window.location.href = '/vegetation'}
                style={{ width: '100%', marginTop: '10px' }}
              >
                 Definiši biljku
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '20px' }}>
              <div className="alert alert-success">
                <strong> {getPlantDisplayName()}</strong>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span>Lokacija:</span>
                <span style={{ fontWeight: 'bold' }}>{activePlant?.location}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span>Temperatura:</span>
                <span style={{ fontWeight: 'bold', color: '#ff9800' }}>
                  {activePlant?.currentConditions.temperature}°C
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '10px 0'
              }}>
                <span>Vlažnost:</span>
                <span style={{ fontWeight: 'bold', color: '#2196F3' }}>
                  {activePlant?.currentConditions.humidity}%
                </span>
              </div>
              <button 
                className="btn btn-secondary" 
                onClick={() => window.location.href = '/vegetation'}
                style={{ width: '100%', marginTop: '10px' }}
              >
                 Upravljaj biljkom
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h3> Podržane bolesti</h3>
          <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
            <li> Plamenjača (Phytophthora infestans)</li><br/>
            <li> Pepelnica (Erysiphe cichoracearum)</li><br/>
            <li> Siva trulež (Botrytis cinerea)</li><br/>
            <li> Fuzarijum (Fusarium oxysporum)</li><br/>
            <li> Virus mozaika (TMV)</li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;