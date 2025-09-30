import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import DiagnosisPage from './components/DiagnosisPage';
import BackwardChainingPage from './components/BackwardChainingPage';
import CEPPage from './components/CEPPage';
import TestDataPage from './components/TestDataPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Navigation />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/diagnosis" element={<DiagnosisPage />} />
            <Route path="/backward-chaining" element={<BackwardChainingPage />} />
            <Route path="/cep" element={<CEPPage />} />
            <Route path="/test-data" element={<TestDataPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;