import React from "react";
import "./LoadingScreen.css";

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loader-container">
        <div className="breathing-circle">
          <div className="inner-circle"></div>
        </div>
        <div className="text-content">
          <p className="main-text">Un momento...</p>
          <p className="sub-text">Stiamo preparando tutto per te</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
