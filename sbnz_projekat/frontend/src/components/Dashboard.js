import React, { useState, useEffect } from 'react';
import { diagnosisAPI, backwardChainingAPI, cepAPI } from '../services/api';

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

  useEffect(() => {
    checkSystemStatus();
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
        <h2>🏠 Pregled sistema</h2>
        <p>Dobrodošli u Greenhouse Expert System - napredni ekspertski sistem za dijagnostiku biljnih bolesti.</p>
      </div>

      <div className="grid">
        <div className="card">
          <h3>📊 Status sistema</h3>
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
                  {component === 'backend' && '🖥️ Backend'}
                  {component === 'forwardChaining' && '🔄 Forward Chaining'}
                  {component === 'backwardChaining' && '🔍 Backward Chaining'}
                  {component === 'cep' && '⚡ CEP'}
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
            🔄 Osvezi status
          </button>
        </div>

        <div className="card">
          <h3>📈 Brza statistika</h3>
          <div style={{ marginTop: '20px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span>Ukupno testova:</span>
              <span style={{ fontWeight: 'bold' }}>{quickStats.totalTests}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid #eee'
            }}>
              <span>Uspešni:</span>
              <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>
                {quickStats.successfulTests}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '10px 0'
            }}>
              <span>Neuspešni:</span>
              <span style={{ fontWeight: 'bold', color: '#f44336' }}>
                {quickStats.failedTests}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>🎯 Implementirani mehanizmi</h3>
          <div style={{ marginTop: '20px' }}>
            <div className="status-badge status-high" style={{ margin: '5px', display: 'block' }}>
              🔄 Forward Chaining - 3+ nivoa ulančavanja
            </div>
            <div className="status-badge status-medium" style={{ margin: '5px', display: 'block' }}>
              🔍 Backward Chaining - Rekurzivni upiti
            </div>
            <div className="status-badge status-low" style={{ margin: '5px', display: 'block' }}>
              ⚡ CEP - Temporalni operatori
            </div>
          </div>
        </div>

        <div className="card">
          <h3>🦠 Podržane bolesti</h3>
          <ul style={{ marginTop: '15px', paddingLeft: '20px' }}>
            <li>🍅 Plamenjača (Phytophthora infestans)</li>
            <li>🤍 Pepelnica (Erysiphe cichoracearum)</li>
            <li>🫐 Siva trulež (Botrytis cinerea)</li>
            <li>🍄 Fuzarijum (Fusarium oxysporum)</li>
            <li>🦠 Virus mozaika (TMV)</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h3>🚀 Brzi testovi</h3>
        <p>Pokrenite osnovne testove sistema da proverite funkcionalnost:</p>
        <div style={{ marginTop: '15px' }}>
          <button 
            className="btn"
            onClick={() => window.location.href = '/diagnosis'}
          >
            🔄 Forward Chaining testovi
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => window.location.href = '/backward-chaining'}
          >
            🔍 Backward Chaining testovi
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => window.location.href = '/cep'}
          >
            ⚡ CEP testovi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;