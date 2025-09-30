import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav">
      <div className="container">
        <ul>
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link to="/diagnosis" className={isActive('/diagnosis') ? 'active' : ''}>
              🔄 Forward Chaining
            </Link>
          </li>
          <li>
            <Link to="/backward-chaining" className={isActive('/backward-chaining') ? 'active' : ''}>
              🔍 Backward Chaining
            </Link>
          </li>
          <li>
            <Link to="/cep" className={isActive('/cep') ? 'active' : ''}>
              ⚡ CEP Analiza
            </Link>
          </li>
          <li>
            <Link to="/test-data" className={isActive('/test-data') ? 'active' : ''}>
              🧪 Testni podaci
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;