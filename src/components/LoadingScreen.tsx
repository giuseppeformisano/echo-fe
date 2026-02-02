import React from 'react';
import './LoadingScreen.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Caricamento in corso...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;