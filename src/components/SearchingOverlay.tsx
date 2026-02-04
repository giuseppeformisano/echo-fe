// fe/src/components/SearchingOverlay.tsx
import React from "react";
import "./SearchingOverlay.css";
import Button from "./Button";

interface SearchingOverlayProps {
  onCancel: () => void;
}

const SearchingOverlay: React.FC<SearchingOverlayProps> = ({ onCancel }) => {
  return (
    <div className="search-overlay">
      <div className="loader-container">
        <div className="breathing-circle">
          <div className="inner-circle"></div>
        </div>
        <div className="text-content">
          <p className="main-text">Respira profondamente</p>
          <p className="sub-text">Stiamo cercando qualcuno per te...</p>
        </div>
        <Button onClick={onCancel} variant="secondary">
          Annulla
        </Button>
      </div>
    </div>
  );
};

export default SearchingOverlay;
